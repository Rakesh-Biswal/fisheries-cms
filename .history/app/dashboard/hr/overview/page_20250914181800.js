"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MoreHorizontal, TrendingUp, Users, UserPlus, FileText, Calendar, Filter, Download } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"

// Sample employee data that drives the interactive charts
const initialEmployeeData = [
  {
    id: 1,
    name: "Tanya Johnson",
    email: "tanya@gmail.com",
    department: "UX/UX Consultant",
    position: "Analyst",
    level: "Junior",
    status: "Permanent",
    checkIn: "09:00 AM",
    checkOut: "17:00 PM",
    attendanceStatus: "On time",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 2,
    salary: 45000,
  },
  {
    id: 2,
    name: "Rob Moon",
    email: "robmoon@gmail.com",
    department: "Software Engineer",
    position: "Developer",
    level: "Senior",
    status: "Permanent",
    checkIn: "09:00 AM",
    checkOut: "17:15 PM",
    attendanceStatus: "On time",
    avatar: "/professional-man.png",
    lengthOfService: 5,
    salary: 75000,
  },
  {
    id: 3,
    name: "Sophia Miller",
    email: "sophia@gmail.com",
    department: "Strategy Consultant",
    position: "Manager",
    level: "Senior",
    status: "Permanent",
    checkIn: "10:30 AM",
    checkOut: "18:30 PM",
    attendanceStatus: "Late",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 3,
    salary: 65000,
  },
  {
    id: 4,
    name: "Barbara Sales",
    email: "barbara@gmail.com",
    department: "Finance",
    position: "Analyst",
    level: "Mid",
    status: "Contract",
    checkIn: "10:00 AM",
    checkOut: "18:00 PM",
    attendanceStatus: "Late",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 1,
    salary: 50000,
  },
]

// Employee growth data for the chart
const employeeGrowthData = [
  { month: "Jul", totalEmployees: 155, newHires: 55 },
  { month: "Aug", totalEmployees: 165, newHires: 45 },
  { month: "Sept", totalEmployees: 200, newHires: 35 },
]

export default function HROverviewPage() {
  const [employees, setEmployees] = useState(initialEmployeeData)
  const [selectedPeriod, setSelectedPeriod] = useState("01 Sept - 29 Sept 2025")

  // Calculate dynamic stats based on employee data
  const stats = useMemo(() => {
    const totalEmployees = 200 // As shown in image
    const newHires = 162 // As shown in image
    const applicants = 16 // As shown in image

    const employmentStatus = {
      permanent: employees.filter((emp) => emp.status === "Permanent").length * 10, // Scale up for demo
      contract: employees.filter((emp) => emp.status === "Contract").length * 8,
      probation: 16, // As shown in image
    }

    return {
      totalEmployees,
      newHires,
      applicants,
      employmentStatus,
    }
  }, [employees])

  // Calculate length of service data dynamically
  const lengthOfServiceData = useMemo(() => {
    const serviceRanges = {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-5": 0,
      "5+": 0,
    }

    // Scale up the data to match the chart in the image
    employees.forEach((emp) => {
      if (emp.lengthOfService <= 1) serviceRanges["0-1"] += 5
      else if (emp.lengthOfService <= 2) serviceRanges["1-2"] += 8
      else if (emp.lengthOfService <= 3) serviceRanges["2-3"] += 12
      else if (emp.lengthOfService <= 5) serviceRanges["3-5"] += 15
      else serviceRanges["5+"] += 10
    })

    return [
      { range: "0-1", count: serviceRanges["0-1"] },
      { range: "1-2", count: serviceRanges["1-2"] },
      { range: "2-3", count: serviceRanges["2-3"] },
      { range: "3-5", count: serviceRanges["3-5"] },
      { range: "5+", count: serviceRanges["5+"] },
    ]
  }, [employees])

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Welcome to Neutrack Dashboard and have a productive day
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              {selectedPeriod}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Employees Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Employees</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalEmployees}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% last year
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Hires Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">New Hires</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.newHires}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2% last month
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Applicants</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.applicants}</p>
                  <p className="text-xs text-blue-600 flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    +3% last month
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Status Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Employment Status</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-blue-500" style={{ width: `${(150 / 200) * 100}%` }}></div>
                  <div className="bg-orange-500" style={{ width: `${(34 / 200) * 100}%` }}></div>
                  <div className="bg-red-500" style={{ width: `${(16 / 200) * 100}%` }}></div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Permanent</span>
                  </div>
                  <span className="font-medium">150</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Contract</span>
                  </div>
                  <span className="font-medium">34</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Probation</span>
                  </div>
                  <span className="font-medium">16</span>
                </div>
              </div>

              {/* Percentages */}
              <div className="flex justify-between mt-3 text-xs font-medium">
                <span>75%</span>
                <span>20%</span>
                <span>10%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Attendance Log */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Attendance Log</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  Day
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  Week
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  Months
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
                      <th className="text-left pb-3 font-medium">Employee</th>
                      <th className="text-left pb-3 font-medium">Check In</th>
                      <th className="text-left pb-3 font-medium">Check Out</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {employees.map((employee, index) => (
                      <tr key={employee.id} className={index > 0 ? "border-t" : ""}>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium">{employee.checkIn}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium">{employee.checkOut}</span>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={employee.attendanceStatus === "On time" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {employee.attendanceStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Employee Growth */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Employee Growth</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  Jul
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  Aug
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  Sept
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Employees</p>
                      <p className="text-xl font-bold">155</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-xs text-gray-600">Employees</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">New Hires</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={employeeGrowthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value, name) => [value, name === "totalEmployees" ? "Total Employees" : "New Hires"]}
                      labelStyle={{ color: "#666" }}
                    />
                    <Bar dataKey="totalEmployees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newHires" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Length of Service */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Length of Service</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={lengthOfServiceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <Tooltip formatter={(value) => [value, "Employees"]} labelStyle={{ color: "#666" }} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Employee List */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Employee List</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter Table
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
                      <th className="text-left pb-3 font-medium">Email</th>
                      <th className="text-left pb-3 font-medium">Position</th>
                      <th className="text-left pb-3 font-medium">Level</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={employee.id} className={index > 0 ? "border-t" : ""}>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 text-sm">{employee.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{employee.email}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{employee.department}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{employee.level}</span>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={employee.status === "Permanent" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {employee.status}
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
