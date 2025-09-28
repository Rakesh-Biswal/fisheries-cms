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
  const calendarRef = useRef(null)

  const [formData, setFormData] = useState({
    department: "",
    status: "",
    time: "",
    title: "",
    description: ""
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
    } else {
      setExistingEvent(null)
      setIsDateUsed(false)
      setFormData({
        department: "",
        status: "",
        time: "",
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
        time: formData.time,
        description: formData.description
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
            title: `${formData.title || existingEvent.extendedProps.title} (${formData.status || existingEvent.extendedProps.status})`,
            backgroundColor: getEventColor(formData.status || existingEvent.extendedProps.status),
            extendedProps: {
              department: formData.department || existingEvent.extendedProps.department,
              status: formData.status || existingEvent.extendedProps.status,
              time: formData.time || existingEvent.extendedProps.time,
              description: formData.description || existingEvent.extendedProps.description
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
      time: "",
      title: "",
      description: ""
    })
    setExistingEvent(null)
    setIsDateUsed(false)
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), "MMMM dd, yyyy")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isDateUsed ? "Date Already Booked" : "Add New Entry"}
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
                    value={formData.department || (existingEvent?.extendedProps.department || "")}
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
                    value={formData.status || (existingEvent?.extendedProps.status || "")}
                    onChange={(e) => handleSelectChange("status", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Full Day Holiday">Full Day Holiday</option>
                    <option value="Half Day Holiday">Half Day Holiday</option>
                    <option value="Working Day">Working Day</option>
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g., 9:00 AM - 5:00 PM or 9:00 AM - 1:00 PM"
                    value={formData.time || (existingEvent?.extendedProps.time || "")}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., New Year Holiday, Team Meeting"
                    value={formData.title || (existingEvent?.extendedProps.title || "")}
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
                    value={formData.description || (existingEvent?.extendedProps.description || "")}
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