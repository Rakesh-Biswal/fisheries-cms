"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MoreHorizontal, TrendingUp, Users, UserPlus, FileText, Calendar, Mail, Edit } from "lucide-react"

// Sample data that will be interactive
const initialEmployeeData = [
  {
    id: 1,
    name: "Rob Mount",
    email: "rob@company.com",
    department: "Engineering",
    checkIn: "09:00 AM",
    checkOut: "11:00 PM",
    status: "On-time",
    avatar: "/professional-man.png",
    lengthOfService: 5,
  },
  {
    id: 2,
    name: "Jill Turner",
    email: "jill@company.com",
    department: "Marketing",
    checkIn: "09:00 AM",
    checkOut: "11:00 PM",
    status: "On-time",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 3,
  },
  {
    id: 3,
    name: "Tanya Johnson",
    email: "tanya@company.com",
    department: "Sales",
    checkIn: "10:30 AM",
    checkOut: "10:30 PM",
    status: "Late",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 2,
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike@company.com",
    department: "HR",
    checkIn: "08:45 AM",
    checkOut: "09:00 PM",
    status: "Early",
    avatar: "/professional-man.png",
    lengthOfService: 7,
  },
  {
    id: 5,
    name: "Barbara Sales",
    email: "barbara@company.com",
    department: "Finance",
    checkIn: "09:00 AM",
    checkOut: "08:00 PM",
    status: "Late",
    avatar: "/professional-woman-diverse.png",
    lengthOfService: 4,
  },
]

const employeeGrowthData = [
  { month: "Jan", employees: 180, newHires: 15 },
  { month: "Feb", employees: 185, newHires: 12 },
  { month: "Mar", employees: 190, newHires: 18 },
  { month: "Apr", employees: 195, newHires: 20 },
  { month: "May", employees: 200, newHires: 16 },
]

const employmentStatusData = [
  { name: "Permanent", value: 155, color: "#3B82F6" },
  { name: "Contract", value: 34, color: "#F59E0B" },
  { name: "Probation", value: 16, color: "#EF4444" },
]

export default function DashboardHome() {
  const [employees, setEmployees] = useState(initialEmployeeData)
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Week")

  // Calculate length of service data based on current employees
  const lengthOfServiceData = useMemo(() => {
    const serviceRanges = {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-5": 0,
      "5+": 0,
    }

    employees.forEach((emp) => {
      if (emp.lengthOfService <= 1) serviceRanges["0-1"]++
      else if (emp.lengthOfService <= 2) serviceRanges["1-2"]++
      else if (emp.lengthOfService <= 3) serviceRanges["2-3"]++
      else if (emp.lengthOfService <= 5) serviceRanges["3-5"]++
      else serviceRanges["5+"]++
    })

    return [
      { range: "0-1", count: serviceRanges["0-1"] },
      { range: "1-2", count: serviceRanges["1-2"] },
      { range: "2-3", count: serviceRanges["2-3"] },
      { range: "3-5", count: serviceRanges["3-5"] },
      { range: "5+", count: serviceRanges["5+"] },
    ]
  }, [employees])

  const totalEmployees = employees.length
  const newHires = 162
  const applicants = 14

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your company today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedTimeRange}
          </Button>
          <Button size="sm">Export</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% from last month
                </p>
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
                <p className="text-sm font-medium text-gray-600">New Hires</p>
                <p className="text-3xl font-bold text-gray-900">{newHires}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applicants</p>
                <p className="text-3xl font-bold text-gray-900">{applicants}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Pending review
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Employment Status</p>
              <div className="space-y-2">
                {employmentStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex space-x-1">
                {employmentStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      width: `${(item.value / employmentStatusData.reduce((sum, d) => sum + d.value, 0)) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Log */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attendance Log</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.slice(0, 5).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
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
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{employee.checkIn}</p>
                      <p className="text-xs text-gray-500">Check In</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{employee.checkOut}</p>
                      <p className="text-xs text-gray-500">Check Out</p>
                    </div>
                    <Badge
                      variant={
                        employee.status === "On-time"
                          ? "default"
                          : employee.status === "Late"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Growth */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee Growth</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                <p className="text-sm text-gray-500">Total Employees</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={employeeGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Employees"]} />
                  <Bar dataKey="employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Length of Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Length of Service</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lengthOfServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Employees"]} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee List</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.slice(0, 4).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
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
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{employee.department}</Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
