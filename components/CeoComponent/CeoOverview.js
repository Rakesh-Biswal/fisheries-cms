"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { TrendingUp, TrendingDown, Users, DollarSign, Eye, Target } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

export default function CeoOverview() {
  // Dummy data for charts
  const revenueData = [
    { month: "Jan", revenue: 85000, transactions: 245 },
    { month: "Feb", revenue: 92000, transactions: 267 },
    { month: "Mar", revenue: 78000, transactions: 223 },
    { month: "Apr", revenue: 105000, transactions: 298 },
    { month: "May", revenue: 118000, transactions: 334 },
    { month: "Jun", revenue: 125000, transactions: 356 },
  ]

  const trafficData = [
    { day: "Mon", visitors: 1200, pageViews: 3400 },
    { day: "Tue", visitors: 1100, pageViews: 3100 },
    { day: "Wed", visitors: 1400, pageViews: 3800 },
    { day: "Thu", visitors: 1300, pageViews: 3600 },
    { day: "Fri", visitors: 1600, pageViews: 4200 },
    { day: "Sat", visitors: 900, pageViews: 2400 },
    { day: "Sun", visitors: 800, pageViews: 2100 },
  ]

  const departmentPerformance = [
    { dept: "HR", efficiency: 92, projects: 8 },
    { dept: "Accounting", efficiency: 88, projects: 12 },
    { dept: "PM", efficiency: 95, projects: 15 },
    { dept: "Telecaller", efficiency: 85, projects: 25 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Overview</h1>
          <p className="text-muted-foreground">Real-time insights and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Live Data</Badge>
          <Badge variant="secondary">Updated 2 min ago</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3 new hires this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />2 completed this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Transactions</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#82ca9d" />
                <Bar dataKey="pageViews" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Efficiency and project status across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentPerformance.map((dept) => (
              <div key={dept.dept} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium">{dept.dept}</div>
                  <div className="flex-1 max-w-xs">
                    <Progress value={dept.efficiency} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">{dept.efficiency}%</div>
                </div>
                <Badge variant="outline">{dept.projects} projects</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">New employee onboarded in HR department</div>
                <div className="text-xs text-muted-foreground ml-auto">2h ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">Project milestone completed by PM team</div>
                <div className="text-xs text-muted-foreground ml-auto">4h ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="text-sm">Monthly financial report generated</div>
                <div className="text-xs text-muted-foreground ml-auto">1d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Q2 Financial Review</div>
                <Badge variant="destructive">Due in 2 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Employee Performance Reviews</div>
                <Badge variant="secondary">Due in 1 week</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Project Alpha Delivery</div>
                <Badge variant="outline">Due in 2 weeks</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
