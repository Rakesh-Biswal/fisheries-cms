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

// Hardcoded departments as fallback
const HARDCODED_DEPARTMENTS = [
  { id: 'hr', name: 'HR', color: 'bg-purple-500' },
  { id: 'ceo', name: 'CEO', color: 'bg-blue-500' },
  { id: 'team_leader', name: 'Team Leader', color: 'bg-green-500' },
  { id: 'project_manager', name: 'Project Manager', color: 'bg-orange-500' },
  { id: 'accountant', name: 'Accountant', color: 'bg-red-500' },
  { id: 'telecaller', name: 'Telecaller', color: 'bg-indigo-500' },
  { id: 'sales', name: 'Sales', color: 'bg-cyan-500' }
]

export default function CreateMeetingModal({ open, onOpenChange, onCreateMeeting, departments = [] }) {
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

  // Use provided departments or fallback to hardcoded
  const availableDepartments = departments.length > 0 ? departments : HARDCODED_DEPARTMENTS

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
          <DialogDescription>
            Schedule a new meeting with departments and participants
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meeting description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                value={formData.agenda}
                onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="Meeting agenda and topics"
                rows={3}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
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
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
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
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
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

          {/* Platform & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="microsoft_teams">Microsoft Teams</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink">
                {formData.platform === 'in_person' ? 'Location' : 'Meeting Link *'}
              </Label>
              <Input
                id="meetingLink"
                value={formData.platform === 'in_person' ? formData.location : formData.meetingLink}
                onChange={(e) => {
                  if (formData.platform === 'in_person') {
                    setFormData(prev => ({ ...prev, location: e.target.value }))
                  } else {
                    setFormData(prev => ({ ...prev, meetingLink: e.target.value }))
                  }
                }}
                placeholder={
                  formData.platform === 'in_person' 
                    ? "Meeting room or location" 
                    : "https://meet.google.com/xxx-xxxx-xxx"
                }
                required={formData.platform !== 'in_person'}
              />
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <Label>Departments *</Label>
            <div className="flex flex-wrap gap-2">
              {availableDepartments.map(dept => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => toggleDepartment(dept.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    isDepartmentSelected(dept.id)
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
            {formData.departments.length === 0 && (
              <p className="text-sm text-red-500">Please select at least one department</p>
            )}
          </div>

          {/* Meeting Type & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
              >
                <SelectTrigger id="meetingType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_on_one">One-on-One</SelectItem>
                  <SelectItem value="team">Team Meeting</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="cross_department">Cross-Department</SelectItem>
                  <SelectItem value="client">Client Meeting</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="status_update">Status Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
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