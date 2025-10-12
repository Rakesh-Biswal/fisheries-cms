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

// Hardcoded departments - this will always work
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
    priority: "medium",
    participants: []
  })
  const [loading, setLoading] = useState(false)

  // Always use hardcoded departments to ensure they work
  const availableDepartments = HARDCODED_DEPARTMENTS

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Please enter a meeting title")
      return
    }

    if (!formData.schedule.date || !formData.schedule.startTime || !formData.schedule.endTime) {
      toast.error("Please select date and time for the meeting")
      return
    }

    // Validate meeting link for virtual meetings
    if (formData.platform !== 'in_person' && !formData.meetingLink) {
      toast.error("Meeting link is required for virtual meetings")
      return
    }

    // Validate at least one department is selected
    if (formData.departments.length === 0) {
      toast.error("Please select at least one department")
      return
    }

    setLoading(true)
    
    try {
      await onCreateMeeting(formData)
      
      // Reset form on success
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
        priority: "medium",
        participants: []
      })
      
      toast.success("Meeting created successfully!")
    } catch (error) {
      console.error('Error creating meeting:', error)
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

  const getDepartmentColor = (dept) => {
    const colorMap = {
      'bg-blue-500': 'bg-blue-500',
      'bg-green-500': 'bg-green-500', 
      'bg-orange-500': 'bg-orange-500',
      'bg-red-500': 'bg-red-500',
      'bg-indigo-500': 'bg-indigo-500',
      'bg-cyan-500': 'bg-cyan-500',
      'bg-purple-500': 'bg-purple-500'
    }
    return colorMap[dept.color] || 'bg-blue-500'
  }

  const handlePlatformChange = (platform) => {
    setFormData(prev => ({ 
      ...prev, 
      platform,
      // Clear meeting link if switching to in_person
      meetingLink: platform === 'in_person' ? '' : prev.meetingLink
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Video className="h-5 w-5" />
            Create New Meeting
          </DialogTitle>
          <DialogDescription className="text-base">
            Schedule a meeting with other departments
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Users className="h-4 w-4" />
              Meeting Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Meeting Title *</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Meeting description..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda" className="text-sm font-medium">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                  placeholder="Meeting agenda..."
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.schedule.date}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule, date: e.target.value } 
                  }))}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={formData.schedule.startTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule, startTime: e.target.value } 
                  }))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={formData.schedule.endTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule, endTime: e.target.value } 
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Platform & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Video className="h-4 w-4" />
              Platform & Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-sm font-medium">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={handlePlatformChange}
                >
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="meetingLink" className="text-sm font-medium">
                  Meeting Link {formData.platform !== 'in_person' && '*'}
                </Label>
                <Input
                  id="meetingLink"
                  type="url"
                  required={formData.platform !== 'in_person'}
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full"
                  disabled={formData.platform === 'in_person'}
                />
                {formData.platform === 'in_person' && (
                  <p className="text-xs text-gray-500">Meeting link not required for in-person meetings</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={formData.platform === 'in_person' ? "Enter meeting location" : "Optional location details"}
                className="w-full"
              />
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Users className="h-4 w-4" />
              Departments *
            </h3>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Departments to Invite</Label>
              <div className="flex flex-wrap gap-3">
                {availableDepartments.map(dept => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleDepartment(dept.id)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all duration-200 flex items-center gap-2 ${
                      isDepartmentSelected(dept.id)
                        ? `${getDepartmentColor(dept)} text-white border-transparent shadow-md scale-105`
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span>{dept.name}</span>
                    {isDepartmentSelected(dept.id) && (
                      <span className="text-white">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className={`text-sm mt-2 ${
                formData.departments.length > 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {formData.departments.length > 0 
                  ? `✅ Selected ${formData.departments.length} department(s)`
                  : '⚠️ Please select at least one department'
                }
              </div>
            </div>
          </div>

          {/* Meeting Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Meeting Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingType" className="text-sm font-medium">Meeting Type</Label>
                <Select
                  value={formData.meetingType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_on_one">One on One</SelectItem>
                    <SelectItem value="team">Team Meeting</SelectItem>
                    <SelectItem value="department">Department Meeting</SelectItem>
                    <SelectItem value="cross_department">Cross Department</SelectItem>
                    <SelectItem value="client">Client Meeting</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="status_update">Status Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="w-full">
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
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                // Reset form when closing
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
                  priority: "medium",
                  participants: []
                })
              }}
              disabled={loading}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                loading || 
                !formData.title.trim() || 
                !formData.schedule.date || 
                !formData.schedule.startTime || 
                !formData.schedule.endTime || 
                formData.departments.length === 0 || 
                (formData.platform !== 'in_person' && !formData.meetingLink)
              }
              className="min-w-24 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
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