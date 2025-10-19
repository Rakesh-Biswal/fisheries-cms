"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MapPin,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function EmployeeAttendanceDetails() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id

  const [employee, setEmployee] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [calendarData, setCalendarData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [status, setStatus] = useState("")
  const [description, setDescription] = useState("")
  const [workType, setWorkType] = useState("Office Work")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch employee details and attendance
  const fetchEmployeeData = async () => {
    try {
      setLoading(true)
      const [employeeRes, attendanceRes] = await Promise.all([
        fetch(`${API_URL}/api/hr/attendance-management/employee/${employeeId}`, {
          credentials: 'include'
        }),
        fetch(`${API_URL}/api/hr/attendance-management/employee/${employeeId}/attendance`, {
          credentials: 'include'
        })
      ])

      if (employeeRes.ok && attendanceRes.ok) {
        const employeeData = await employeeRes.json()
        const attendanceData = await attendanceRes.json()
        
        setEmployee(employeeData.data)
        setAttendanceData(attendanceData.data.attendanceHistory)
        setCalendarData(attendanceData.data.calendarData)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
      toast.error('Failed to load employee data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData()
    }
  }, [employeeId])

  // Helper function to normalize dates for comparison
  const normalizeDate = (date) => {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }

  const handleDateClick = (date) => {
    const clickedDate = normalizeDate(date)
    
    const existingRecord = calendarData.find(record => {
      const recordDate = normalizeDate(record.date)
      return recordDate.getTime() === clickedDate.getTime()
    })

    if (existingRecord) {
      setSelectedAttendance(existingRecord)
      setStatus(existingRecord.status)
      setDescription(existingRecord.description || "")
      setWorkType(existingRecord.workType || "Office Work")
    } else {
      setSelectedAttendance(null)
      setStatus("Present")
      setDescription("")
      setWorkType("Office Work")
    }
    
    setSelectedDate(clickedDate)
    setIsDialogOpen(true)
  }

  const handleSaveAttendance = async () => {
    if (!status) {
      toast.error('Please select a status')
      return
    }

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Use the exact date that was clicked (already normalized)
      const submitDate = new Date(selectedDate)
      
      // Format date as YYYY-MM-DD without timezone issues
      const year = submitDate.getFullYear()
      const month = String(submitDate.getMonth() + 1).padStart(2, '0')
      const day = String(submitDate.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`

      console.log('Submitting attendance for date:', dateString, 'Selected date:', selectedDate)

      const response = await fetch(`${API_URL}/api/hr/attendance-management/employee/${employeeId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: dateString,
          status,
          description,
          workType
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setIsDialogOpen(false)
        setSelectedAttendance(null)
        setStatus("")
        setDescription("")
        setWorkType("Office Work")
        fetchEmployeeData()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save attendance')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast.error(error.message || 'Failed to save attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return "bg-green-100 text-green-800"
      case 'Absent':
        return "bg-red-100 text-red-800"
      case 'Half Day':
      case 'Early Leave':
        return "bg-yellow-100 text-yellow-800"
      case 'AwaitingApproval':
      case 'Active':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Absent':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'AwaitingApproval':
      case 'Active':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const calendar = []
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      calendar.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const attendanceRecord = calendarData.find(record => {
        const recordDate = normalizeDate(record.date)
        const currentDate = normalizeDate(date)
        return recordDate.getTime() === currentDate.getTime()
      })
      calendar.push({
        date,
        attendance: attendanceRecord
      })
    }
    
    return calendar
  }

  if (loading) {
    return (
      <DashboardLayout title="Employee Attendance Details">
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout title="Employee Not Found">
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Employee not found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const calendarDays = generateCalendar()

  return (
    <DashboardLayout title="Employee Attendance Details">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-gray-600">Attendance details and calendar view</p>
            </div>
          </div>
        </div>

        {/* Employee Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              {employee.photo ? (
                <img 
                  src={employee.photo} 
                  alt={employee.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <div>
                  <Label className="text-sm text-gray-500">Employee Code</Label>
                  <div className="font-medium">{employee.empCode}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <div className="font-medium">{employee.companyEmail}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <div className="font-medium">{employee.phone}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Department</Label>
                  <Badge variant="outline">{employee.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Attendance Calendar - {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-20 border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                    day?.attendance ? getStatusColor(day.attendance.status) : 'bg-white'
                  } ${!day ? 'bg-gray-50' : ''}`}
                  onClick={() => day && handleDateClick(day.date)}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                      {day.attendance && (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {day.attendance.status}
                          </Badge>
                          {day.attendance.workDuration && (
                            <div className="text-xs text-gray-500">
                              {day.attendance.workDuration}h
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-sm">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                <span className="text-sm">Half Day</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                <span className="text-sm">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedAttendance(null)
            setStatus("")
            setDescription("")
            setWorkType("Office Work")
            setIsSubmitting(false)
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAttendance ? 'Update Attendance' : 'Create Attendance'}
              </DialogTitle>
              <DialogDescription>
                For {selectedDate.toLocaleDateString('en-IN')} - {employee.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Half Day">Half Day</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Early Leave">Early Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workType">Work Type</Label>
                <Select value={workType} onValueChange={setWorkType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field Work">Field Work</SelectItem>
                    <SelectItem value="Office Work">Office Work</SelectItem>
                    <SelectItem value="Remote Work">Remote Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description / Remarks</Label>
                <Textarea
                  id="description"
                  placeholder="Enter any remarks or description for this attendance record..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Add any notes or remarks for this attendance record
                </p>
              </div>

              {selectedAttendance?.workModeOnTime && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <h4 className="font-medium">Recorded Details:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Check-in: {new Date(selectedAttendance.workModeOnTime).toLocaleTimeString()}</div>
                    {selectedAttendance.workModeOffTime && (
                      <div>Check-out: {new Date(selectedAttendance.workModeOffTime).toLocaleTimeString()}</div>
                    )}
                    {selectedAttendance.workDuration && (
                      <div>Duration: {selectedAttendance.workDuration} hours</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAttendance}
                disabled={!status || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {selectedAttendance ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  selectedAttendance ? 'Update Attendance' : 'Create Attendance'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}