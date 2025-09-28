// components/ProfessionalAttendanceCalendar.jsx
"use client"

import { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { format, parseISO } from "date-fns"
import { 
  Calendar, 
  Users, 
  Clock, 
  Edit3, 
  Trash2, 
  X, 
  Save,
  Plus,
  Building,
  BadgeCheck,
  AlertCircle,
  Loader2,
  Check
} from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ProfessionalAttendanceCalendar = () => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [isDateUsed, setIsDateUsed] = useState(false)
  const [existingEvent, setExistingEvent] = useState(null)
  const [activeView, setActiveView] = useState("month")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [loading, setLoading] = useState(false)
  const calendarRef = useRef(null)

  const [formData, setFormData] = useState({
    departments: [], // Changed to array
    status: "",
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    description: ""
  })

  // Fetch events from backend on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fixed fetchEvents function
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/fetch`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('API Response:', result); // Debug log
      
      if (result.success && result.data) {
        // Transform the backend data to FullCalendar format
        const transformedEvents = result.data.flatMap(event => {
          // Ensure departments array exists and is not empty
          if (!event.departments || !Array.isArray(event.departments) || event.departments.length === 0) {
            console.warn('Event without departments:', event);
            return [];
          }
          
          return event.departments.map(dept => ({
            id: `${event._id}-${dept}`,
            title: `${event.title} (${dept})`,
            start: event.date,
            backgroundColor: event.backgroundColor || getEventColor(event.status),
            borderColor: event.borderColor || getEventColor(event.status),
            extendedProps: {
              eventId: event._id,
              departments: event.departments,
              status: event.status,
              startTime: event.startTime,
              endTime: event.endTime,
              displayTime: event.displayTime,
              title: event.title,
              description: event.description,
              department: dept // Individual department for display
            }
          }));
        });
        
        console.log('Transformed events:', transformedEvents); // Debug log
        setEvents(transformedEvents);
      } else {
        console.error('API response not successful:', result);
        showNotification(result.error || "Failed to fetch events", "error");
        setEvents([]); // Set empty array if no data
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showNotification("Error fetching events: " + error.message, "error");
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Updated departments array
  const departments = [
    { value: "Accountant", label: "Accountant", icon: "📊", color: "bg-blue-100 text-blue-800" },
    { value: "HR", label: "HR", icon: "👥", color: "bg-pink-100 text-pink-800" },
    { value: "ProjectManager", label: "Project Manager", icon: "📋", color: "bg-purple-100 text-purple-800" },
    { value: "TeamLeader", label: "Team Leader", icon: "👨‍💼", color: "bg-green-100 text-green-800" },
    { value: "SalesEmployee", label: "Sales Employee", icon: "💰", color: "bg-yellow-100 text-yellow-800" },
    { value: "Telecaller", label: "Telecaller", icon: "📞", color: "bg-indigo-100 text-indigo-800" }
  ]

  // Status options with colors
  const statusOptions = [
    { value: "Full Day Holiday", label: "Full Day Holiday", color: "bg-red-500", icon: "🏖️" },
    { value: "Half Day Holiday", label: "Half Day Holiday", color: "bg-orange-500", icon: "⏰" },
    { value: "Working Day", label: "Working Day", color: "bg-green-500", icon: "💼" }
  ]

  // Time options
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`
    }
  })

  // Handle date click
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr
    setSelectedDate(clickedDate)
    
    // Find all events for this date
    const existingEvents = events.filter(event => event.start === clickedDate)
    
    if (existingEvents.length > 0) {
      // Get unique event IDs to find the main event
      const uniqueEventIds = [...new Set(existingEvents.map(event => event.extendedProps.eventId))];
      
      if (uniqueEventIds.length === 1) {
        // All events on this date belong to the same holiday entry
        const mainEvent = existingEvents[0];
        const originalEvent = events.find(e => e.id === mainEvent.id);
        
        setExistingEvent(originalEvent);
        setIsDateUsed(true);
        setFormData({
          departments: originalEvent.extendedProps.departments || [],
          status: originalEvent.extendedProps.status,
          startTime: originalEvent.extendedProps.startTime || "09:00",
          endTime: originalEvent.extendedProps.endTime || "17:00",
          title: originalEvent.extendedProps.title,
          description: originalEvent.extendedProps.description
        });
      } else {
        // Multiple different events on same date - treat as new event
        setExistingEvent(null);
        setIsDateUsed(false);
        resetForm();
      }
    } else {
      setExistingEvent(null);
      setIsDateUsed(false);
      resetForm();
    }
    
    setIsModalOpen(true);
  };

  // Handle department selection - FIXED THIS FUNCTION
  const handleDepartmentToggle = (departmentValue) => {
    setFormData(prev => {
      const isSelected = prev.departments.includes(departmentValue);
      const updatedDepartments = isSelected
        ? prev.departments.filter(dept => dept !== departmentValue)
        : [...prev.departments, departmentValue];
      
      console.log('Updated departments:', updatedDepartments); // Debug log
      return { ...prev, departments: updatedDepartments };
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === "status") {
      if (value === "Full Day Holiday") {
        setFormData(prev => ({ ...prev, startTime: "00:00", endTime: "23:59" }))
      } else if (value === "Half Day Holiday") {
        setFormData(prev => ({ ...prev, startTime: "09:00", endTime: "13:00" }))
      } else if (value === "Working Day") {
        setFormData(prev => ({ ...prev, startTime: "09:00", endTime: "17:00" }))
      }
    }
  }

  // Format time display
  const formatTimeDisplay = (time24h) => {
    const [hour, minute] = time24h.split(':')
    const hourNum = parseInt(hour)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12
    return `${displayHour}:${minute} ${period}`
  }

  // Get display time
  const getDisplayTime = () => {
    if (formData.status === "Full Day Holiday") return "All Day"
    return `${formatTimeDisplay(formData.startTime)} - ${formatTimeDisplay(formData.endTime)}`
  }

  // Get event color
  const getEventColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status)
    return statusObj ? statusObj.color.replace("bg-", "") : "gray"
  }

  // Validate form
  const validateForm = () => {
    if (formData.departments.length === 0 || !formData.status || !formData.title) {
      showNotification("Please fill in all required fields", "error")
      return false
    }
    return true
  }

  // Submit event to backend - FIXED THIS FUNCTION
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true);
      
      console.log('Form data being submitted:', formData); // Debug log
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        departments: formData.departments, // This should now contain the selected departments
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime,
        displayTime: getDisplayTime(),
        backgroundColor: getEventColor(formData.status)
      };

      console.log('Event data being sent to API:', eventData); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      console.log('API Response after create:', result); // Debug log

      if (result.success) {
        showNotification("Event created successfully!");
        resetForm();
        setIsModalOpen(false);
        fetchEvents(); // Refresh events
      } else {
        showNotification(result.error || "Failed to create event", "error");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      showNotification("Error creating event", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update event in backend
  const handleUpdate = async () => {
    if (!existingEvent || !validateForm()) return

    try {
      setLoading(true);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        departments: formData.departments,
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime,
        displayTime: getDisplayTime(),
        backgroundColor: getEventColor(formData.status)
      };

      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/${existingEvent.extendedProps.eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (result.success) {
        showNotification("Event updated successfully!");
        resetForm();
        setIsModalOpen(false);
        fetchEvents(); // Refresh events
      } else {
        showNotification(result.error || "Failed to update event", "error");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      showNotification("Error updating event", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete event from backend
  const handleDelete = async () => {
    if (!existingEvent) return

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/${existingEvent.extendedProps.eventId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        showNotification("Event deleted successfully!", "warning");
        resetForm();
        setIsModalOpen(false);
        fetchEvents(); // Refresh events
      } else {
        showNotification(result.error || "Failed to delete event", "error");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showNotification("Error deleting event", "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      departments: [],
      status: "",
      startTime: "09:00",
      endTime: "17:00",
      title: "",
      description: ""
    })
    setExistingEvent(null)
    setIsDateUsed(false)
  }

  // Format date
  const formatDate = (dateStr) => {
    return format(parseISO(dateStr), "EEEE, MMMM dd, yyyy")
  }

  // Get department count for sidebar
  const getDepartmentCount = (deptValue) => {
    return events.filter(event => 
      event.extendedProps.departments?.includes(deptValue)
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
          notification.type === "error" 
            ? "bg-red-50 border-red-500 text-red-700" 
            : notification.type === "warning"
            ? "bg-yellow-50 border-yellow-500 text-yellow-700"
            : "bg-green-50 border-green-500 text-green-700"
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === "error" ? <AlertCircle size={20} /> : <BadgeCheck size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Attendance Calendar</h1>
                <p className="text-gray-600 mt-1">Manage holidays, leaves, and working days efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-green-50 px-3 py-2 rounded-lg">
                <span className="text-green-700 font-medium">{events.length} Events Scheduled</span>
              </div>
              <button 
                onClick={() => calendarRef.current?.getApi().today()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={18} />
                Department Overview
              </h3>
              <div className="space-y-3">
                {departments.map(dept => {
                  const count = getDepartmentCount(dept.value);
                  return (
                    <div key={dept.value} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{dept.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.color}`}>
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BadgeCheck size={18} />
                Status Legend
              </h3>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <div key={status.value} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${status.color}`}></div>
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {loading && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading events...</span>
                </div>
              )}
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                height="auto"
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek today"
                }}
                dayMaxEvents={true}
                eventDisplay="block"
                dayCellClassNames="hover:bg-gray-50 cursor-pointer transition-colors"
                eventClassNames="cursor-pointer"
                eventContent={(eventInfo) => (
                  <div className="p-1">
                    <div className="flex items-center gap-1 mb-1">
                      <div className={`w-2 h-2 rounded-full ${eventInfo.event.backgroundColor}`}></div>
                      <div className="font-medium text-xs truncate flex-1">
                        {eventInfo.event.extendedProps.title}
                      </div>
                    </div>
                    <div className="text-xs opacity-75 truncate flex items-center gap-1">
                      <Clock size={10} />
                      {eventInfo.event.extendedProps?.displayTime}
                    </div>
                    <div className={`text-xs px-1 py-0.5 rounded mt-1 ${
                      departments.find(d => d.value === eventInfo.event.extendedProps?.department)?.color || "bg-gray-100 text-gray-800"
                    }`}>
                      {eventInfo.event.extendedProps?.department}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {isDateUsed ? "Edit Event" : "Create New Event"}
                  </h2>
                  <p className="text-blue-100 mt-1">{formatDate(selectedDate)}</p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Department Selection - FIXED THIS SECTION */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Select Departments *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => {
                    const isSelected = formData.departments.includes(dept.value);
                    return (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => handleDepartmentToggle(dept.value)}
                        disabled={loading}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isSelected && <Check size={16} className="text-blue-600" />}
                        <div className="text-xl">{dept.icon}</div>
                        <div className="text-xs font-medium text-gray-700 text-left">
                          {dept.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.departments.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      Selected: {formData.departments.map(dept => 
                        departments.find(d => d.value === dept)?.label
                      ).join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BadgeCheck size={16} />
                  Status *
                </label>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleSelectChange("status", status.value)}
                      disabled={loading}
                      className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        formData.status === status.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                      <span className="font-medium text-gray-700">{status.label}</span>
                      <span className="text-lg ml-auto">{status.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Picker */}
              {(formData.status === "Half Day Holiday" || formData.status === "Working Day") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Time Range *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Start Time</label>
                      <select
                        name="startTime"
                        value={formData.startTime}
                        onChange={(e) => handleSelectChange("startTime", e.target.value)}
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        {timeOptions.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">End Time</label>
                      <select
                        name="endTime"
                        value={formData.endTime}
                        onChange={(e) => handleSelectChange("endTime", e.target.value)}
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        {timeOptions.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      ⏰ {getDisplayTime()}
                    </p>
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Team Meeting, Public Holiday"
                    value={formData.title}
                    onChange={(e) => handleSelectChange("title", e.target.value)}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Add details about this event..."
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleSelectChange("description", e.target.value)}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3">
                {isDateUsed ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading || formData.departments.length === 0}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {loading ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || formData.departments.length === 0}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {loading ? "Creating..." : "Create Event"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  disabled={loading}
                  className="px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalAttendanceCalendar