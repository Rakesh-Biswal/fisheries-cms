"use client"

import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Progress } from "../../../../components/ui/progress"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import { Users, DollarSign, UserCheck, UserX, Clock, Award } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function CeoHrPage() {
  const hrMetrics = {
    totalEmployees: 127,
    newHires: 8,
    turnoverRate: 12.5,
    avgSalary: 75000,
    trainingBudget: 45000,
    trainingSpent: 32000,
    attendanceRate: 94.2,
    satisfactionScore: 4.2,
  }

  const recruitmentPipeline = [
    { stage: "Applications", count: 245 },
    { stage: "Screening", count: 89 },
    { stage: "Interviews", count: 34 },
    { stage: "Final Round", count: 12 },
    { stage: "Offers", count: 8 },
  ]

  const departmentDistribution = [
    { name: "Engineering", value: 45, color: "#3b82f6" },
    { name: "Sales", value: 28, color: "#10b981" },
    { name: "Marketing", value: 18, color: "#f59e0b" },
    { name: "Operations", value: 22, color: "#ef4444" },
    { name: "HR", value: 14, color: "#8b5cf6" },
  ]

  const monthlyTurnover = [
    { month: "Jul", rate: 8.2 },
    { month: "Aug", rate: 11.5 },
    { month: "Sep", rate: 9.8 },
    { month: "Oct", rate: 13.2 },
    { month: "Nov", rate: 12.5 },
    { month: "Dec", rate: 10.1 },
  ]

  const topPerformers = [
    { name: "Sarah Johnson", role: "HR Manager", performance: 98, projects: 12 },
    { name: "Mike Chen", role: "Recruiter", performance: 94, projects: 8 },
    { name: "Lisa Brown", role: "Training Specialist", performance: 91, projects: 6 },
  ]

  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="hr" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* HR Department Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Human Resources</h1>
            <p className="text-muted-foreground">Employee management and organizational development</p>
          </div>
          <Badge variant="default" className="bg-blue-500">
            <Users className="w-4 h-4 mr-1" />
            {hrMetrics.totalEmployees} Employees
          </Badge>
        </div>

        {/* Key HR Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                New Hires (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{hrMetrics.newHires}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserX className="w-4 h-4 mr-2 text-red-500" />
                Turnover Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{hrMetrics.turnoverRate}%</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                Avg Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${hrMetrics.avgSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+3.2% YoY growth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{hrMetrics.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Above target (90%)</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recruitment Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>Current hiring funnel status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recruitmentPipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Turnover Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Turnover Trend</CardTitle>
              <CardDescription>Monthly turnover rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTurnover}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Distribution & Training */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Distribution</CardTitle>
              <CardDescription>Employees by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Training Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Training & Development</CardTitle>
              <CardDescription>Budget utilization and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Budget Utilization</span>
                  <span>
                    ${hrMetrics.trainingSpent.toLocaleString()} / ${hrMetrics.trainingBudget.toLocaleString()}
                  </span>
                </div>
                <Progress value={(hrMetrics.trainingSpent / hrMetrics.trainingBudget) * 100} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Certifications</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm text-muted-foreground">Training Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top HR Performers</CardTitle>
            <CardDescription>Highest performing HR team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {performer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-sm text-muted-foreground">{performer.role}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">{performer.performance}% Performance</div>
                    <div className="text-xs text-muted-foreground">{performer.projects} Active Projects</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
