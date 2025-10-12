"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

const departmentOptions = [
  { value: 'ceo', label: 'CEO' },
  { value: 'hr', label: 'HR' },
  { value: 'team-leader', label: 'Team Leader' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'sales-employee', label: 'Sales Employee' },
  { value: 'telecaller', label: 'Telecaller' },
  { value: 'accountant', label: 'Accountant' }
]

export default function MeetingModal({ 
  open, 
  onOpenChange, 
  meeting = null,
  onMeetingCreated,
  onMeetingUpdated 
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    participants: [],
    platform: 'Google Meet',
    meetingLink: ''
  })

  useEffect(() => {
    if (open) {
      if (meeting) {
        // Edit mode - populate form with existing data
        setFormData({
          title: meeting.title || '',
          description: meeting.description || '',
          meetingDate: meeting.meetingDate ? new Date(meeting.meetingDate).toISOString().split('T')[0] : '',
          startTime: meeting.startTime || '',
          endTime: meeting.endTime || '',
          participants: meeting.participants?.map(p => p.department) || [],
          platform: meeting.platform || 'Google Meet',
          meetingLink: meeting.meetingLink || ''
        })
      } else {
        // Create mode - reset form
        const today = new Date().toISOString().split('T')[0]
        setFormData({
          title: '',
          description: '',
          meetingDate: today,
          startTime: '',
          endTime: '',
          participants: [],
          platform: 'Google Meet',
          meetingLink: ''
        })
      }
    }
  }, [open, meeting])

  const handleParticipantToggle = (department) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(department)
        ? prev.participants.filter(d => d !== department)
        : [...prev.participants, department]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.meetingDate || 
        !formData.startTime || !formData.endTime || formData.participants.length === 0) {
      toast.error('Please fill all required fields and select at least one participant')
      return
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time')
      return
    }

    setLoading(true)
    try {
      const url = meeting 
        ? `${API_URL}/api/hr/meetings/${meeting._id}`
        : `${API_URL}/api/hr/meetings`
      
      const method = meeting ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          participants: formData.participants.map(dept => ({
            department: dept,
            role: dept
          }))
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        if (meeting) {
          toast.success('Meeting updated successfully')
          onMeetingUpdated?.(result.data)
        } else {
          toast.success('Meeting created successfully')
          onMeetingCreated?.(result.data)
        }
        
        onOpenChange(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || `Failed to ${meeting ? 'update' : 'create'} meeting`)
      }
    } catch (error) {
      console.error(`Error ${meeting ? 'updating' : 'creating'} meeting:`, error)
      toast.error(error.message || `Failed to ${meeting ? 'update' : 'create'} meeting`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {meeting ? 'Edit Meeting' : 'Create New Meeting'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Title */}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the meeting agenda..."
              rows={4}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingDate">Meeting Date *</Label>
              <Input
                id="meetingDate"
                type="date"
                value={formData.meetingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingDate: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Platform and Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Zoom Meeting">Zoom Meeting</SelectItem>
                  <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                  <SelectItem value="Webex">Webex</SelectItem>
                  <SelectItem value="In Person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label>Participants *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {departmentOptions.map((dept) => (
                <div key={dept.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={dept.value}
                    checked={formData.participants.includes(dept.value)}
                    onCheckedChange={() => handleParticipantToggle(dept.value)}
                  />
                  <Label
                    htmlFor={dept.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {dept.label}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.participants.map(dept => (
                  <Badge key={dept} variant="secondary">
                    {departmentOptions.find(d => d.value === dept)?.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (meeting ? "Updating..." : "Creating...") 
                : (meeting ? "Update Meeting" : "Create Meeting")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}