// components/Hrcomponent/overview.js
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MoreHorizontal, TrendingUp, Users, UserPlus, FileText, Calendar, Filter, Download, ArrowRight } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function HROverviewPage() {
  const router = useRouter()
  const [overviewData, setOverviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("01 Sept - 29 Sept 2025")

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/overview`, {
        credentials: "include"
      })
      const result = await response.json()
      
      if (result.success) {
        setOverviewData(result.data)
      } else {
        // Fallback to sample data if API fails
        setOverviewData(generateSampleData())
      }
    } catch (error) {
      console.error("Error fetching overview data:", error)
      // Fallback to sample data
      setOverviewData(generateSampleData())
    } finally {
      setLoading(false)
    }
  }

  // Generate sample data as fallback
  const generateSampleData = () => {
    return {
      stats: {
        totalEmployees: 156,
        newHires: 28,
        applicants: 42,
        totalFarmers: 89,
        employmentStatus: {
          permanent: 120,
          contract: 24,
          probation: 12
        }
      },
      recentEmployees: [
        {
          _id: "1",
          name: "Rajesh Kumar",
          companyEmail: "rajesh@company.com",
          photo: "",
          role: "sales-employee",
          empCode: "EMP001",
          createdAt: new Date()
        },
        {
          _id: "2", 
          name: "Priya Sharma",
          companyEmail: "priya@company.com",
          photo: "",
          role: "team-leader",
          empCode: "EMP002",
          createdAt: new Date()
        },
        {
          _id: "3",
          name: "Amit Patel", 
          companyEmail: "amit@company.com",
          photo: "",
          role: "project-manager",
          empCode: "EMP003",
          createdAt: new Date()
        },
        {
          _id: "4",
          name: "Sneha Reddy",
          companyEmail: "sneha@company.com", 
          photo: "",
          role: "accountant",
          empCode: "EMP004",
          createdAt: new Date()
        }
      ],
      employeeGrowthData: [
        { month: "Jul", totalEmployees: 142, newHires: 18 },
        { month: "Aug", totalEmployees: 148, newHires: 22 },
        { month: "Sept", totalEmployees: 156, newHires: 28 }
      ],
      lengthOfServiceData: [
        { range: "0-1", count: 45 },
        { range: "1-2", count: 38 },
        { range: "2-3", count: 32 },
        { range: "3-5", count: 25 },
        { range: "5+", count: 16 }
      ]
    }
  }

  const handleViewAllEmployees = () => {
    router.push("/dashboard/hr/data-management")
  }

  const handleViewAllAttendance = () => {
    router.push("/dashboard/hr/attandanceSheetEmp")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { stats, recentEmployees, employeeGrowthData, lengthOfServiceData } = overviewData

  // Format employee data for display
  const displayEmployees = recentEmployees.slice(0, 4).map(emp => ({
    id: emp._id,
    name: emp.name,
    email: emp.companyEmail,
    department: emp.role === 'team-leader' ? 'Team Leader' : 
                emp.role === 'sales-employee' ? 'Sales' :
                emp.role === 'project-manager' ? 'Project Management' :
                emp.role === 'telecaller' ? 'Telecalling' :
                emp.role === 'accountant' ? 'Accounting' : 'HR',
    position: emp.role === 'team-leader' ? 'Team Lead' : 
              emp.role === 'sales-employee' ? 'Sales Executive' :
              emp.role === 'project-manager' ? 'Project Manager' :
              emp.role === 'telecaller' ? 'Telecaller' :
              emp.role === 'accountant' ? 'Accountant' : 'HR Manager',
    level: 'Active',
    status: 'Permanent',
    avatar: emp.photo || "/placeholder-avatar.jpg"
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to Diga-Darshan HR Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedPeriod}
            </Button>
            <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Employees */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEmployees}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Hires */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Hires</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.newHires}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
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

          {/* Applicants */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applicants</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.applicants}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <FileText className="h-3 w-3 mr-1" />
                    +8% from last week
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Farmers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalFarmers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active customers
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employment Status Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">Employment Status</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="flex h-3 rounded-full">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(stats.employmentStatus.permanent / stats.totalEmployees) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-orange-500" 
                    style={{ width: `${(stats.employmentStatus.contract / stats.totalEmployees) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(stats.employmentStatus.probation / stats.totalEmployees) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Permanent</span>
                  </div>
                  <span className="font-semibold">{stats.employmentStatus.permanent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Contract</span>
                  </div>
                  <span className="font-semibold">{stats.employmentStatus.contract}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Probation</span>
                  </div>
                  <span className="font-semibold">{stats.employmentStatus.probation}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Employees</CardTitle>
                <Button 
                  onClick={handleViewAllEmployees}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                        <Badge variant="secondary" className="mt-1">
                          {employee.position}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                    <p className="text-sm text-gray-600">Total Employees</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">Employees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">New Hires</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="totalEmployees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newHires" fill="#93c5fd" radius={[4, 4, 0, 0]} />
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
            <CardHeader>
              <CardTitle>Length of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={lengthOfServiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="range" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance Summary</CardTitle>
              <Button 
                onClick={handleViewAllAttendance}
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Present Today</span>
                  <Badge variant="default">{Math.floor(stats.totalEmployees * 0.85)}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">On Leave</span>
                  <Badge variant="secondary">{Math.floor(stats.totalEmployees * 0.08)}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Late Arrivals</span>
                  <Badge variant="destructive">{Math.floor(stats.totalEmployees * 0.05)}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Absent</span>
                  <Badge variant="outline">{Math.floor(stats.totalEmployees * 0.02)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}