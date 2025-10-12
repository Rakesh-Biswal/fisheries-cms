// /dashboard/projectmanager/meeting/page.js
"use client"

import { useEffect, useState, useRef } from "react"
import DashboardLayout from "@/components/PM_Component/dashboard-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Calendar, Link as LinkIcon, UploadCloud, X, Clock, Users } from "lucide-react"

export default function MeetingPage() {
  // Meeting scheduling state
  const [meetingTitle, setMeetingTitle] = useState("")
  const [googleMeetLink, setGoogleMeetLink] = useState("")
  const [slots, setSlots] = useState([
    { id: Date.now(), date: "", startTime: "", endTime: "" },
  ])
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [meetingCreated, setMeetingCreated] = useState(null)
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [reportFile, setReportFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [calendarView, setCalendarView] = useState('day') // 'day' or 'week'

  // Time slots for calendar (6 AM to 8 PM)
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6
    return `${hour.toString().padStart(2, '0')}:00`
  })

  // Meeting rooms
  const meetingRooms = [
    "Conference Room A",
    "Conference Room B", 
    "Virtual Meeting Room",
    "Team Collaboration Room"
  ]

  // Fetch employees from backend
  useEffect(() => {
    async function fetchEmployees() {
      try {
        // TODO: Replace with actual API call
        // const res = await fetch("/api/employees")
        // const data = await res.json()
        const data = [
          { id: "e1", name: "Amit Kumar", email: "amit@company.com" },
          { id: "e2", name: "Sonal R", email: "sonal@company.com" },
          { id: "e3", name: "Rakesh P", email: "rakesh@company.com" },
          { id: "e4", name: "Priya S", email: "priya@company.com" },
          { id: "e5", name: "Rahul M", email: "rahul@company.com" },
        ]
        setEmployees(data)
      } catch (err) {
        console.error("Error fetching employees", err)
        setEmployees([])
      }
    }
    fetchEmployees()
  }, [])

  // Fetch meeting history from backend
  useEffect(() => {
    async function fetchMeetingHistory() {
      try {
        // TODO: Replace with actual API call
        // const res = await fetch("/api/meetings")
        // const data = await res.json()
        // setMeetingHistory(data)
        
        // For now, using empty array - will be populated from backend
        setMeetingHistory([])
      } catch (err) {
        console.error("Error fetching meeting history", err)
        setMeetingHistory([])
      }
    }
    
    if (showCalendar) {
      fetchMeetingHistory()
    }
  }, [showCalendar])

  // Get meetings for specific date and room
  const getMeetingsForTimeAndRoom = (time, room, date = selectedDate) => {
    return meetingHistory.filter(meeting => {
      const meetingStart = meeting.startTime
      const meetingEnd = meeting.endTime
      return meeting.room === room && 
             meeting.date === date && 
             meetingStart <= time && 
             meetingEnd > time
    })
  }

  // Get all meetings for selected date
  const getMeetingsForSelectedDate = () => {
    return meetingHistory.filter(meeting => meeting.date === selectedDate)
  }

  // Format time display
  const formatTimeDisplay = (startTime, endTime) => {
    return `${startTime}–${endTime}`
  }

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id)
    return employee ? employee.name : id
  }

  // Calendar navigation
  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate)
    if (calendarView === 'day') {
      currentDate.setDate(currentDate.getDate() + direction)
    } else {
      currentDate.setDate(currentDate.getDate() + (direction * 7))
    }
    setSelectedDate(currentDate.toISOString().split('T')[0])
  }

  // Get formatted date title
  const getDateTitle = () => {
    const date = new Date(selectedDate)
    if (calendarView === 'day') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } else {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
    }
  }

  // Meeting scheduling functions
  const addSlot = () => {
    const s = { id: Date.now() + Math.random(), date: "", startTime: "", endTime: "" }
    setSlots((p) => [...p, s])
  }

  const removeSlot = (id) => {
    setSlots((p) => p.filter((s) => s.id !== id))
  }

  const updateSlot = (id, field, value) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const toggleEmployee = (id) => {
    setSelectedEmployeeIds((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      setSelectAll(false)
      return copy
    })
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedEmployeeIds(new Set(employees.map((e) => e.id)))
    } else {
      setSelectedEmployeeIds(new Set())
    }
  }

  const isValidGoogleMeetLink = (link) => {
    if (!link) return false
    return /meet\.google\.com/.test(link)
  }

