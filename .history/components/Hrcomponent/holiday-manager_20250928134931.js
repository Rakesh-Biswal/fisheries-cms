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
  Info
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
    departments: [],
    status: "",
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    description: ""
  })

  // Enhanced status options with better color coding
  const statusOptions = [
    { 
      value: "Full Day Holiday", 
      label: "Full Day Holiday", 
      color: "bg-red-500", 
      borderColor: "border-red-500",
      textColor: "text-red-600",
      icon: "🏖️",
      dayCellColor: "bg-red-50 border-red-200 hover:bg-red-100" 
    },
    { 
      value: "Half Day Holiday", 
      label: "Half Day Holiday", 
      color: "bg-yellow-500", 
      borderColor: "border-yellow-500",
      textColor: "text-yellow-600",
      icon: "⏰",
      dayCellColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" 
    },
    { 
      value: "Working Day", 
      label: "Working Day", 
      color: "bg-green-500", 
      borderColor: "border-green-500",
      textColor: "text-green-600",
      icon: "💼",
      dayCellColor: "bg-green-50 border-green-200 hover:bg-green-100" 
    }
  ]

  // Default color for unassigned days (Full Working Day)
  const defaultDayColor = "bg-white border-gray-200 hover:bg-gray-50"

  // Fetch events from backend on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hr/attendance-calendar/fetch`);
      const result = await response.json();
      
      if (result.success) {
        const transformedEvents = result.data.map(event => ({
          id: event._id,
          title: event.title,
          start: event.date,
          backgroundColor: getEventColor(event.status),
          borderColor: getEventBorderColor(event.status),
          textColor: "white",
          classNames: ["attendance-event"],
          extendedProps: {
            departments: event.departments,
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

  // Get event background color
  const getEventColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color.replace("bg-", "") : "gray";
  };

  // Get event border color
  const getEventBorderColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.borderColor.replace("border-", "") : "gray";
  };

  // Get day cell class based on events for that date
  const getDayCellClass = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayEvents = events.filter(event => event.start === dateStr);
    
    if (dayEvents.length > 0) {
      // If multiple events, use the most restrictive status (Holiday > Half Day > Working Day)
      const statusPriority = {
        "Full Day Holiday": 3,
        "Half Day Holiday": 2,
        "Working Day": 1
      };
      
      const highestPriorityEvent = dayEvents.reduce((prev, current) => {
        const prevPriority = statusPriority[prev.extendedProps.status] || 0;
        const currentPriority = statusPriority[current.extendedProps.status] || 0;
        return currentPriority > prevPriority ? current : prev;
      });
      
      const statusObj = statusOptions.find(s => s.value === highestPriorityEvent.extendedProps.status);
      return statusObj ? statusObj.dayCellColor : defaultDayColor;
    }
    
    // No events - default to Full Working Day
    return defaultDayColor;
  };

  // Enhanced day cell content renderer
  const dayCellContent = (args) => {
    const dateStr = format(args.date, "yyyy-MM-dd");
    const dayEvents = events.filter(event => event.start === dateStr);
    
    return (
      <div className="fc-daygrid-day-frame">
        <div className="fc-daygrid-day-top">
          <span className="fc-daygrid-day-number">{args.dayNumberText}</span>
        </div>
        {dayEvents.length > 0 && (
          <div className="fc-daygrid-day-events mt-1">
            {dayEvents.map((event, index) => {
              const statusObj = statusOptions.find(s => s.value === event.extendedProps.status);
              return (
                <div 
                  key={index}
                  className={`fc-daygrid-event-harness`}
                  title={`${event.extendedProps.title} - ${event.extendedProps.status}`}
                >
                  <div className={`fc-daygrid-event fc-event fc-event-start fc-event-end ${statusObj?.textColor || 'text-gray-600'}`}>
                    <div className="fc-event-main">
                      <div className="fc-event-main-frame">
                        <div className="fc-event-title-container">
                          <div className="fc-event-title fc-sticky">
                            {event.extendedProps.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Enhanced event content renderer
  const eventContent = (eventInfo) => {
    const statusObj = statusOptions.find(s => s.value === eventInfo.event.extendedProps.status);
    
    return (
      <div className="p-1">
        <div className="flex items-center gap-1 mb-1">
          <div className={`w-2 h-2 rounded-full ${statusObj?.color || 'bg-gray-500'}`}></div>
          <div className="font-medium text-xs truncate flex-1 text-white">
            {eventInfo.event.title}
          </div>
        </div>
        <div className="text-xs opacity-90 truncate flex items-center gap-1 text-white">
          <Clock size={10} />
          {eventInfo.event.extendedProps?.displayTime}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {eventInfo.event.extendedProps?.departments?.map((dept, index) => {
            const deptObj = departments.find(d => d.value === dept);
            const colorClass = deptObj?.color || "bg-gray-100 text-gray-800";
            return (
              <div 
                key={index} 
                className={`text-xs px-1 py-0.5 rounded ${colorClass} bg-white bg-opacity-90`}
              >
                {deptObj?.label.split(' ')[0] || dept}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Rest of your existing code remains the same until the return statement...
  // [Keep all your existing functions like handleDateClick, handleInputChange, etc.]

  // Enhanced departments list
  const departments = [
    { value: "HR", label: "HR Department", icon: "👥", color: "bg-pink-100 text-pink-800" },
    { value: "Development", label: "Development Team", icon: "💻", color: "bg-blue-100 text-blue-800" },
    { value: "Design", label: "Design Team", icon: "🎨", color: "bg-purple-100 text-purple-800" },
    { value: "Marketing", label: "Marketing", icon: "📢", color: "bg-green-100 text-green-800" },
    { value: "Sales", label: "Sales", icon: "💰", color: "bg-yellow-100 text-yellow-800" },
    { value: "Support", label: "Customer Support", icon: "🔧", color: "bg-indigo-100 text-indigo-800" },
    { value: "Management", label: "Management", icon: "👔", color: "bg-gray-100 text-gray-800" },
    { value: "Accountant", label: "Accountant", icon: "📊", color: "bg-red-100 text-red-800" },
    { value: "Project Manager", label: "Project Manager", icon: "📋", color: "bg-orange-100 text-orange-800" },
    { value: "Team Leader", label: "Team Leader", icon: "👨‍💼", color: "bg-teal-100 text-teal-800" },
    { value: "Telecaller", label: "Telecaller", icon: "📞", color: "bg-cyan-100 text-cyan-800" },
    { value: "Sales Employee", label: "Sales Employee", icon: "💼", color: "bg-lime-100 text-lime-800" }
  ];

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
  });

  // [Keep all your existing functions unchanged...]

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
            {/* Enhanced Status Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={18} />
                Day Status Legend
              </h3>
              <div className="space-y-3">
                {statusOptions.map(status => (
                  <div key={status.value} className="flex items-center gap-3 p-2 rounded-lg border">
                    <div className={`w-6 h-6 rounded ${status.color} border-2 ${status.borderColor}`}></div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{status.label}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {status.value === "Full Day Holiday" && "Non-working day (Red)"}
                        {status.value === "Half Day Holiday" && "Half working day (Yellow)"}
                        {status.value === "Working Day" && "Full working day (Green)"}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-200">
                  <div className="w-6 h-6 rounded bg-white border-2 border-gray-300"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">Unassigned Day</span>
                    <div className="text-xs text-gray-500 mt-1">Default full working day (White)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={18} />
                Department Overview
              </h3>
              <div className="space-y-3">
                {departments.map(dept => {
                  const count = events.filter(e => 
                    e.extendedProps?.departments?.includes(dept.value)
                  ).length
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
                dayMaxEvents={2}
                eventDisplay="block"
                dayCellClassNames={(args) => getDayCellClass(args.date)}
                eventClassNames="cursor-pointer shadow-sm"
                dayCellContent={dayCellContent}
                eventContent={eventContent}
                moreLinkText={({ num }) => `+${num} more`}
                dayHeaderClassNames="font-semibold text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Keep your existing modal code unchanged */}
      {/* ... */}
    </div>
  )
}

export default ProfessionalAttendanceCalendar