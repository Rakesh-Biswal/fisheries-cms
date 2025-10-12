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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Calendar, Link as LinkIcon, UploadCloud, X } from "lucide-react"

/**
 * MeetingPage
 *
 * Frontend-only page for scheduling meetings between Team Leader and Sales Employees.
 *
 * Expected backend endpoints (you will provide later):
 *  - GET  /api/employees                -> returns list of sales employees [{ id, name, email }]
 *  - POST /api/meetings                 -> create meeting, payload includes link, slots, participants
 *  - POST /api/meetings/:id/upload      -> upload screenshot/daily report (multipart/form-data)
 *  - GET  /api/meetings/history         -> returns all meeting history
 *
 * Notes:
 *  - Browser notifications are scheduled client-side (requires permission and that the page/tab remains open).
 *  - Replace mock `fetchEmployees()` with real fetch to your backend.
 */

export default function MeetingPage() {
  // UI state
  const [meetingTitle, setMeetingTitle] = useState("")
  const [googleMeetLink, setGoogleMeetLink] = useState("")
  const [slots, setSlots] = useState([
    // default one slot
    { id: Date.now(), date: "", startTime: "", endTime: "" },
  ])
  const [employees, setEmployees] = useState([]) // fetched from backend
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [meetingCreated, setMeetingCreated] = useState(null) // saved meeting object from backend
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [reportFile, setReportFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  // Calendar feature state
  const [showCalendar, setShowCalendar] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState([])
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  const slotsRef = useRef(0)

  // Fetch employees (mock here; replace with real backend call)
  useEffect(() => {
    async function fetchEmployees() {
      try {
        // TODO: replace with: const res = await fetch("/api/employees"); const data = await res.json()
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

  // Fetch meeting history (mock - replace with real backend call)
  useEffect(() => {
    async function fetchMeetingHistory() {
      try {
        // TODO: replace with: const res = await fetch("/api/meetings/history"); const data = await res.json()
        const mockHistory = [
          {
            id: "m1",
            title: "Weekly Sales Sync",
            link: "https://meet.google.com/abc-def-ghi",
            date: new Date().toISOString().split('T')[0],
            startTime: "10:00",
            endTime: "11:00",
            participants: ["e1", "e2"],
            notes: "Discussion on Q3 targets",
            status: "completed",
            screenshot: "screenshot1.jpg",
            report: "report1.pdf"
          },
          {
            id: "m2", 
            title: "Client Review Meeting",
            link: "https://meet.google.com/xyz-uvw-rst",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
            startTime: "14:00",
            endTime: "15:00",
            participants: ["e1", "e3"],
            notes: "Client feedback session",
            status: "completed",
            screenshot: "screenshot2.jpg",
            report: "report2.pdf"
          }
        ]
        setMeetingHistory(mockHistory)
      } catch (err) {
        console.error("Error fetching meeting history", err)
        setMeetingHistory([])
      }
    }
    
    if (showCalendar) {
      fetchMeetingHistory()
    }
  }, [showCalendar])

  // helper: add a new empty time slot
  function addSlot() {
    const s = { id: Date.now() + Math.random(), date: "", startTime: "", endTime: "" }
    setSlots((p) => [...p, s])
  }

  // helper: remove slot by id
  function removeSlot(id) {
    setSlots((p) => p.filter((s) => s.id !== id))
  }

  // update single slot field
  function updateSlot(id, field, value) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  // toggle employee selection
  function toggleEmployee(id) {
    setSelectedEmployeeIds((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      setSelectAll(false)
      return copy
    })
  }

  // select/unselect all employees
  function handleSelectAll(checked) {
    setSelectAll(checked)
    if (checked) {
      setSelectedEmployeeIds(new Set(employees.map((e) => e.id)))
    } else {
      setSelectedEmployeeIds(new Set())
    }
  }

  // validate google meet link (basic)
  function isValidGoogleMeetLink(link) {
    if (!link) return false
    // Accept links that contain "meet.google.com" or "https://meet.google.com/..."
    return /meet\.google\.com/.test(link)
  }

  // schedule browser notification for a given Date object (client-side)
  function scheduleBrowserNotification(meetingId, title, when) {
    if (!("Notification" in window)) return
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
    if (Notification.permission !== "granted") return

    const ms = when.getTime() - Date.now()
    if (ms <= 0) return // time already passed

    // Keep reference to setTimeouts in an array if you want to clear them later
    setTimeout(() => {
      new Notification("Meeting starting", {
        body: `${title} is starting now — join: ${googleMeetLink}`,
      })
    }, ms)
  }

  // submit create meeting to backend
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
    // basic slots validation
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
        slots, // each slot: { date: "YYYY-MM-DD", startTime: "HH:MM", endTime: "HH:MM" }
        participants: Array.from(selectedEmployeeIds), // list of employee ids
      }

      // TODO: replace with real POST to backend
      // const res = await fetch("/api/meetings", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) })
      // const created = await res.json()

      // Mock created meeting response
      const created = {
        id: "m_" + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      }

      setMeetingCreated(created)
      // Schedule browser notifications for each slot (client-side only)
      for (const s of slots) {
        const dt = new Date(`${s.date}T${s.startTime}:00`)
        scheduleBrowserNotification(created.id, created.title, dt)
      }

      // TODO: notify backend to push notifications to employees (push/email) at scheduled time
      alert("Meeting created successfully (frontend). Replace mock with backend endpoint to persist & notify.")
    } catch (err) {
      console.error(err)
      alert("Error creating meeting. See console.")
    } finally {
      setSubmitting(false)
    }
  }

  // handle file inputs for screenshot and report
  function handleScreenshotChange(file) {
    setScreenshotFile(file)
  }

  function handleReportChange(file) {
    setReportFile(file)
  }

  // upload screenshot & report to backend for created meeting
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
      const form = new FormData()
      if (screenshotFile) form.append("screenshot", screenshotFile)
      if (reportFile) form.append("report", reportFile)
      // optionally include meeting id / user metadata
      form.append("meetingId", meetingCreated.id)

      // TODO: real upload
      // const res = await fetch(`/api/meetings/${meetingCreated.id}/upload`, { method: "POST", body: form })
      // const result = await res.json()
      // Mock success
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

  // helper: format slot display
  function slotLabel(s) {
    if (!s.date || !s.startTime) return "Incomplete slot"
    return `${s.date} ${s.startTime}${s.endTime ? " - " + s.endTime : ""}`
  }

  // Calendar functions
  const openCalendar = () => {
    setShowCalendar(true)
  }

  const closeCalendar = () => {
    setShowCalendar(false)
    setSelectedDate(null)
    setSelectedDateMeetings([])
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const meetingsOnDate = meetingHistory.filter(meeting => meeting.date === date)
    setSelectedDateMeetings(meetingsOnDate)
  }

  // Get unique dates from meeting history for calendar view
  const getMeetingDates = () => {
    return [...new Set(meetingHistory.map(meeting => meeting.date))]
  }

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id)
    return employee ? employee.name : id
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
            View Meeting History
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Schedule Meeting</CardTitle>
              <div className="text-sm text-gray-500">Team Leader — create meeting and set slots</div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Upload section — only for after meeting */}
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

        {/* Meeting summary / preview */}
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

      {/* Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Meeting History Calendar</span>
              <Button variant="ghost" size="sm" onClick={closeCalendar}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Click on a date to view meeting details
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="md:col-span-2">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Meeting Dates</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getMeetingDates().map(date => (
                    <div
                      key={date}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedDate === date ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                        <Badge variant="secondary">
                          {meetingHistory.filter(m => m.date === date).length} meetings
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {getMeetingDates().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No meeting history found
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Details */}
            <div className="md:col-span-1">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">
                  {selectedDate ? `Meetings on ${new Date(selectedDate).toLocaleDateString()}` : 'Select a date'}
                </h3>
                
                {selectedDateMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateMeetings.map(meeting => (
                      <div key={meeting.id} className="border rounded-lg p-3 bg-gray-50">
                        <h4 className="font-semibold text-sm mb-2">{meeting.title}</h4>
                        <div className="space-y-1 text-xs">
                          <div><strong>Time:</strong> {meeting.startTime} - {meeting.endTime}</div>
                          <div><strong>Link:</strong> 
                            <a href={meeting.link} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">
                              Join Meeting
                            </a>
                          </div>
                          <div>
                            <strong>Participants:</strong> 
                            {meeting.participants.map(id => getEmployeeName(id)).join(', ')}
                          </div>
                          {meeting.notes && (
                            <div><strong>Notes:</strong> {meeting.notes}</div>
                          )}
                          {meeting.screenshot && (
                            <div><strong>Screenshot:</strong> {meeting.screenshot}</div>
                          )}
                          {meeting.report && (
                            <div><strong>Report:</strong> {meeting.report}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedDate ? (
                  <div className="text-center py-4 text-gray-500">
                    No meetings on this date
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Click on a date to view meetings
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}