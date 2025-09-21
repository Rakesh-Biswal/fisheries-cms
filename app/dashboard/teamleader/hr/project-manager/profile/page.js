"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Clock,
  Award,
  TrendingUp,
  Users,
  Loader2,
  Briefcase,
  Target,
  Calendar,
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function ProjectManagerProfilePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  console.log("Project Manager Profile ID from URL:", id)
  const router = useRouter()
  const [projectManager, setProjectManager] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjectManagerProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/project-manager/profile/${id}`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setProjectManager(data.data)
      } else {
        throw new Error("Failed to fetch Project Manager profile")
      }
    } catch (err) {
      console.error("Error fetching Project Manager profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProjectManagerProfile()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Project Manager profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !projectManager) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || "Project Manager profile not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project Managers
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={projectManager.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {projectManager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={projectManager.status === "active" ? "default" : "secondary"} className="mb-2">
                  {projectManager.status}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{projectManager.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {projectManager.businessData?.designation || "Project Manager"}
                  </p>
                  <p className="text-sm text-muted-foreground">Employee ID: {projectManager.empCode}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{projectManager.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{projectManager.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined:{" "}
                      {projectManager.businessData?.joiningDate
                        ? new Date(projectManager.businessData.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{projectManager.businessData?.employeeType}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-medium">{projectManager.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{projectManager.phone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Email:</span>
                <span className="font-medium">{projectManager.companyEmail}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aadhar Number:</span>
                <span className="font-medium">****-****-{projectManager.aadhar?.slice(-4) || "****"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAN Number:</span>
                <span className="font-medium">{projectManager.pan || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Code:</span>
                <span className="font-medium">{projectManager.empCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{projectManager.businessData?.department || "Project Management"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Type:</span>
                <span className="font-medium">{projectManager.businessData?.employeeType}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joining Date:</span>
                <span className="font-medium">
                  {projectManager.businessData?.joiningDate
                    ? new Date(projectManager.businessData.joiningDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={projectManager.status === "active" ? "default" : "secondary"}>
                  {projectManager.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Management Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Management Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Domain:</span>
                <span className="font-medium flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {projectManager.businessData?.assignedDomain || "Not assigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-medium">{projectManager.businessData?.teamSize || 0} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Projects:</span>
                <span className="font-medium">{projectManager.businessData?.activeProjects || 0} projects</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Target:</span>
                <span className="font-medium">{projectManager.businessData?.monthlyProjectTarget || 0} projects</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Project Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">92.3%</div>
              <Progress value={92.3} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Above target (85%)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8.9/10</div>
              <Progress value={89} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                Team Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">9.1/10</div>
              <Progress value={91} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">High team satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest project management activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Completed Project Management Certification</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully completed advanced project management certification (PMP)
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Delivered E-commerce Platform Project</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully delivered major e-commerce platform 2 weeks ahead of schedule
                  </p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Improved Team Productivity</p>
                  <p className="text-sm text-muted-foreground">
                    Implemented new project tracking system increasing team productivity by 25%
                  </p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Onboarded New Team Members</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully onboarded 3 new developers to the mobile app development team
                  </p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
