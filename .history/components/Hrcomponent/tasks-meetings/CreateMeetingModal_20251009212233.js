"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Video, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

const HARDCODED_DEPARTMENTS = [
  { id: 'ceo', name: 'CEO', color: 'bg-blue-500' },
  { id: 'team_leader', name: 'Team Leader', color: 'bg-green-500' },
  { id: 'project_manager', name: 'Project Manager', color: 'bg-orange-500' },
  { id: 'accountant', name: 'Accountant', color: 'bg-red-500' },
  { id: 'telecaller', name: 'Telecaller', color: 'bg-indigo-500' },
  { id: 'sales', name: 'Sales', color: 'bg-cyan-500' }
]

export default function CreateMeetingModal({ open, onOpenChange, onCreateMeeting, departments }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    agenda: "",
    schedule: {
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      endTime: "11:00"
    },
    platform: "google_meet",
    meetingLink: "",
    location: "",
    departments: [],
    meetingType: "team",
    priority: "medium"
  })
  const [loading, setLoading] = useState(false)

  const availableDepartments = HARDCODED_DEPARTMENTS

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Please enter a meeting title")
      return
    }

    if (!formData.schedule.date || !formData.schedule.startTime || !formData.schedule.endTime) {
      toast.error("Please select date and time for the meeting")
      return
    }

    if (formData.platform !== 'in_person' && !formData.meetingLink) {
      toast.error("Meeting link is required for virtual meetings")
      return
    }

    if (formData.departments.length === 0) {
      toast.error("Please select at least one department")
      return
    }

    setLoading(true)
    
    try {
      console.log("📤 Sending meeting data to backend:", formData)
      
      // Call the parent function to create meeting
      await onCreateMeeting(formData)
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        agenda: "",
        schedule: {
          date: format(new Date(), "yyyy-MM-dd"),
          startTime: "10:00",
          endTime: "11:00"
        },
        platform: "google_meet",
        meetingLink: "",
        location: "",
        departments: [],
        meetingType: "team",
        priority: "medium"
      })
      
    } catch (error) {
      console.error('❌ Error in modal creating meeting:', error)
      toast.error("Failed to create meeting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleDepartment = (deptId) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.some(dept => dept.department === deptId)
        ? prev.departments.filter(dept => dept.department !== deptId)
        : [...prev.departments, { department: deptId, role: 'participant' }]
    }))
  }

  const isDepartmentSelected = (deptId) => {
    return formData.departments.some(dept => dept.department === deptId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Create New Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields remain the same */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Meeting Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meeting description"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.schedule.date}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  schedule: { ...prev.schedule, date: e.target.value } 
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input
                type="time"
                value={formData.schedule.startTime}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  schedule: { ...prev.schedule, startTime: e.target.value } 
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Input
                type="time"
                value={formData.schedule.endTime}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  schedule: { ...prev.schedule, endTime: e.target.value } 
                }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="microsoft_teams">Microsoft Teams</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Meeting Link {formData.platform !== 'in_person' && '*'}
              </Label>
              <Input
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                required={formData.platform !== 'in_person'}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Departments *</Label>
            <div className="flex flex-wrap gap-2">
              {availableDepartments.map(dept => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => toggleDepartment(dept.id)}
                  className={`px-3 py-2 rounded text-sm border ${
                    isDepartmentSelected(dept.id)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Meeting'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}