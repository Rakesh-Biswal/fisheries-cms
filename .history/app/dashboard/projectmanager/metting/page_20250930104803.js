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
import { Plus, Calendar, Link as LinkIcon, UploadCloud, X, Clock } from "lucide-react"

/**
 * MeetingPage with Calendar Feature
 */

export default function MeetingPage() {
  // UI state
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
  
  // Calendar feature state
  const [showCalendar, setShowCalendar] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  // Mock meeting data based on your image
  const mockMeetings = [
    {
      id: "m1",
      title: "Kam Moody",
      date: "2019-10-01",
      startTime: "07:00",
      endTime: "07:30",
      room: "MR 'Langer' (in)",
      participants: ["e1"],
      notes: "Morning briefing",
      status: "completed"
    },
    {
      id: "m2",
      title: "Your reserve",
      date: "2019-10-01", 
      startTime: "07:30",
      endTime: "08:00",
      room: "MR 'Hull' (2n)",
      participants: ["e2"],
      notes: "Reserve meeting",
      status: "completed"
    },
    {
      id: "m3",
      title: "Kim Nightly",
      date: "2019-10-01",
      startTime: "09:00",
      endTime: "10:00",
      room: "MR 'Langer' (in)",
      participants: ["e1", "e3"],
      notes: "Project review",
      status: "completed"
    },
    {
      id: "m4",
      title: "Alina Doram",
      date: "2019-10-01",
      startTime: "11:00",
      endTime: "12:00",
      room: "MR 'Langer' (in)",
      participants: ["e1"],
      notes: "Client meeting",
      status: "completed"
    },
    {
      id: "m5",
      title: "Jinya Koleova",
      date: "2019-10-01",
      startTime: "12:00",
      endTime: "13:00",
      room: "MR 'Langer' (in)",
      participants: ["e2", "e3"],
      notes: "Team lunch meeting",
      status: "completed"
    }
  ]

  // Time slots for the calendar
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"
  ]

  // Meeting rooms
  const meetingRooms = [
    "MR 'Langer' (in)",
    "MR 'Small' (in)", 
    "MR 'Hull' (2n)"
  ]

  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = [
          { id: "e1", name: "Amit Kumar", email: "amit@company.com" },
          { id: "e2", name: "Sonal R", email: "sonal@company.com" },
          { id: "e3", name: "Rakesh P", email: "rakesh@company.com" },
        ]
        setEmployees(data)
      } catch (err) {
        console.error("Error fetching employees", err)
        setEmployees([])
      }
    }
    fetchEmployees()
  }, [])

  // Fetch meeting history
  useEffect(() => {
    async function fetchMeetingHistory() {
      try {
        setMeetingHistory(mockMeetings)
      } catch (err) {
        console.error("Error fetching meeting history", err)
        setMeetingHistory([])
      }
    }
    
    if (showCalendar) {
      fetchMeetingHistory()
    }
  }, [showCalendar])

  // Calendar functions
  const openCalendar = () => {
    setShowCalendar(true)
  }

  const closeCalendar = () => {
    setShowCalendar(false)
    setSelectedMeeting(null)
  }

  const getMeetingsForTimeAndRoom = (time, room) => {
    return meetingHistory.filter(meeting => {
      const meetingStart = meeting.startTime
      const meetingEnd = meeting.endTime
      return meeting.room === room && meetingStart <= time && meetingEnd > time
    })
  }

  const formatTimeDisplay = (startTime, endTime) => {
    return `${startTime}–${endTime}`
  }

  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id)
    return employee ? employee.name : id
  }

  // Original meeting scheduling functions (unchanged)
  function addSlot() {
    const s = { id: Date.now() + Math.random(), date: "", startTime: "", endTime: "" }
    setSlots((p) => [...p, s])
  }

  function removeSlot(id) {
    setSlots((p) => p.filter((s) => s.id !== id))
  }

  function updateSlot(id, field, value) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  function toggleEmployee(id) {
    setSelectedEmployeeIds((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      setSelectAll(false)
      return copy
    })
  }

  function handleSelectAll(checked) {
    setSelectAll(checked)
    if (checked) {
      setSelectedEmployeeIds(new Set(employees.map((e) => e.id)))
    } else {
      setSelectedEmployeeIds(new Set())
    }
  }

  function isValidGoogleMeetLink(link) {
    if (!link) return false
    return /meet\.google\.com/.test(link)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidGoogleMeetLink(googleMeetLink)) {
      alert("Please enter a valid Google Meet link (meet.google.com).")
      return
    }
    if (selectedEmployeeIds.size === 0) {
      if (!confirm("No sales employee selected. Do you want to create meeting with no participants?")) {
        return
      }
    }
    for (const s of slots) {
      if (!s.date || !s.startTime) {
        alert("Please fill date and start time for all time slots.")
        return
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        title: meetingTitle || "Sales Meeting",
        link: googleMeetLink,
        notes,
        slots,
        participants: Array.from(selectedEmployeeIds),
      }

      const created = {
        id: "m_" + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      }

      setMeetingCreated(created)
      alert("Meeting created successfully (frontend). Replace mock with backend endpoint to persist & notify.")
    } catch (err) {
      console.error(err)
      alert("Error creating meeting. See console.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleScreenshotChange(file) {
    setScreenshotFile(file)
  }

  function handleReportChange(file) {
    setReportFile(file)
  }

  async function handleUploadFiles() {
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
      await new Promise((r) => setTimeout(r, 900))
      alert("Files uploaded (mock). Replace with your backend upload endpoint.")
      setScreenshotFile(null)
      setReportFile(null)
    } catch (err) {
      console.error(err)
      alert("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  function slotLabel(s) {
    if (!s.date || !s.startTime) return "Incomplete slot"
    return `${s.date} ${s.startTime}${s.endTime ? " - " + s.endTime : ""}`
  }

  return (
    <DashboardLayout title="Meeting">
      <div className="space-y-6">
        {/* Calendar Icon Button */}
        <div className="flex justify-end">
          <Button 
            onClick={openCalendar}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            View Meeting Calendar
          </Button>
        </div>

        {/* Rest of your existing meeting scheduling UI remains the same */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Schedule Meeting</CardTitle>
              <div className="text-sm text-gray-500">Team Leader — create meeting and set slots</div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... existing form content ... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input id="title" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="e.g. Weekly Sales Sync" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Google Meet Link</Label>
                  <div className="flex gap-2">
                    <Input id="link" value={googleMeetLink} onChange={(e) => setGoogleMeetLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
                    <Button type="button" variant="outline" onClick={() => window.open("https://meet.google.com", "_blank")}>
                      <LinkIcon className="w-4 h-4 mr-2" /> Open Meet
                    </Button>
                  </div>
                  {!isValidGoogleMeetLink(googleMeetLink) && googleMeetLink ? (
                    <div className="text-sm text-red-600 mt-1">Link doesn't look like a Google Meet link.</div>
                  ) : null}
                </div>
              </div>

              <div>
                <Label>Time Slots</Label>
                <div className="space-y-3 mt-2">
                  {slots.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2 border rounded p-3">
                      <div className="flex gap-2 items-center w-full">
                        <input
                          type="date"
                          value={s.date}
                          onChange={(e) => updateSlot(s.id, "date", e.target.value)}
                          className="p-2 rounded border"
                        />
                        <input
                          type="time"
                          value={s.startTime}
                          onChange={(e) => updateSlot(s.id, "startTime", e.target.value)}
                          className="p-2 rounded border"
                        />
                        <input
                          type="time"
                          value={s.endTime}
                          onChange={(e) => updateSlot(s.id, "endTime", e.target.value)}
                          className="p-2 rounded border"
                        />
                        <div className="text-sm text-gray-500">{slotLabel(s)}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button type="button" variant="outline" onClick={() => removeSlot(s.id)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button type="button" onClick={addSlot}><Plus className="w-4 h-4 mr-2" /> Add Slot</Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Choose Sales Employees</Label>
                <div className="mt-2 border rounded p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      id="selectAll"
                    />
                    <Label htmlFor="selectAll" className="mb-0">Select All</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {employees.map((emp) => (
                      <label key={emp.id} className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.has(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                        />
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{emp.name}</span>
                          <span className="text-gray-500 text-xs">{emp.email}</span>
                        </div>
                      </label>
                    ))}
                    {employees.length === 0 && <div className="text-sm text-gray-500">No employees loaded.</div>}
                  </div>
                </div>
              </div>

              <div>
                <Label>Notes / Agenda</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Meeting agenda or notes..." />
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Meeting"}</Button>
                {meetingCreated && <Badge className="ml-2">Created: {new Date(meetingCreated.createdAt).toLocaleString()}</Badge>}
                <div className="text-sm text-gray-500 ml-auto">Notifications: browser notifications will be scheduled (page must be open)</div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Upload section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Meeting Screenshot & Daily Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Meeting Screenshot (time photo)</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScreenshotChange(e.target.files?.[0] ?? null)}
                />
                {screenshotFile && <div className="text-sm">{screenshotFile.name} <Button size="sm" variant="ghost" onClick={() => setScreenshotFile(null)}>Remove</Button></div>}
              </div>

              <div className="space-y-2">
                <Label>Daily Report (PDF / doc)</Label>
                <input
                  type="file"
                  accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => handleReportChange(e.target.files?.[0] ?? null)}
                />
                {reportFile && <div className="text-sm">{reportFile.name} <Button size="sm" variant="ghost" onClick={() => setReportFile(null)}>Remove</Button></div>}
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <Button onClick={handleUploadFiles} disabled={uploading}><UploadCloud className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload Files"}</Button>
                <div className="text-sm text-gray-500">Upload files after meeting concludes. Files will be attached to the meeting record.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting summary */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {meetingCreated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{meetingCreated.title}</h3>
                    <div className="text-sm text-gray-600">Link: <a href={meetingCreated.link} target="_blank" rel="noreferrer" className="underline">{meetingCreated.link}</a></div>
                  </div>
                  <div>
                    <Badge>Participants: {meetingCreated.participants.length}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium">Slots</h4>
                    <ul className="list-disc pl-5">
                      {meetingCreated.slots.map((s, i) => (
                        <li key={i}>{slotLabel(s)}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Participants</h4>
                    <ul className="list-disc pl-5">
                      {meetingCreated.participants.length > 0 ? (
                        meetingCreated.participants.map((id) => {
                          const emp = employees.find((e) => e.id === id)
                          return <li key={id}>{emp ? emp.name + " (" + emp.email + ")" : id}</li>
                        })
                      ) : (
                        <li className="text-gray-500">No participants selected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No meeting created yet. Fill the form above and click Create Meeting.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar Modal - Designed like your image */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Meeting Calendar - October 2019</span>
              </div>
              <Button variant="ghost" size="sm" onClick={closeCalendar}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Click on any meeting to view details
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-4 bg-gray-100 border-b">
              <div className="p-3 font-semibold border-r">Time</div>
              {meetingRooms.map(room => (
                <div key={room} className="p-3 font-semibold text-center border-r last:border-r-0">
                  {room}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="divide-y">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-4">
                  {/* Time Column */}
                  <div className="p-4 border-r bg-gray-50 font-medium">
                    {time}
                  </div>
                  
                  {/* Meeting Rooms Columns */}
                  {meetingRooms.map(room => {
                    const meetings = getMeetingsForTimeAndRoom(time, room)
                    return (
                      <div 
                        key={room} 
                        className="p-2 border-r last:border-r-0 min-h-[80px] relative"
                      >
                        {meetings.map(meeting => (
                          <div
                            key={meeting.id}
                            className="bg-blue-100 border border-blue-300 rounded p-2 mb-1 cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => setSelectedMeeting(meeting)}
                          >
                            <div className="font-semibold text-sm">
                              {meeting.title}
                            </div>
                            <div className="text-xs text-blue-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeDisplay(meeting.startTime, meeting.endTime)}
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
            <div className="border rounded-lg p-4 bg-gray-50 mt-4">
              <h3 className="font-semibold text-lg mb-3">{selectedMeeting.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="space-y-2">
                    <div><strong>Date:</strong> {new Date(selectedMeeting.date).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {selectedMeeting.startTime} - {selectedMeeting.endTime}</div>
                    <div><strong>Room:</strong> {selectedMeeting.room}</div>
                    <div><strong>Status:</strong> <Badge variant="secondary">{selectedMeeting.status}</Badge></div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <div>
                      <strong>Participants:</strong>
                      <div className="mt-1">
                        {selectedMeeting.participants.map(id => (
                          <Badge key={id} variant="outline" className="mr-1 mb-1">
                            {getEmployeeName(id)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedMeeting.notes && (
                      <div>
                        <strong>Notes:</strong>
                        <p className="mt-1 text-gray-600">{selectedMeeting.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Scheduled Meeting</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}