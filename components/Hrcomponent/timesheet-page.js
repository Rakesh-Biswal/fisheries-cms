"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Clock,
  Calendar,
  Plus,
  Download,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react"

const timesheetEntries = [
  {
    id: 1,
    employee: "Rob Mount",
    avatar: "/professional-man.png",
    project: "Website Redesign",
    task: "Frontend Development",
    date: "2024-01-15",
    startTime: "09:00 AM",
    endTime: "12:30 PM",
    duration: "3h 30m",
    status: "Completed",
    billable: true,
  },
  {
    id: 2,
    employee: "Rob Mount",
    avatar: "/professional-man.png",
    project: "Mobile App",
    task: "API Integration",
    date: "2024-01-15",
    startTime: "01:30 PM",
    endTime: "05:00 PM",
    duration: "3h 30m",
    status: "Completed",
    billable: true,
  },
  {
    id: 3,
    employee: "Jill Turner",
    avatar: "/professional-woman-diverse.png",
    project: "Marketing Campaign",
    task: "Content Creation",
    date: "2024-01-15",
    startTime: "09:15 AM",
    endTime: "11:45 AM",
    duration: "2h 30m",
    status: "Completed",
    billable: true,
  },
  {
    id: 4,
    employee: "Jill Turner",
    avatar: "/professional-woman-diverse.png",
    project: "Social Media",
    task: "Post Scheduling",
    date: "2024-01-15",
    startTime: "02:00 PM",
    endTime: "04:30 PM",
    duration: "2h 30m",
    status: "In Progress",
    billable: false,
  },
  {
    id: 5,
    employee: "David Chen",
    avatar: "/professional-man.png",
    project: "Infrastructure",
    task: "Server Maintenance",
    date: "2024-01-15",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    duration: "4h 00m",
    status: "Completed",
    billable: true,
  },
]

const weeklyHoursData = [
  { day: "Mon", hours: 8.5, target: 8 },
  { day: "Tue", hours: 9.0, target: 8 },
  { day: "Wed", hours: 7.5, target: 8 },
  { day: "Thu", hours: 8.0, target: 8 },
  { day: "Fri", hours: 6.5, target: 8 },
  { day: "Sat", hours: 2.0, target: 0 },
  { day: "Sun", hours: 0, target: 0 },
]

const projectHoursData = [
  { project: "Website Redesign", hours: 45.5, budget: 60, color: "#3B82F6" },
  { project: "Mobile App", hours: 32.0, budget: 40, color: "#10B981" },
  { project: "Marketing Campaign", hours: 28.5, budget: 35, color: "#F59E0B" },
  { project: "Infrastructure", hours: 15.0, budget: 20, color: "#8B5CF6" },
  { project: "Social Media", hours: 12.5, budget: 15, color: "#EF4444" },
]

const employeeProductivity = [
  { name: "Rob Mount", hoursLogged: 42.5, productivity: 95, avatar: "/professional-man.png" },
  { name: "Jill Turner", hoursLogged: 38.0, productivity: 88, avatar: "/professional-woman-diverse.png" },
  { name: "David Chen", hoursLogged: 45.0, productivity: 92, avatar: "/professional-man.png" },
  { name: "Sarah Williams", hoursLogged: 40.5, productivity: 90, avatar: "/professional-woman-diverse.png" },
  { name: "Mike Wilson", hoursLogged: 35.5, productivity: 85, avatar: "/professional-man.png" },
]

export default function TimesheetPage() {
  const [selectedWeek, setSelectedWeek] = useState("This Week")
  const [activeTimer, setActiveTimer] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalHoursThisWeek = weeklyHoursData.reduce((sum, day) => sum + day.hours, 0)
  const targetHoursThisWeek = weeklyHoursData.reduce((sum, day) => sum + day.target, 0)
  const billableHours = timesheetEntries.filter((entry) => entry.billable).length * 3.5 // Approximate
  const totalProjects = projectHoursData.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet Management</h1>
          <p className="text-gray-600">Track time, manage projects, and monitor productivity</p>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedWeek}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedWeek("This Week")}>This Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedWeek("Last Week")}>Last Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedWeek("This Month")}>This Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-3xl font-bold text-gray-900">{totalHoursThisWeek}h</p>
                <p className="text-sm text-gray-500">Target: {targetHoursThisWeek}h</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-3xl font-bold text-green-600">{billableHours}h</p>
                <p className="text-sm text-green-600">₹{(billableHours * 1500).toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-purple-600">{totalProjects}</p>
                <p className="text-sm text-purple-600">In progress</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
                <p className="text-3xl font-bold text-orange-600">90%</p>
                <p className="text-sm text-orange-600">Team average</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">90%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Timer */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Time Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input placeholder="Project name" />
              <Input placeholder="Task description" />
              <Input placeholder="00:00:00" value={activeTimer || "00:00:00"} readOnly />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={activeTimer ? "secondary" : "default"}
                onClick={() => setActiveTimer(activeTimer ? null : "00:15:30")}
              >
                {activeTimer ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {activeTimer ? "Pause" : "Start"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveTimer(null)}>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Hours Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3B82F6" name="Actual Hours" />
                <Bar dataKey="target" fill="#E5E7EB" name="Target Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Project Hours Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectHoursData.map((project) => (
                <div key={project.project} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.project}</span>
                    <span className="text-sm text-gray-500">
                      {project.hours}h / {project.budget}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: project.color,
                        width: `${(project.hours / project.budget) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Productivity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeProductivity.map((employee) => (
              <div key={employee.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{employee.name}</h4>
                    <p className="text-sm text-gray-500">{employee.hoursLogged}h logged this week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{employee.productivity}%</p>
                    <p className="text-xs text-gray-500">Productivity</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${employee.productivity}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timesheet Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Timesheet Entries</CardTitle>
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
                  <TableHead>Project</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheetEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {entry.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{entry.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.project}</Badge>
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell>{new Date(entry.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{entry.startTime}</TableCell>
                    <TableCell>{entry.endTime}</TableCell>
                    <TableCell className="font-medium">{entry.duration}</TableCell>
                    <TableCell>
                      <Badge variant={entry.billable ? "default" : "secondary"}>{entry.billable ? "Yes" : "No"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Entry
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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
