// /dashboard/teamleader/metting/page.js
"use client"

import { useEffect, useState } from "react"
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
import { Plus, Calendar, Link as LinkIcon, UploadCloud, X, Clock, Users, Loader2 } from "lucide-react"

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

  // Loading states
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [loadingMeetings, setLoadingMeetings] = useState(false)

  // API Base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' 
    : 'http://localhost:5000';

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

  // Fetch employees from backend - UPDATED TO USE REAL DATA
  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoadingEmployees(true);
        console.log("🔄 Fetching employees from backend...");
        
        const response = await fetch(`${API_BASE_URL}/api/hr/sales-employees/fetch-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("📥 Employee fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Employee fetch result:", result);

        if (result.success && result.data) {
          // Transform the data to match your frontend structure
          const transformedEmployees = result.data.map(employee => ({
            id: employee._id, // Use MongoDB _id as id
            name: employee.name,
            email: employee.companyEmail || employee.email,
            phone: employee.phone,
            designation: employee.businessData?.designation || "Sales Employee",
            employeeType: "sales",
            status: employee.status,
            empCode: employee.empCode
          }));
          
          console.log("👥 Transformed employees:", transformedEmployees);
          setEmployees(transformedEmployees);
        } else {
          console.warn("⚠️ No employee data found or API returned failure");
          setEmployees([]);
        }
      } catch (err) {
        console.error("❌ Error fetching employees", err);
        // Fallback to empty array to avoid crashes
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    }
    fetchEmployees();
  }, []);

  // Fetch meeting history from backend
  useEffect(() => {
    async function fetchMeetingHistory() {
      try {
        setLoadingMeetings(true);
        console.log("🔄 Fetching meetings from backend...");
        
        const response = await fetch(`${API_BASE_URL}/api/team-leader/meetings`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log("📥 Meetings fetch response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Meetings fetch result:", result);
          
          if (result.success) {
            console.log("📅 Loaded meetings from backend:", result.data);
            setMeetingHistory(result.data);
          } else {
            console.error("Failed to fetch meetings:", result.message);
            setMeetingHistory([]);
          }
        } else {
          console.error("HTTP error fetching meetings:", response.status);
          setMeetingHistory([]);
        }
      } catch (err) {
        console.error("❌ Error fetching meeting history", err);
        setMeetingHistory([]);
      } finally {
        setLoadingMeetings(false);
      }
    }
    
    if (showCalendar) {
      fetchMeetingHistory();
    }
  }, [showCalendar]);

  // Get meetings for specific date and room
  const getMeetingsForTimeAndRoom = (time, room, date = selectedDate) => {
    return meetingHistory.filter(meeting => {
      const meetingSlot = meeting.timeSlots?.[0];
      if (!meetingSlot) return false;
      
      const meetingStart = meetingSlot.startTime;
      const meetingEnd = meetingSlot.endTime;
      const meetingDate = meetingSlot.date;
      
      // For Virtual Meeting Room, show all meetings with Google Meet links
      if (room === "Virtual Meeting Room") {
        return meetingDate === date && 
               meetingStart <= time && 
               meetingEnd > time &&
               meeting.googleMeetLink;
      }
      
      // For physical rooms, you might want different logic
      return meetingDate === date && 
             meetingStart <= time && 
             meetingEnd > time;
    });
  }

  // Get all meetings for selected date
  const getMeetingsForSelectedDate = () => {
    return meetingHistory.filter(meeting => {
      const meetingDate = meeting.timeSlots?.[0]?.date;
      return meetingDate === selectedDate;
    });
  }

  // Format time display
  const formatTimeDisplay = (startTime, endTime) => {
    return `${startTime}–${endTime}`
  }

  // Get employee name by ID
  const getEmployeeName = (id) => {
    // If id is an object (from participant), use the name directly
    if (typeof id === 'object' && id.name) {
      return id.name;
    }
    
    // If it's a string ID, find in employees
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown Employee';
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

  // Handle meeting submission
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
      // Prepare payload with CORRECT field names
      const payload = {
        title: meetingTitle || "Sales Meeting",
        googleMeetLink: googleMeetLink,
        description: notes,
        timeSlots: slots.map(slot => ({
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime || calculateEndTime(slot.startTime)
        })),
        participants: Array.from(selectedEmployeeIds).map(id => {
          const emp = employees.find(e => e.id === id);
          return {
            employeeId: id, // This will be the MongoDB _id
            name: emp?.name || 'Unknown',
            email: emp?.email || '',
            employeeType: 'sales'
          };
        }),
        agenda: notes,
        meetingType: 'team',
        priority: 'medium'
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch(`${API_BASE_URL}/api/team-leader/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ Server error details:", errorData);
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Server response:", result);

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
      console.error("❌ Meeting creation error:", error);
      alert(`Error creating meeting: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };





// Helper function to calculate meeting progress
const calculateMeetingProgress = (startTime, endTime, currentTime) => {
  if (!startTime || !endTime || !currentTime) return 0;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  const currentTotal = currentHour * 60 + currentMinute;
  
  if (currentTotal < startTotal) return 0;
  if (currentTotal > endTotal) return 100;
  
  const totalDuration = endTotal - startTotal;
  const elapsed = currentTotal - startTotal;
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
};

// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'N/A';
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  const duration = endTotal - startTotal;
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  }
  return `${minutes}m`;
};
  




  // Helper function to calculate end time
  const calculateEndTime = (startTime, duration = 60) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + duration, 0, 0);
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleScreenshotChange = (file) => {
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
            disabled={loadingMeetings}
          >
            {loadingMeetings ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            {loadingMeetings ? "Loading..." : "View Calendar"}
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

              {/* Participants Section - UPDATED WITH REAL DATA */}
              <div>
                <Label>Select Participants</Label>
                <div className="mt-2 border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      id="selectAll"
                      disabled={loadingEmployees || employees.length === 0}
                    />
                    <Label htmlFor="selectAll" className="mb-0 font-medium">
                      Select All Employees {loadingEmployees && "(Loading...)"}
                    </Label>
                  </div>

                  {loadingEmployees ? (
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading employees...</span>
                      </div>
                    </div>
                  ) : employees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {employees.map((emp) => (
                        <label 
                          key={emp.id} 
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEmployeeIds.has(emp.id)}
                            onChange={() => toggleEmployee(emp.id)}
                            className="rounded"
                          />
                          <div className="flex flex-col flex-1">
                            <span className="font-medium text-sm">{emp.name}</span>
                            <span className="text-gray-500 text-xs">{emp.email}</span>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-400 text-xs">{emp.designation}</span>
                              <Badge variant="outline" className="text-xs">
                                {emp.empCode}
                              </Badge>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No sales employees found</p>
                      <p className="text-sm mt-1">Make sure your backend is running and employees are added.</p>
                      <p className="text-xs text-gray-400 mt-2">
                        API Endpoint: {API_BASE_URL}/api/hr/sales-employees/fetch-data
                      </p>
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
                <Button 
                  type="submit" 
                  disabled={submitting || loadingEmployees} 
                  size="lg"
                  className="min-w-32"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Meeting"
                  )}
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


{/* Full Screen Calendar Modal */}
<Dialog Cl open={showCalendar} onOpenChange={setShowCalendar}>
  <DialogContent className="w-screen h-screen  rounded-none p-0 m-0 overflow-hidden">
    {/* Full Screen Header */}
    <div className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Meeting Calendar Overview
            </h2>
            <p className="text-blue-100">
              Complete schedule of all team meetings and availability for {getDateTitle()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-white border-white/30 hover:bg-white/20"
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCalendar(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>

    {/* Main Calendar Container - Full Height */}
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Calendar Controls */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigateDate(-1)}
              className="flex items-center gap-2 h-10 px-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-xl font-semibold text-gray-800 min-w-[300px] text-center px-4 py-2 bg-gray-50 rounded-lg border">
              {getDateTitle()}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigateDate(1)}
              className="flex items-center gap-2 h-10 px-4"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={calendarView === 'day' ? 'default' : 'outline'}
              onClick={() => setCalendarView('day')}
              className="flex items-center gap-2 h-10 px-4"
            >
              <Clock className="w-4 h-4" />
              Day View
            </Button>
            <Button
              variant={calendarView === 'week' ? 'default' : 'outline'}
              onClick={() => setCalendarView('week')}
              className="flex items-center gap-2 h-10 px-4"
            >
              <Calendar className="w-4 h-4" />
              Week View
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content - Takes Full Remaining Height */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full min-h-[500px]">
          {/* Calendar Header */}
          <div className="grid grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="p-4 font-semibold text-gray-700 border-r flex items-center justify-between">
              <span className="text-lg">Time Schedule</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {getMeetingsForSelectedDate().length} meetings
              </Badge>
            </div>
            {meetingRooms.map(room => (
              <div key={room} className="p-4 font-semibold text-gray-700 text-center border-r last:border-r-0">
                <span className="text-base">{room}</span>
              </div>
            ))}
          </div>

          {/* Time Slots - Full Height */}
          <div className="divide-y divide-gray-100 h-full">
            {timeSlots.map((time, index) => {
              const hour = parseInt(time.split(':')[0]);
              const isBusinessHours = hour >= 9 && hour <= 17;
              const isCurrentHour = hour === new Date().getHours();
              
              return (
                <div 
                  key={time} 
                  className={`grid grid-cols-5 transition-all duration-200 min-h-[120px] ${
                    isCurrentHour ? 'bg-yellow-50' : 
                    isBusinessHours ? 'hover:bg-gray-50' : 'bg-gray-25'
                  }`}
                >
                  {/* Time Column */}
                  <div className={`p-4 border-r flex items-center justify-between ${
                    isCurrentHour ? 'bg-yellow-100 border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isCurrentHour ? 'bg-yellow-500 animate-pulse' : 
                        isBusinessHours ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className={`font-semibold text-lg ${
                        isCurrentHour ? 'text-yellow-800' : 'text-gray-700'
                      }`}>
                        {time}
                      </span>
                    </div>
                  </div>
                  
                  {/* Meeting Rooms */}
                  {meetingRooms.map(room => {
                    const meetings = getMeetingsForTimeAndRoom(time, room);
                    return (
                      <div 
                        key={room} 
                        className="p-3 border-r last:border-r-0 bg-white group h-full"
                      >
                        {meetings.map((meeting) => {
                          const meetingTypeColors = {
                            'team': 'from-blue-500 to-blue-600',
                            'one-on-one': 'from-green-500 to-green-600',
                            'client': 'from-purple-500 to-purple-600',
                            'review': 'from-orange-500 to-orange-600',
                            'training': 'from-indigo-500 to-indigo-600'
                          };

                          return (
                            <div
                              key={meeting._id || meeting.id}
                              className="mb-2 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                              onClick={() => setSelectedMeeting(meeting)}
                            >
                              <div className={`bg-gradient-to-r ${meetingTypeColors[meeting.meetingType] || 'from-gray-500 to-gray-600'} text-white rounded-lg p-3 border-l-4 shadow-sm h-full`}>
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm mb-1 truncate">
                                      {meeting.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/90 mb-2">
                                      <Clock className="w-3 h-3" />
                                      {meeting.timeSlots?.[0] ? 
                                        formatTimeDisplay(meeting.timeSlots[0].startTime, meeting.timeSlots[0].endTime) : 
                                        'Time not set'
                                      }
                                      <span className="mx-1">•</span>
                                      <Users className="w-3 h-3" />
                                      {meeting.participants?.length || 0}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-white/80 truncate">
                                    {meeting.participants?.slice(0, 2).map(p => p.name).join(', ')}
                                    {meeting.participants?.length > 2 && ` +${meeting.participants.length - 2}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Available slot indicator */}
                        {meetings.length === 0 && (
                          <div className="flex items-center justify-center h-full min-h-[80px] text-gray-400">
                            <div className="text-center">
                              <Plus className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs">Available</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* Meeting Details Side Panel */}
    {selectedMeeting && (
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white border-l shadow-2xl">
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${
                selectedMeeting.meetingType === 'team' ? 'from-blue-500 to-blue-600' :
                selectedMeeting.meetingType === 'one-on-one' ? 'from-green-500 to-green-600' :
                selectedMeeting.meetingType === 'client' ? 'from-purple-500 to-purple-600' :
                'from-gray-500 to-gray-600'
              }`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{selectedMeeting.title}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline">
                    {selectedMeeting.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedMeeting.meetingType}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedMeeting(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Meeting Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="font-semibold text-gray-900">
                  {selectedMeeting.timeSlots?.[0]?.date ? 
                    new Date(selectedMeeting.timeSlots[0].date).toLocaleDateString() : 
                    'Not scheduled'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="font-semibold text-gray-900">
                  {selectedMeeting.timeSlots?.[0] ? 
                    `${selectedMeeting.timeSlots[0].startTime} - ${selectedMeeting.timeSlots[0].endTime}` : 
                    'Not set'
                  }
                </span>
              </div>
            </div>

            {/* Meeting Link */}
            <Button 
              asChild 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a 
                href={selectedMeeting.googleMeetLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Join Google Meet
              </a>
            </Button>

            {/* Participants */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Participants ({selectedMeeting.participants?.length || 0})</h4>
              <div className="space-y-2">
                {selectedMeeting.participants?.map((participant, index) => (
                  <div key={participant.employeeId || index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {participant.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{participant.name || 'Unknown'}</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    <p>No participants added</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
    </DashboardLayout>
  )
}