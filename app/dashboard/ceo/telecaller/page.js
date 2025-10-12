"use client"

import DashboardLayout from "@/components/CeoComponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, Target, TrendingUp, Mail, Phone, Mic, BarChart } from "lucide-react"

export default function CeoTeleCallerPage() {
  // Tele Caller department data
  const teleCallerData = {
    employees: [
      { id: 1, name: "Maria Garcia", role: "Team Lead", status: "active", efficiency: 93, callsToday: 45 },
      { id: 2, name: "James Wilson", role: "Senior Telecaller", status: "active", efficiency: 85, callsToday: 38 },
      { id: 3, name: "Anna Lee", role: "Telecaller", status: "busy", efficiency: 88, callsToday: 42 },
      { id: 4, name: "Robert Kumar", role: "Telecaller", status: "active", efficiency: 79, callsToday: 35 },
      { id: 5, name: "Sophie Martin", role: "Junior Telecaller", status: "active", efficiency: 82, callsToday: 32 },
    ],
    campaigns: [
      { id: 1, name: "Customer Outreach Campaign", progress: 70, deadline: "2024-01-18", callsMade: 1250, target: 2000 },
      { id: 2, name: "Lead Generation Drive", progress: 55, deadline: "2024-02-05", callsMade: 2200, target: 4000 },
      { id: 3, name: "Product Feedback Survey", progress: 85, deadline: "2024-01-12", callsMade: 850, target: 1000 },
      { id: 4, name: "Client Renewal Reminders", progress: 40, deadline: "2024-01-30", callsMade: 600, target: 1500 },
    ],
    metrics: { 
      callRate: 87, 
      conversion: 23, 
      satisfaction: 91,
      averageCallDuration: "4.2min",
      firstCallResolution: 78
    },
    dailyStats: {
      totalCalls: 192,
      successfulCalls: 156,
      appointmentsSet: 28,
      followUps: 45
    }
  }

  const deptData = teleCallerData

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tele Caller</h1>
              <p className="text-muted-foreground">Monitor call performance and campaign progress</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {deptData.employees.length} Call Agents
          </Badge>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Today's Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.dailyStats.totalCalls}</div>
              <div className="text-sm text-muted-foreground">Total calls made</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Successful Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.dailyStats.successfulCalls}</div>
              <div className="text-sm text-muted-foreground">Connected calls</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appointments Set</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.dailyStats.appointmentsSet}</div>
              <div className="text-sm text-muted-foreground">Meetings scheduled</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.dailyStats.followUps}</div>
              <div className="text-sm text-muted-foreground">Callbacks needed</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Call Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.callRate}%</div>
              <Progress value={deptData.metrics.callRate} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.conversion}%</div>
              <Progress value={deptData.metrics.conversion} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.satisfaction}%</div>
              <Progress value={deptData.metrics.satisfaction} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.averageCallDuration}</div>
              <div className="text-sm text-muted-foreground mt-1">Per call</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">First Call Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.firstCallResolution}%</div>
              <Progress value={deptData.metrics.firstCallResolution} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Employees and Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tele Calling Team
              </CardTitle>
              <CardDescription>Call agents and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptData.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.role}</div>
                        <div className="text-xs text-blue-600">{employee.callsToday} calls today</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          employee.status === "active" ? "default" : 
                          employee.status === "busy" ? "secondary" : "outline"
                        }
                      >
                        {employee.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">{employee.efficiency}% efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Active Campaigns
              </CardTitle>
              <CardDescription>Current calling campaigns and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptData.campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{campaign.name}</div>
                      <Badge variant="outline">{campaign.progress}%</Badge>
                    </div>
                    <Progress value={campaign.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {campaign.callsMade}/{campaign.target} calls
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {campaign.deadline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tele Caller Actions</CardTitle>
            <CardDescription>Quick actions for tele calling department management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Performance Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Start New Campaign
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Call Script Review
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                View Call Analytics
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Training Session
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Set Targets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}