// In your MeetingPage component
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic validation
  if (!isValidGoogleMeetLink(googleMeetLink)) {
    alert("Please enter a valid Google Meet link (meet.google.com).");
    return;
  }

  if (selectedEmployeeIds.size === 0) {
    if (!confirm("No sales employee selected. Do you want to create meeting with no participants?")) {
      return;
    }
  }

  // Validate slots quickly
  const invalidSlot = slots.find(s => !s.date || !s.startTime);
  if (invalidSlot) {
    alert("Please fill date and start time for all time slots.");
    return;
  }

  setSubmitting(true);
  
  try {
    // Prepare payload with CORRECT field names that match backend schema
    const payload = {
      title: meetingTitle || "Sales Meeting",
      googleMeetLink: googleMeetLink, // Changed from 'link' to 'googleMeetLink'
      description: notes, // Changed from 'notes' to 'description'
      timeSlots: slots.map(slot => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime || calculateEndTime(slot.startTime)
      })),
      participants: Array.from(selectedEmployeeIds).map(id => {
        const emp = employees.find(e => e.id === id);
        return {
          employeeId: id,
          name: emp?.name || 'Unknown',
          email: emp?.email || '',
          employeeType: 'sales'
        };
      }),
      agenda: notes, // Keep this as backup
      meetingType: 'team',
      priority: 'medium'
    };

    console.log("Sending payload:", payload);

    // API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/team-leader/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Remove Authorization header if using mock auth
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      setMeetingCreated(result.data);
      
      // Reset form
      setMeetingTitle("");
      setGoogleMeetLink("");
      setSlots([{ id: Date.now(), date: "", startTime: "", endTime: "" }]);
      setSelectedEmployeeIds(new Set());
      setNotes("");
      setSelectAll(false);
      
      alert("Meeting created successfully!");
    } else {
      throw new Error(result.message || "Failed to create meeting");
    }

  } catch (error) {
    console.error("Meeting creation error:", error);
    
    if (error.name === 'AbortError') {
      alert("Request timed out. Please try again.");
    } else {
      alert(`Error creating meeting: ${error.message}`);
    }
  } finally {
    setSubmitting(false);
  }
};

