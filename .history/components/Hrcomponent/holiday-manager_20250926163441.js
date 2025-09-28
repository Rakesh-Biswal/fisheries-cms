// components/AttendanceCalendar.jsx
"use client"

import { useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { format } from "date-fns"

const AttendanceCalendar = () => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [isDateUsed, setIsDateUsed] = useState(false)
  const [existingEvent, setExistingEvent] = useState(null)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const calendarRef = useRef(null)

  const [formData, setFormData] = useState({
    department: "",
    status: "",
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    description: ""
  })

  // Time options for the time picker
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${displayHour}:${minute} ${period}`
    }
  })

  // Handle date click
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr
    setSelectedDate(clickedDate)
    
    // Check if date already has an event
    const existing = events.find(event => event.start === clickedDate)
    
    if (existing) {
      setExistingEvent(existing)
      setIsDateUsed(true)
      // Pre-fill form with existing data
      setFormData({
        department: existing.extendedProps.department,
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
        department: "",
        status: "",
        startTime: "09:00",
        endTime: "17:00",
        title: "",
        description: ""
      })
    }
    
    setIsModalOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-adjust time based on status
    if (name === "status") {
      if (value === "Full Day Holiday") {
        setFormData(prev => ({
          ...prev,
          startTime: "00:00",
          endTime: "23:59",
          status: value
        }))
      } else if (value === "Half Day Holiday") {
        setFormData(prev => ({
          ...prev,
          startTime: "09:00",
          endTime: "13:00",
          status: value
        }))
      } else if (value === "Working Day") {
        setFormData(prev => ({
          ...prev,
          startTime: "09:00",
          endTime: "17:00",
          status: value
        }))
      }
    }
  }

  // Format time for display
  const formatTimeDisplay = (time24h) => {
    const [hour, minute] = time24h.split(':')
    const hourNum = parseInt(hour)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12
    return `${displayHour}:${minute} ${period}`
  }

  // Get display time based on status
  const getDisplayTime = () => {
    if (formData.status === "Full Day Holiday") {
      return "All Day"
    }
    return `${formatTimeDisplay(formData.startTime)} - ${formatTimeDisplay(formData.endTime)}`
  }

  // Submit new event
  const handleSubmit = () => {
    if (!formData.department || !formData.status || !formData.title) {
      alert("Please fill in all required fields")
      return
    }

    const newEvent = {
      id: Date.now().toString(),
      title: `${formData.title} (${formData.status})`,
      start: selectedDate,
      backgroundColor: getEventColor(formData.status),
      extendedProps: {
        department: formData.department,
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title,
        description: formData.description,
        displayTime: getDisplayTime()
      }
    }

    setEvents(prev => [...prev, newEvent])
    resetForm()
    setIsModalOpen(false)
  }

  // Update existing event
  const handleUpdate = () => {
    if (!existingEvent) return

    const updatedEvents = events.map(event => 
      event.id === existingEvent.id 
        ? {
            ...event,
            title: `${formData.title} (${formData.status})`,
            backgroundColor: getEventColor(formData.status),
            extendedProps: {
              department: formData.department,
              status: formData.status,
              startTime: formData.startTime,
              endTime: formData.endTime,
              title: formData.title,
              description: formData.description,
              displayTime: getDisplayTime()
            }
          }
        : event
    )

    setEvents(updatedEvents)
    resetForm()
    setIsModalOpen(false)
  }

  // Delete event
  const handleDelete = () => {
    if (!existingEvent) return

    const filteredEvents = events.filter(event => event.id !== existingEvent.id)
    setEvents(filteredEvents)
    resetForm()
    setIsModalOpen(false)
  }

  // Get event color based on status
  const getEventColor = (status) => {
    switch (status) {
      case "Full Day Holiday": return "#ef4444" // red
      case "Half Day Holiday": return "#f59e0b" // amber
      case "Working Day": return "#10b981" // green
      default: return "#3b82f6" // blue
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      department: "",
      status: "",
      startTime: "09:00",
      endTime: "17:00",
      title: "",
      description: ""
    })
    setExistingEvent(null)
    setIsDateUsed(false)
    setShowTimePicker(false)
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), "MMMM dd, yyyy")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Attendance & Holiday Management System
          </h1>
          <p className="text-gray-600 mb-6">
            Click on any date to add or view attendance/holiday information
          </p>

          <div className="calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek"
              }}
              dayMaxEvents={true}
              eventDisplay="block"
              eventColor="#3788d8"
              dayCellClassNames="cursor-pointer hover:bg-gray-50"
              eventContent={(eventInfo) => (
                <div className="p-1">
                  <div className="font-medium text-sm truncate">
                    {eventInfo.event.title}
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {eventInfo.event.extendedProps?.displayTime}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isDateUsed ? "Edit Date Entry" : "Add New Entry"}
              </h2>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Selected Date: {formatDate(selectedDate)}
                </p>
              </div>

              {isDateUsed && existingEvent && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This date already has an entry. You can update or delete it.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={(e) => handleSelectChange("department", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR Department</option>
                    <option value="Development">Development Team</option>
                    <option value="Design">Design Team</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Support">Customer Support</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleSelectChange("status", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Full Day Holiday">Full Day Holiday</option>
                    <option value="Half Day Holiday">Half Day Holiday</option>
                    <option value="Working Day">Working Day</option>
                  </select>
                </div>

                {/* Time Picker - Only show for Half Day and Working Day */}
                {(formData.status === "Half Day Holiday" || formData.status === "Working Day") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Range *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                        <select
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Time</label>
                        <select
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        Selected: {getDisplayTime()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Show time display for Full Day Holiday */}
                {formData.status === "Full Day Holiday" && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      🕒 Full Day - 24 Hours
                    </p>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., New Year Holiday, Team Meeting"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Additional details about this day..."
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                {isDateUsed ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceCalendar