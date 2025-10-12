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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
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
        priority: "medium",
        participants: []
      })
    } catch (error) {
      console.error('Error creating meeting:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDepartment = (deptId) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter(id => id !== deptId)
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
            Schedule a meeting with other departments
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Meeting Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Meeting description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                  placeholder="Meeting agenda..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={formData.schedule.startTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule, startTime: e.target.value } 
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={formData.schedule.endTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule, endTime: e.target.value } 
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Platform & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Video className="h-4 w-4" />
              Platform & Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
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
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingLink">
                  Meeting Link {formData.platform !== 'in_person' && '*'}
                </Label>
                <Input
                  id="meetingLink"
                  type="url"
                  required={formData.platform !== 'in_person'}
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Meeting location"
              />
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Departments
            </h3>
            
            <div className="space-y-2">
              <Label>Select Departments to Invite</Label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleDepartment(dept.id)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isDepartmentSelected(dept.id)
                        ? `${dept.color} text-white border-transparent`
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meeting Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Meeting Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingType">Meeting Type</Label>
                <Select
                  value={formData.meetingType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
                >
                  <SelectTrigger>
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
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
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