// Helper function to calculate end time
const calculateEndTime = (startTime, duration = 60) => {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTime = new Date();
  endTime.seSconst handleScreenshotChange = (file) => {
    setScreenshotFile(file)
  }

  const handleReportChange = (file) => {
    setReportFile(file)
  }

  const handleUploadFiles = async () => {
    if (!meetingCreated) {
      alert("Create a meeting first, then upload files.")
      return
    }
    if (!screenshotFile && !reportFile) {
      alert("Select screenshot or daily report to upload.")
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      if (screenshotFile) form.append("screenshot", screenshotFile)
      if (reportFile) form.append("report", reportFile)
      form.append("meetingId", meetingCreated.id)

      // TODO: Replace with actual API call
      // await fetch(`/api/meetings/${meetingCreated.id}/upload`, {
      //   method: "POST",
      //   body: form
      // })

      await new Promise((r) => setTimeout(r, 1000))
      alert("Files uploaded successfully!")
      setScreenshotFile(null)
      setReportFile(null)
    } catch (err) {
      console.error(err)
      alert("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const slotLabel = (s) => {
    if (!s.date || !s.startTime) return "Incomplete slot"
    return `${s.date} ${s.startTime}${s.endTime ? " - " + s.endTime : ""}`
  }

  return (
    <DashboardLayout title="Meeting Management">
      <div className="space-y-6">
        {/* Calendar Access Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Meeting Management</h1>
            <p className="text-gray-600">Schedule and manage team meetings</p>
          </div>
          <Button 
            onClick={() => setShowCalendar(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            View Calendar
          </Button>
        </div>

        {/* Meeting Scheduling Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Schedule New Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meeting Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input 
                    id="title" 
                    value={meetingTitle} 
                    onChange={(e) => setMeetingTitle(e.target.value)} 
                    placeholder="e.g. Weekly Sales Sync" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Google Meet Link *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="link" 
                      value={googleMeetLink} 
                      onChange={(e) => setGoogleMeetLink(e.target.value)} 
                      placeholder="https://meet.google.com/xxx-xxxx-xxx" 
                      required
                    />
                    <Button type="button" variant="outline" onClick={() => window.open("https://meet.google.com", "_blank")}>
                      <LinkIcon className="w-4 h-4 mr-2" /> Create
                    </Button>
                  </div>
                  {!isValidGoogleMeetLink(googleMeetLink) && googleMeetLink ? (
                    <div className="text-sm text-red-600 mt-1">Please enter a valid Google Meet link</div>
                  ) : null}
                </div>
              </div>

              {/* Time Slots - Multiple meetings per day */}
              <div>
                <Label>Meeting Time Slots *</Label>
                <p className="text-sm text-gray-500 mb-3">Add multiple slots for the same day or different days</p>
                <div className="space-y-3">
                  {slots.map((slot, idx) => (
                    <div key={slot.id} className="flex items-center gap-3 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={slot.date}
                            onChange={(e) => updateSlot(slot.id, "date", e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(slot.id, "startTime", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(slot.id, "endTime", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 pt-6">
                        {slots.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeSlot(slot.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={addSlot} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Another Time Slot
                  </Button>
                </div>
              </div>

              {/* Participants */}
              <div>
                <Label>Select Participants</Label>
                <div className="mt-2 border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      id="selectAll"
                    />
                    <Label htmlFor="selectAll" className="mb-0 font-medium">Select All Employees</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {employees.map((emp) => (
                      <label key={emp.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.has(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                          className="rounded"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{emp.name}</span>
                          <span className="text-gray-500 text-xs">{emp.email}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {employees.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No employees found
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Meeting Agenda & Notes</Label>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Enter meeting agenda, discussion points, or any important notes..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={submitting} size="lg">
                  {submitting ? "Scheduling..." : "Schedule Meeting"}
                </Button>
                <div className="text-sm text-gray-500">
                  {selectedEmployeeIds.size > 0 ? (
                    `${selectedEmployeeIds.size} participant${selectedEmployeeIds.size > 1 ? 's' : ''} selected`
                  ) : (
                    "No participants selected"
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5" />
              Meeting Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Meeting Screenshot</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleScreenshotChange(e.target.files?.[0] ?? null)}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {screenshotFile ? screenshotFile.name : "Click to upload meeting screenshot"}
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Daily Report</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleReportChange(e.target.files?.[0] ?? null)}
                    className="hidden"
                    id="report-upload"
                  />
                  <label htmlFor="report-upload" className="cursor-pointer">
                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {reportFile ? reportFile.name : "Click to upload daily report"}
                    </div>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <Button 
                  onClick={handleUploadFiles} 
                  disabled={uploading || (!screenshotFile && !reportFile)}
                  className="w-full"
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Documents"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-70xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Meeting Calendar
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription>
              View and manage all scheduled meetings
            </DialogDescription>
          </DialogHeader>

          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigateDate(-1)}>
                Previous
              </Button>
              <div className="text-lg font-semibold min-w-[300px] text-center">
                {getDateTitle()}
              </div>
              <Button variant="outline" onClick={() => navigateDate(1)}>
                Next
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={calendarView === 'day' ? 'default' : 'outline'}
                onClick={() => setCalendarView('day')}
                size="sm"
              >
                Day View
              </Button>
              <Button
                variant={calendarView === 'week' ? 'default' : 'outline'}
                onClick={() => setCalendarView('week')}
                size="sm"
              >
                Week View
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-gray-100 border-b">
              <div className="p-4 font-semibold border-r">Time</div>
              {meetingRooms.map(room => (
                <div key={room} className="p-4 font-semibold text-center border-r last:border-r-0">
                  {room}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="divide-y">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-5">
                  {/* Time Column */}
                  <div className="p-4 border-r bg-gray-50 font-medium flex items-center justify-between">
                    <span>{time}</span>
                    <Badge variant="outline" className="text-xs">
                      {getMeetingsForSelectedDate().filter(m => m.startTime === time).length}
                    </Badge>
                  </div>
                  
                  {/* Meeting Rooms */}
                  {meetingRooms.map(room => {
                    const meetings = getMeetingsForTimeAndRoom(time, room)
                    return (
                      <div 
                        key={room} 
                        className="p-2 border-r last:border-r-0 min-h-[100px] relative bg-white"
                      >
                        {meetings.map(meeting => (
                          <div
                            key={meeting.id}
                            className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-2 cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => setSelectedMeeting(meeting)}
                          >
                            <div className="font-semibold text-sm mb-1">
                              {meeting.title}
                            </div>
                            <div className="text-xs text-blue-700 flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeDisplay(meeting.startTime, meeting.endTime)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {meeting.participants.length} participant{meeting.participants.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Meeting Details */}
          {selectedMeeting && (
            <div className="border rounded-lg p-6 bg-gray-50 mt-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">{selectedMeeting.title}</h3>
                <Badge variant={selectedMeeting.status === 'completed' ? 'default' : 'secondary'}>
                  {selectedMeeting.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Meeting Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(selectedMeeting.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span>{selectedMeeting.startTime} - {selectedMeeting.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span>{selectedMeeting.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meeting Link:</span>
                        <a href={selectedMeeting.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.participants.map(id => (
                        <Badge key={id} variant="outline" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {getEmployeeName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedMeeting.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                        {selectedMeeting.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {getMeetingsForSelectedDate().length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Meetings Scheduled</h3>
              <p className="text-gray-600 mb-4">No meetings are scheduled for {getDateTitle()}</p>
              <Button onClick={() => setShowCalendar(false)}>
                Schedule a Meeting
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}