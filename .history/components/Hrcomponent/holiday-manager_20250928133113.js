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
  Check,
  IdCard
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
  const [departments, setDepartments] = useState([])
  const calendarRef = useRef(null)

  const [formData, setFormData] = useState({
    departments: [], // Array of department names
    status: "",
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    description: ""
  })

  // Fetch departments and events from backend on component mount
  useEffect(() => {
    fetchDepartments();
    fetchEvents();
  }, []);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/departments`);
      const result = await response.json();
      
      if (result.success) {
        setDepartments(result.data);
      } else {
        console.error("Failed to fetch departments");
        // Fallback to default departments
        setDepartments(getDefaultDepartments());
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Fallback to default departments
      setDepartments(getDefaultDepartments());
    }
  };

  // Fallback departments in case API fails
  const getDefaultDepartments = () => {
    return [
      { name: "HR", label: "HR Department", icon: "👥", color: "bg-pink-100 text-pink-800", id: "HR@fisheries123", code: "HR" },
      { name: "Development", label: "Development Team", icon: "💻", color: "bg-blue-100 text-blue-800", id: "DEV@fisheries123", code: "DEV" },
      { name: "Design", label: "Design Team", icon: "🎨", color: "bg-purple-100 text-purple-800", id: "DES@fisheries123", code: "DES" },
      { name: "Marketing", label: "Marketing", icon: "📢", color: "bg-green-100 text-green-800", id: "MKT@fisheries123", code: "MKT" },
      { name: "Sales", label: "Sales", icon: "💰", color: "bg-yellow-100 text-yellow-800", id: "SAL@fisheries123", code: "SAL" },
      { name: "Support", label: "Customer Support", icon: "🔧", color: "bg-indigo-100 text-indigo-800", id: "SUP@fisheries123", code: "SUP" },
      { name: "Management", label: "Management", icon: "👔", color: "bg-gray-100 text-gray-800", id: "MGMT@fisheries123", code: "MGMT" },
      { name: "Accountant", label: "Accountant", icon: "📊", color: "bg-red-100 text-red-800", id: "AC@fisheries123", code: "AC" },
      { name: "Project Manager", label: "Project Manager", icon: "📋", color: "bg-orange-100 text-orange-800", id: "PM@fisheries123", code: "PM" },
      { name: "Team Leader", label: "Team Leader", icon: "👨‍💼", color: "bg-teal-100 text-teal-800", id: "TL@fisheries123", code: "TL" },
      { name: "Telecaller", label: "Telecaller", icon: "📞", color: "bg-cyan-100 text-cyan-800", id: "TC@fisheries123", code: "TC" },
      { name: "Sales Employee", label: "Sales Employee", icon: "💼", color: "bg-lime-100 text-lime-800", id: "SE@fisheries123", code: "SE" }
    ];
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/fetch`);
      const result = await response.json();
      
      if (result.success) {
        // Transform the backend data to FullCalendar format
        const transformedEvents = result.data.map(event => ({
          id: event._id,
          title: event.title,
          start: event.date,
          backgroundColor: event.backgroundColor || getEventColor(event.status),
          borderColor: event.borderColor || getEventColor(event.status),
          extendedProps: {
            departments: event.departments, // Now contains both name and id
            status: event.status,
            startTime: event.startTime,
            endTime: event.endTime,
            displayTime: event.displayTime,
            departmentColors: event.departmentColors,
            title: event.title,
            description: event.description
          }
        }));
        
        setEvents(transformedEvents);
      } else {
        showNotification("Failed to fetch events", "error");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showNotification("Error fetching events", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

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
    
    const existing = events.find(event => event.start === clickedDate)
    
    if (existing) {
      setExistingEvent(existing)
      setIsDateUsed(true)
      // Extract department names from the department objects
      const departmentNames = existing.extendedProps.departments.map(dept => dept.name);
      setFormData({
        departments: departmentNames,
        status: existing.extendedProps.status,
        startTime: existing.extendedProps.startTime || "09:00",
        endTime: existing.extendedProps.endTime || "17:00",
        title: existing.extendedProps.title,
        description: existing.extendedProps.description
      })
    } else {
      setExistingEvent(null)
      setIsDateUsed(false)
      setFormData({
        departments: [],
        status: "",
        startTime: "09:00",
        endTime: "17:00",
        title: "",
        description: ""
      })
    }
    
    setIsModalOpen(true)
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle department selection (multiple)
  const handleDepartmentToggle = (departmentName) => {
    setFormData(prev => {
      const currentDepartments = prev.departments || []
      const isSelected = currentDepartments.includes(departmentName)
      
      if (isSelected) {
        // Remove department
        return {
          ...prev,
          departments: currentDepartments.filter(dept => dept !== departmentName)
        }
      } else {
        // Add department
        return {
          ...prev,
          departments: [...currentDepartments, departmentName]
        }
      }
    })
  }

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

  // Get department colors for selected departments
  const getDepartmentColors = () => {
    return formData.departments.map(deptName => {
      const dept = departments.find(d => d.name === deptName)
      return dept ? dept.color : "bg-gray-100 text-gray-800"
    })
  }

  // Get event color
  const getEventColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status)
    return statusObj ? statusObj.color.replace("bg-", "") : "gray"
  }

  // Validate form
  const validateForm = () => {
    if (!formData.departments || formData.departments.length === 0 || !formData.status || !formData.title) {
      showNotification("Please fill in all required fields", "error")
      return false
    }
    return true
  }

  // Submit event to backend
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        departments: formData.departments, // Send array of department names
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime,
        displayTime: getDisplayTime(),
        departmentColors: getDepartmentColors(),
        backgroundColor: getEventColor(formData.status)
      };

      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new event to local state
        const newEvent = {
          id: result.data._id,
          title: formData.title,
          start: selectedDate,
          backgroundColor: getEventColor(formData.status),
          borderColor: getEventColor(formData.status),
          extendedProps: {
            ...eventData,
            departments: result.data.departments // Use the departments from response (with IDs)
          }
        };

        setEvents(prev => [...prev, newEvent]);
        showNotification("Holiday created successfully for selected departments!");
        resetForm();
        setIsModalOpen(false);
      } else {
        showNotification(result.error || "Failed to create holiday", "error");
      }
    } catch (error) {
      console.error("Error creating holiday:", error);
      showNotification("Error creating holiday", "error");
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
        departments: formData.departments, // Send array of department names
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime,
        displayTime: getDisplayTime(),
        departmentColors: getDepartmentColors(),
        backgroundColor: getEventColor(formData.status)
      };

      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/${existingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (result.success) {
        // Update the event in local state
        const updatedEvents = events.map(event => 
          event.id === existingEvent.id ? {
            ...event,
            title: formData.title,
            backgroundColor: getEventColor(formData.status),
            borderColor: getEventColor(formData.status),
            extendedProps: {
              ...eventData,
              departments: result.data.departments // Use the departments from response (with IDs)
            }
          } : event
        );

        setEvents(updatedEvents);
        showNotification("Holiday updated successfully!");
        resetForm();
        setIsModalOpen(false);
      } else {
        showNotification(result.error || "Failed to update holiday", "error");
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
      showNotification("Error updating holiday", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete event from backend
  const handleDelete = async () => {
    if (!existingEvent) return

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/${existingEvent.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Remove the event from local state
        const filteredEvents = events.filter(event => event.id !== existingEvent.id);
        setEvents(filteredEvents);
        showNotification("Holiday deleted successfully!", "warning");
        resetForm();
        setIsModalOpen(false);
      } else {
        showNotification(result.error || "Failed to delete holiday", "error");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      showNotification("Error deleting holiday", "error");
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

  // Get department info for display
  const getDepartmentInfo = (deptName) => {
    return departments.find(d => d.name === deptName) || { label: deptName, color: "bg-gray-100 text-gray-800" };
  }

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
                  const count = events.filter(e => 
                    e.extendedProps?.departments?.some(d => d.name === dept.name)
                  ).length
                  return (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600 block">{dept.label}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <IdCard size={10} />
                          {dept.id}
                        </span>
                      </div>
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
                        {eventInfo.event.title}
                      </div>
                    </div>
                    <div className="text-xs opacity-75 truncate flex items-center gap-1">
                      <Clock size={10} />
                      {eventInfo.event.extendedProps?.displayTime}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {eventInfo.event.extendedProps?.departments?.map((dept, index) => {
                        const deptInfo = getDepartmentInfo(dept.name);
                        return (
                          <div 
                            key={index} 
                            className={`text-xs px-1 py-0.5 rounded ${deptInfo.color}`}
                            title={`${dept.name} (${dept.id})`}
                          >
                            {deptInfo.label.split(' ')[0] || dept.name}
                          </div>
                        )
                      })}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {isDateUsed ? "Edit Holiday" : "Create New Holiday"}
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
              {/* Departments - Multi Select */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Departments *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => {
                    const isSelected = formData.departments.includes(dept.name)
                    return (
                      <button
                        key={dept.name}
                        type="button"
                        onClick={() => handleDepartmentToggle(dept.name)}
                        disabled={loading}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                          isSelected 
                            ? "bg-blue-500 border-blue-500" 
                            : "border-gray-300"
                        }`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div className="text-lg">{dept.icon}</div>
                        <div className="text-left flex-1">
                          <div className="text-xs font-medium text-gray-700">
                            {dept.label}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <IdCard size={10} />
                            {dept.id}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {formData.departments.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      Selected: {formData.departments.map(deptName => {
                        const dept = departments.find(d => d.name === deptName);
                        return dept ? dept.label : deptName;
                      }).join(", ")}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                    Holiday Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Public Holiday, Company Event"
                    value={formData.title}
                    onChange={handleInputChange}
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
                    placeholder="Add details about this holiday..."
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
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
                      disabled={loading}
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
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {loading ? "Creating..." : "Create Holiday"}
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