"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MoreHorizontal, TrendingUp, Users, Target, Calendar, Filter, Download, MapPin, Clock } from "lucide-react"
import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import WorkModeTracker from "@/components/WorkModeTracker"

// Sample team data for team leader dashboard
const initialTeamData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Field Operations",
    position: "Field Executive",
    level: "Junior",
    status: "Active",
    checkIn: "08:45 AM",
    checkOut: "17:30 PM",
    attendanceStatus: "On time",
    location: "Client Site A",
    tasksCompleted: 12,
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    department: "Field Operations",
    position: "Field Executive",
    level: "Senior",
    status: "Active",
    checkIn: "09:15 AM",
    checkOut: "18:00 PM",
    attendanceStatus: "Late",
    location: "Client Site B",
    tasksCompleted: 8,
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    department: "Field Operations",
    position: "Field Executive",
    level: "Mid",
    status: "Active",
    checkIn: "08:30 AM",
    checkOut: "17:45 PM",
    attendanceStatus: "On time",
    location: "Client Site C",
    tasksCompleted: 15,
    avatar: "/placeholder.svg",
  },
]

// Team performance data for charts
const teamPerformanceData = [
  { week: "W1", tasks: 45, attendance: 95 },
  { week: "W2", tasks: 52, attendance: 92 },
  { week: "W3", tasks: 48, attendance: 98 },
  { week: "W4", tasks: 58, attendance: 96 },
]

const taskDistributionData = [
  { type: "Completed", count: 75 },
  { type: "In Progress", count: 15 },
  { type: "Pending", count: 10 },
]

export default function TeamLeaderDashboard() {
  const [teamMembers, setTeamMembers] = useState(initialTeamData)
  const [selectedPeriod, setSelectedPeriod] = useState("Today")
  const teamLeaderId = "tl_001" // This should come from auth context

  // Calculate team stats
  const stats = useMemo(() => {
    const totalTeamMembers = teamMembers.length
    const activeMembers = teamMembers.filter(member => member.status === "Active").length
    const totalTasksCompleted = teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)
    const onTimeAttendance = teamMembers.filter(member => member.attendanceStatus === "On time").length

    return {
      totalTeamMembers,
      activeMembers,
      totalTasksCompleted,
      attendanceRate: Math.round((onTimeAttendance / totalTeamMembers) * 100)
    }
  }, [teamMembers])

  return (
    <DashboardLayout>
      <div>
        {/* Work Mode Tracker */}
        <WorkModeTracker employeeId={teamLeaderId} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Leader Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your field team and track daily operations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              {selectedPeriod}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Team Members Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalTeamMembers}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.activeMembers} active
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Completed Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalTasksCompleted}</p>
                  <p className="text-xs text-blue-600 flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Today
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Rate Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.attendanceRate}%</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    On time
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Locations Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Locations</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.activeMembers}</p>
                  <p className="text-xs text-purple-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    In field
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Team Attendance Log */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Team Attendance Today</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  Live
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b">
                      <th className="text-left pb-3 font-medium">Team Member</th>
                      <th className="text-left pb-3 font-medium">Check In</th>
                      <th className="text-left pb-3 font-medium">Check Out</th>
                      <th className="text-left pb-3 font-medium">Location</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <tr key={member.id} className={index > 0 ? "border-t" : ""}>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium">{member.checkIn}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium">{member.checkOut}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{member.location}</span>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={member.attendanceStatus === "On time" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {member.attendanceStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Weekly Performance</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={teamPerformanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value, name) => [value, name === "tasks" ? "Tasks" : "Attendance %"]}
                      labelStyle={{ color: "#666" }}
                    />
                    <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attendance" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Task Distribution */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Task Distribution</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={taskDistributionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <Tooltip formatter={(value) => [value, "%"]} labelStyle={{ color: "#666" }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Member List */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b">
                      <th className="text-left pb-3 font-medium">Name</th>
                      <th className="text-left pb-3 font-medium">Position</th>
                      <th className="text-left pb-3 font-medium">Level</th>
                      <th className="text-left pb-3 font-medium">Tasks Today</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => (
                      <tr key={member.id} className={index > 0 ? "border-t" : ""}>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{member.position}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{member.level}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium text-blue-600">{member.tasksCompleted}</span>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={member.status === "Active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {member.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}