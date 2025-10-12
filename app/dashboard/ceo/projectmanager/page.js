"use client"

import DashboardLayout from "@/components/CeoComponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, Target, TrendingUp, Mail, Briefcase } from "lucide-react"

export default function CeoProjectManagerPage() {
  // Project Manager department data
  const projectManagerData = {
    employees: [
      { id: 1, name: "Alex Rodriguez", role: "Senior Project Manager", status: "busy", efficiency: 94 },
      { id: 2, name: "Rachel Green", role: "Project Coordinator", status: "active", efficiency: 87 },
      { id: 3, name: "Tom Anderson", role: "Scrum Master", status: "active", efficiency: 91 },
      { id: 4, name: "Priya Sharma", role: "Project Manager", status: "active", efficiency: 89 },
      { id: 5, name: "Marcus Lee", role: "Assistant PM", status: "busy", efficiency: 85 },
    ],
    projects: [
      { id: 1, name: "Website Redesign", progress: 65, deadline: "2024-01-20", priority: "High" },
      { id: 2, name: "Mobile App Development", progress: 40, deadline: "2024-03-15", priority: "Medium" },
      { id: 3, name: "CRM Integration", progress: 80, deadline: "2024-01-25", priority: "High" },
      { id: 4, name: "Client Portal Upgrade", progress: 25, deadline: "2024-04-10", priority: "Medium" },
    ],
    metrics: { 
      onTime: 89, 
      quality: 92, 
      satisfaction: 88,
      budgetAdherence: 94,
      resourceUtilization: 87
    },
  }

  const deptData = projectManagerData

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Project Manager</h1>
              <p className="text-muted-foreground">Monitor and manage project delivery and team performance</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {deptData.employees.length} Team Members
          </Badge>
        </div>

        {/* Department Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                On Time Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.onTime}%</div>
              <Progress value={deptData.metrics.onTime} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.quality}%</div>
              <Progress value={deptData.metrics.quality} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.satisfaction}%</div>
              <Progress value={deptData.metrics.satisfaction} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.budgetAdherence}%</div>
              <Progress value={deptData.metrics.budgetAdherence} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deptData.metrics.resourceUtilization}%</div>
              <Progress value={deptData.metrics.resourceUtilization} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Employees and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Project Management Team
              </CardTitle>
              <CardDescription>Current project managers and coordinators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptData.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.role}</div>
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

          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Active Projects
              </CardTitle>
              <CardDescription>Current projects and their progress status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptData.projects.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{project.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            project.priority === "High" ? "destructive" : 
                            project.priority === "Medium" ? "secondary" : "outline"
                          }
                        >
                          {project.priority}
                        </Badge>
                        <Badge variant="outline">{project.progress}%</Badge>
                      </div>
                    </div>
                    <Progress value={project.progress} className="mb-2" />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due: {project.deadline}
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
            <CardTitle>Project Management Actions</CardTitle>
            <CardDescription>Quick actions for project management department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Team Update
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Project Review
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Set Project Milestones
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Project Reports
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Resource Allocation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}