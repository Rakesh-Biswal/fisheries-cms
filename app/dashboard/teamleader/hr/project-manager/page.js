"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Briefcase, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireProjectManagerForm from "@/components/HrComponent/HireProjectManagerForm"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function ProjectManagersPage() {
  const router = useRouter()
  const [projectManagers, setProjectManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [error, setError] = useState(null)

  const fetchProjectManagers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/project-manager/fetch-data`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setProjectManagers(data.data)
      } else {
        throw new Error("Failed to fetch project managers")
      }
    } catch (err) {
      console.error("Error fetching project managers:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectManagers()
  }, [])

  const handleHireSuccess = (newProjectManager) => {
    // Refresh data and close takeover view
    fetchProjectManagers()
    setShowHireForm(false)
  }

  const handleViewDetails = (managerId) => {
    router.push(`/dashboard/hr/project-manager/profile?id=${managerId}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {showHireForm ? (

        <div className="bg-white p-2 w-full">
          <div className="rounded-lg">
            <HireProjectManagerForm
              onClose={() => setShowHireForm(false)}
              onSuccess={handleHireSuccess}
            />
          </div>
        </div>

      ) : (
        // Original page content
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Project Managers</h1>
              <p className="text-muted-foreground">Manage project managers and their project portfolios</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="default" className="bg-blue-500 w-fit">
                <Users className="w-4 h-4 mr-1" />
                {projectManagers.length} Project Managers
              </Badge>
              <Button onClick={() => setShowHireForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hire New Project Manager
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchProjectManagers}>Try Again</Button>
              </CardContent>
            </Card>
          ) : projectManagers.length === 0 ? (
            <Card className="text-center p-8">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Project Managers Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by hiring your first project manager to oversee project operations.
              </p>
              <Button onClick={() => setShowHireForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Hire First Project Manager
              </Button>
            </Card>
          ) : (
            <>
              {/* Project Managers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectManagers.map((manager) => (
                  <Card key={manager._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={manager.photo || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{manager.name}</CardTitle>
                          <CardDescription>{manager.businessData?.designation}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Domain:</span>
                        <span className="font-medium flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {manager.businessData?.assignedDomain || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Team Size:</span>
                        <span className="font-medium">{manager.businessData?.teamSize || 0} members</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active Projects:</span>
                        <span className="font-medium">{manager.businessData?.activeProjects || 0} projects</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Target:</span>
                        <span className="font-medium">
                          {manager.businessData?.monthlyProjectTarget || "0"} projects
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={manager.status === "active" ? "default" : "secondary"}>{manager.status}</Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => handleViewDetails(manager._id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Project Managers Performance Overview
                  </CardTitle>
                  <CardDescription>Summary of all project managers' performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{projectManagers.length}</div>
                      <div className="text-sm text-muted-foreground">Total Managers</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {projectManagers.filter((m) => m.status === "active").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Managers</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {projectManagers.reduce((sum, manager) => sum + (manager.businessData?.teamSize || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Team Members</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {projectManagers.reduce((sum, manager) => sum + (manager.businessData?.activeProjects || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Active Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
