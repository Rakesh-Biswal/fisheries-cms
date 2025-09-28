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
  const [departments, setDepartments] = useState([])
  const calendarRef = useRef(null)

  const [formData, setFormData] = useState({
    selectedDepartments: [],
    status: "",
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    description: ""
  })

  // Fetch departments and events on component mount
  useEffect(() => {
    fetchDepartments();
    fetchEvents();
  }, []);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/departments`);
      const result = await response.json();
      
      if (result.success) {
        setDepartments(result.data.map(dept => ({
          ...dept,
          color: getDepartmentColor(dept.name)
        })));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Get department color
  const getDepartmentColor = (deptName) => {
    const colors = {
      "TeleCaller": "bg-blue-100 text-blue-800",
      "Accountant": "bg-green-100 text-green-800", 
      "Sale Employee": "bg-purple-100 text-purple-800",
      "Team Leader": "bg-yellow-100 text-yellow-800",
      "Project Manager": "bg-red-100 text-red-800",
      "HR": "bg-pink-100 text-pink-800"
    };
    return colors[deptName] || "bg-gray-100 text-gray-800";
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hr/holidays/fetch`);
      const result = await response.json();
      
      if (result.success) {
        const transformedEvents = result.data.flatMap(event => 
          event.departments.map(dept => ({
            id: `${event._id}_${dept.deptId}`,
            title: `${event.title} - ${dept.name}`,
            start: event.date,
            backgroundColor: event.backgroundColor || getEventColor(event.status),
            borderColor: event.borderColor || getEventColor(event.status),
            extendedProps: {
              ...event,
              department: dept.name,
              deptId: dept.deptId
            }
          }))
        );
        
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

  // Status options with colors
  const statusOptions = [
    { value: "Full Day Holiday", label: "Full Day Holiday", color: "bg-red-500", icon: "🏖️" },
    { value: "Half Day Holiday", label: "Half Day Holiday", color: "bg-orange-500", icon: "⏰" },
    { value: "Working Day", label: "Working Day", color: "bg-green-500", icon: "💼" }
  ];

  // Handle department selection
  const handleDepartmentSelect = (deptId) => {
    setFormData(prev => {
      const isSelected = prev.selectedDepartments.includes(deptId);
      if (isSelected) {
        return {
          ...prev,
          selectedDepartments: prev.selectedDepartments.filter(id => id !== deptId)
        };
      } else {
        return {
          ...prev,
          selectedDepartments: [...prev.selectedDepartments, deptId]
        };
      }
    });
  };

  // Handle date click
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    
    // Find events for this date
    const dateEvents = events.filter(event => event.start === clickedDate);
    
    if (dateEvents.length > 0) {
      // For simplicity, edit the first event (you might want to implement multi-event editing)
      const existing = dateEvents[0];
      setExistingEvent(existing);
      setIsDateUsed(true);
      
      // Get all departments from events on this date
      const eventDeptIds = dateEvents.map(event => event.extendedProps.deptId);
      
      setFormData({
        selectedDepartments: eventDeptIds,
        status: existing.extendedProps.status,
        startTime: existing.extendedProps.startTime || "09:00",
        endTime: existing.extendedProps.endTime || "17:00",
        title: existing.extendedProps.title,
        description: existing.extendedProps.description
      });
    } else {
      setExistingEvent(null);
      setIsDateUsed(false);
      setFormData({
        selectedDepartments: [],
        status: "",
        startTime: "09:00",
        endTime: "17:00",
        title: "",
        description: ""
      });
    }
    
    setIsModalOpen(true);
  };

  // Submit event to backend
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const selectedDepts = departments.filter(dept => 
        formData.selectedDepartments.includes(dept.deptId)
      ).map(dept => ({
        deptId: dept.deptId,
        name: dept.name
      }));

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        departments: selectedDepts,
        status: formData.status,
        startTime: formData.startTime,
        endTime: formData.endTime
      };

      const response = await fetch(`${API_BASE_URL}/api/hr/holidays/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (result.success) {
        showNotification("Holiday created successfully for selected departments!");
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

  // Update your modal department selection section:
  {/* Department Selection in Modal */}
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <Users size={16} />
      Select Departments *
    </label>
    <div className="grid grid-cols-2 gap-2">
      {departments.map(dept => (
        <button
          key={dept.deptId}
          type="button"
          onClick={() => handleDepartmentSelect(dept.deptId)}
          disabled={loading}
          className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
            formData.selectedDepartments.includes(dept.deptId)
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
            formData.selectedDepartments.includes(dept.deptId)
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-gray-300"
          }`}>
            {formData.selectedDepartments.includes(dept.deptId) && (
              <Check size={12} className="text-white" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">{dept.name}</span>
          <span className="text-xs text-gray-500 ml-auto">{dept.deptId}</span>
        </button>
      ))}
    </div>
  </div>

  // ... rest of the component remains similar with adjustments for multiple departments
};

export default ProfessionalAttendanceCalendar;