"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Clock,
  CalendarIcon,
  Users,
  TrendingUp,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react"

const attendanceData = [
  {
    id: 1,
    employee: "Rob Mount",
    avatar: "/professional-man.png",
    department: "Engineering",
    checkIn: "09:00 AM",
    checkOut: "06:30 PM",
    workHours: "9h 30m",
    status: "Present",
    location: "Office",
    date: "2024-01-15",
  },
  {
    id: 2,
    employee: "Jill Turner",
    avatar: "/professional-woman-diverse.png",
    department: "Marketing",
    checkIn: "09:15 AM",
    checkOut: "06:45 PM",
    workHours: "9h 30m",
    status: "Present",
    location: "Remote",
    date: "2024-01-15",
  },
  {
    id: 3,
    employee: "Tanya Johnson",
    avatar: "/professional-woman-diverse.png",
    department: "Sales",
    checkIn: "10:30 AM",
    checkOut: "07:00 PM",
    workHours: "8h 30m",
    status: "Late",
    location: "Office",
    date: "2024-01-15",
  },
  {
    id: 4,
    employee: "Mike Wilson",
    avatar: "/professional-man.png",
    department: "HR",
    checkIn: "08:45 AM",
    checkOut: "05:45 PM",
    workHours: "9h 00m",
    status: "Present",
    location: "Office",
    date: "2024-01-15",
  },
  {
    id: 5,
    employee: "Barbara Sales",
    avatar: "/professional-woman-diverse.png",
    department: "Finance",
    checkIn: "-",
    checkOut: "-",
    workHours: "0h 00m",
    status: "Absent",
    location: "-",
    date: "2024-01-15",
  },
  {
    id: 6,
    employee: "David Chen",
    avatar: "/professional-man.png",
    department: "Engineering",
    checkIn: "09:30 AM",
    checkOut: "07:15 PM",
    workHours: "9h 45m",
    status: "Present",
    location: "Remote",
    date: "2024-01-15",
  },
]

const weeklyAttendanceData = [
  { day: "Mon", present: 185, absent: 15, late: 8 },
  { day: "Tue", present: 190, absent: 10, late: 5 },
  { day: "Wed", present: 188, absent: 12, late: 6 },
  { day: "Thu", present: 192, absent: 8, late: 4 },
  { day: "Fri", present: 195, absent: 5, late: 3 },
  { day: "Sat", present: 45, absent: 155, late: 2 },
  { day: "Sun", present: 12, absent: 188, late: 0 },
]

const attendanceStatusData = [
  { name: "Present", value: 185, color: "#10B981" },
  { name: "Absent", value: 12, color: "#EF4444" },
  { name: "Late", value: 8, color: "#F59E0B" },
]

const departmentAttendance = [
  { department: "Engineering", present: 42, total: 45, percentage: 93.3 },
  { department: "Marketing", present: 26, total: 28, percentage: 92.9 },
  { department: "Sales", present: 30, total: 32, percentage: 93.8 },
  { department: "HR", present: 11, total: 12, percentage: 91.7 },
  { department: "Finance", present: 17, total: 18, percentage: 94.4 },
  { department: "Design", present: 14, total: 15, percentage: 93.3 },
  { department: "Operations", present: 21, total: 22, percentage: 95.5 },
]

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState("Today")

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const totalEmployees = 205
  const presentToday = attendanceData.filter((emp) => emp.status === "Present").length
  const absentToday = attendanceData.filter((emp) => emp.status === "Absent").length
  const lateToday = attendanceData.filter((emp) => emp.status === "Late").length
  const attendanceRate = ((presentToday / totalEmployees) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Monitor and track employee attendance across your organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("Today")}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("This Week")}>This Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("This Month")}>This Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-3xl font-bold text-green-600">{presentToday}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {attendanceRate}% attendance rate
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">{absentToday}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-3xl font-bold text-yellow-600">{lateToday}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#10B981" name="Present" />
                <Bar dataKey="late" fill="#F59E0B" name="Late" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {attendanceStatusData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentAttendance.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{dept.department.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.department}</h4>
                    <p className="text-sm text-gray-500">
                      {dept.present} of {dept.total} employees present
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{dept.percentage}%</p>
                    <p className="text-xs text-gray-500">Attendance Rate</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dept.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Attendance Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Attendance Log</CardTitle>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {record.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell className="font-medium">{record.workHours}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{record.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Record</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
