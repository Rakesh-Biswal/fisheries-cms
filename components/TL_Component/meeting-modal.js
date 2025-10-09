// @/components/TL_Component/meeting-modal.jsx
"use client"

import { useEffect, useState } from "react"
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
import { Plus, Calendar, Link as LinkIcon, UploadCloud, X, Clock, Users, Loader2, Image, CheckCircle } from "lucide-react"

export default function MeetingModal({ isOpen, onClose }) {
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
  const [screenshotProofs, setScreenshotProofs] = useState([])
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Loading states
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  // API Base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' 
    : 'http://localhost:5000';

  // Fetch employees from backend
  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoadingEmployees(true);
        const response = await fetch(`${API_BASE_URL}/api/hr/sales-employees/fetch-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          const transformedEmployees = result.data.map(employee => ({
            id: employee._id,
            name: employee.name,
            email: employee.companyEmail || employee.email,
            phone: employee.phone,
            designation: employee.businessData?.designation || "Sales Employee",
            employeeType: "sales",
            status: employee.status,
            empCode: employee.empCode
          }));
          setEmployees(transformedEmployees);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error("Error fetching employees", err);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    }
    
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

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

  // Handle screenshot upload
  const handleScreenshotUpload = async () => {
    if (!screenshotFile) {
      alert("Please select a screenshot file first.");
      return;
    }

    setUploadingScreenshot(true);
    try {
      const formData = new FormData();
      formData.append("screenshot", screenshotFile);
      formData.append("meetingId", meetingCreated?.id || "temp");

      // TODO: Replace with your actual screenshot upload API
      const response = await fetch(`${API_BASE_URL}/api/meetings/upload-screenshot`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setScreenshotProofs(prev => [...prev, {
          id: Date.now(),
          fileName: screenshotFile.name,
          url: result.url,
          uploadedAt: new Date().toISOString()
        }]);
        setScreenshotFile(null);
        alert("Screenshot uploaded successfully as proof!");
      } else {
        throw new Error("Failed to upload screenshot");
      }
    } catch (error) {
      console.error("Screenshot upload error:", error);
      alert("Failed to upload screenshot. Please try again.");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleScreenshotChange = (file) => {
    setScreenshotFile(file)
  }

  // Handle meeting submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidGoogleMeetLink(googleMeetLink)) {
      alert("Please enter a valid Google Meet link (meet.google.com).");
      return;
    }

    if (selectedEmployeeIds.size === 0) {
      if (!confirm("No sales employee selected. Do you want to create meeting with no participants?")) {
        return;
      }
    }

    const invalidSlot = slots.find(s => !s.date || !s.startTime);
    if (invalidSlot) {
      alert("Please fill date and start time for all time slots.");
      return;
    }

    setSubmitting(true);
    
    try {
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
            employeeId: id,
            name: emp?.name || 'Unknown',
            email: emp?.email || '',
            employeeType: 'sales'
          };
        }),
        agenda: notes,
        meetingType: 'team',
        priority: 'medium',
        screenshotProofs: screenshotProofs // Include screenshot proofs
      };

      const response = await fetch(`${API_BASE_URL}/api/team-leader/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        setScreenshotProofs([]);
        
        alert("Meeting created successfully!");
        onClose(); // Close modal after success
      } else {
        throw new Error(result.message || "Failed to create meeting");
      }

    } catch (error) {
      console.error("Meeting creation error:", error);
      alert(`Error creating meeting: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to calculate end time
  const calculateEndTime = (startTime, duration = 60) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + duration, 0, 0);
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  };

  // Close modal when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Schedule New Meeting
                </h2>
                <p className="text-blue-100">
                  Create and manage team meetings with sales employees
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
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

              {/* Time Slots */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

              {/* Screenshot Proof Section */}
              <div>
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Meeting Screenshot Proof (Optional)
                </Label>
                <p className="text-sm text-gray-500 mb-3">Upload screenshot as proof of meeting</p>
                
                <div className="space-y-4">
                  {/* Screenshot Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleScreenshotChange(e.target.files?.[0] ?? null)}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer block">
                      <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        {screenshotFile ? screenshotFile.name : "Click to upload meeting screenshot"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                    </label>
                  </div>

                  {/* Upload Button */}
                  {screenshotFile && (
                    <Button 
                      type="button"
                      onClick={handleScreenshotUpload}
                      disabled={uploadingScreenshot}
                      variant="outline"
                      className="w-full"
                    >
                      {uploadingScreenshot ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading Screenshot...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 mr-2" />
                          Upload Screenshot as Proof
                        </>
                      )}
                    </Button>
                  )}

                  {/* Uploaded Screenshots */}
                  {screenshotProofs.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Uploaded Proofs:</Label>
                      {screenshotProofs.map((proof) => (
                        <div key={proof.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">{proof.fileName}</p>
                            <p className="text-xs text-green-600">
                              Uploaded {new Date(proof.uploadedAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Proof Added
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                  {screenshotProofs.length > 0 && ` • ${screenshotProofs.length} proof(s) added`}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}