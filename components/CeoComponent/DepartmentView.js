"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Users, Calendar, Target, TrendingUp, Mail } from "lucide-react"

export default function DepartmentView({ department }) {
  if (!department) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Select a Department</h2>
          <p className="text-muted-foreground">Choose a department from the sidebar to view details</p>
        </div>
      </div>
    )
  }

  // Dummy data based on department
  const getDepartmentData = (deptId) => {
    const data = {
      hr: {
        employees: [
          { id: 1, name: "Sarah Johnson", role: "HR Manager", status: "active", efficiency: 95 },
          { id: 2, name: "Mike Chen", role: "Recruiter", status: "active", efficiency: 88 },
          { id: 3, name: "Lisa Brown", role: "HR Specialist", status: "busy", efficiency: 92 },
        ],
        projects: [
          { id: 1, name: "Employee Onboarding System", progress: 75, deadline: "2024-01-15" },
          { id: 2, name: "Performance Review Process", progress: 60, deadline: "2024-01-30" },
        ],
        metrics: { satisfaction: 92, retention: 88, productivity: 85 },
      },
      accountant: {
        employees: [
          { id: 1, name: "David Wilson", role: "Chief Accountant", status: "active", efficiency: 96 },
          { id: 2, name: "Emma Davis", role: "Financial Analyst", status: "active", efficiency: 89 },
          { id: 3, name: "John Smith", role: "Bookkeeper", status: "active", efficiency: 91 },
        ],
        projects: [
          { id: 1, name: "Q4 Financial Report", progress: 90, deadline: "2024-01-10" },
          { id: 2, name: "Budget Planning 2024", progress: 45, deadline: "2024-02-01" },
        ],
        metrics: { accuracy: 98, efficiency: 94, compliance: 96 },
      },
      projectmanager: {
        employees: [
          { id: 1, name: "Alex Rodriguez", role: "Senior PM", status: "busy", efficiency: 94 },
          { id: 2, name: "Rachel Green", role: "Project Coordinator", status: "active", efficiency: 87 },
          { id: 3, name: "Tom Anderson", role: "Scrum Master", status: "active", efficiency: 91 },
        ],
        projects: [
          { id: 1, name: "Website Redesign", progress: 65, deadline: "2024-01-20" },
          { id: 2, name: "Mobile App Development", progress: 40, deadline: "2024-03-15" },
          { id: 3, name: "CRM Integration", progress: 80, deadline: "2024-01-25" },
        ],
        metrics: { onTime: 89, quality: 92, satisfaction: 88 },
      },
      telecaller: {
        employees: [
          { id: 1, name: "Maria Garcia", role: "Team Lead", status: "active", efficiency: 93 },
          { id: 2, name: "James Wilson", role: "Senior Caller", status: "active", efficiency: 85 },
          { id: 3, name: "Anna Lee", role: "Telecaller", status: "busy", efficiency: 88 },
        ],
        projects: [
          { id: 1, name: "Customer Outreach Campaign", progress: 70, deadline: "2024-01-18" },
          { id: 2, name: "Lead Generation Drive", progress: 55, deadline: "2024-02-05" },
        ],
        metrics: { callRate: 87, conversion: 23, satisfaction: 91 },
      },
    }
    return data[deptId] || data.hr
  }

  const deptData = getDepartmentData(department.id)

  const Icon = department.icon

  return (
    <div className="p-6 space-y-6">
      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${department.color} rounded-lg flex items-center justify-center`}>
            
          </div>

          <div>
            <h1 className="text-3xl font-bold">{department.name}</h1>
            <p className="text-muted-foreground">
              {department.employees} employees • {department.status}
            </p>
          </div>
        </div>
        <Badge variant={department.status === "active" ? "default" : "secondary"}>{department.status}</Badge>
      </div>

      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(deptData.metrics).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}%</div>
              <Progress value={value} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employees and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Current employees and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptData.employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
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
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                    <div className="text-sm text-muted-foreground mt-1">{employee.efficiency}% efficiency</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current projects and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptData.projects.map((project) => (
                <div key={project.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{project.name}</div>
                    <Badge variant="outline">{project.progress}%</Badge>
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
          <CardTitle>Department Actions</CardTitle>
          <CardDescription>Quick actions for department management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Set Goals
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
