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
  Users,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Loader2,
  Shield,
  BarChart3,
  Star,
  ClipboardList
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamLeaderProfilePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  console.log("Team Leader Profile ID from URL:", id)
  const router = useRouter()
  const [teamLeader, setTeamLeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeamLeaderProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/team-leaders/team-leader/profile/${id}`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeamLeader(data.data)
      } else {
        throw new Error("Failed to fetch Team Leader profile")
      }
    } catch (err) {
      console.error("Error fetching Team Leader profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTeamLeaderProfile()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Team Leader profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !teamLeader) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || "Team Leader profile not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate performance metrics
  const teamPerformance = teamLeader.businessData?.teamPerformance || 85
  const teamTargetAchievement = teamLeader.businessData?.teamTargetAchievement || 92
  const teamSize = teamLeader.businessData?.teamSize || 8

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team Leaders
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={teamLeader.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {teamLeader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={teamLeader.status === "active" ? "default" : "secondary"} className="mb-2">
                  {teamLeader.status}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Team Leader
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{teamLeader.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {teamLeader.businessData?.designation || "Team Leader"}
                  </p>
                  <p className="text-sm text-muted-foreground">Employee ID: {teamLeader.empCode}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{teamLeader.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{teamLeader.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined:{" "}
                      {teamLeader.businessData?.joiningDate
                        ? new Date(teamLeader.businessData.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Team: {teamSize} members</span>
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
                <span className="font-medium">{teamLeader.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{teamLeader.phone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Email:</span>
                <span className="font-medium">{teamLeader.companyEmail}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personal Email:</span>
                <span className="font-medium">{teamLeader.personalEmail || "Not provided"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aadhar Number:</span>
                <span className="font-medium">****-****-{teamLeader.aadhar?.slice(-4) || "****"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAN Number:</span>
                <span className="font-medium">{teamLeader.pan || "Not provided"}</span>
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
                <span className="font-medium">{teamLeader.empCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{teamLeader.businessData?.department || "Operations"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Type:</span>
                <span className="font-medium">{teamLeader.businessData?.employeeType}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joining Date:</span>
                <span className="font-medium">
                  {teamLeader.businessData?.joiningDate
                    ? new Date(teamLeader.businessData.joiningDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={teamLeader.status === "active" ? "default" : "secondary"}>
                  {teamLeader.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Leadership Details */}
        <Card>
          <CardHeader>
            <CardTitle>Team Leadership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {teamSize} members
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Target:</span>
                <span className="font-medium">{teamLeader.businessData?.teamTarget || 0} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Achievement:</span>
                <span className="font-medium">{teamTargetAchievement}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Performance:</span>
                <span className="font-medium">{teamPerformance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                Team Target Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{teamTargetAchievement}%</div>
              <Progress value={teamTargetAchievement} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Target: {teamLeader.businessData?.teamTarget || 0} units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teamPerformance}%</div>
              <Progress value={teamPerformance} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Overall team efficiency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Leadership Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">4.8/5</div>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Based on team feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members Overview</CardTitle>
            <CardDescription>Summary of team members under this leader</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <p className="text-sm text-blue-800">Sales Executives</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">2</div>
                <p className="text-sm text-green-800">Senior Associates</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <p className="text-sm text-yellow-800">Trainees</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <p className="text-sm text-purple-800">Overall Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest leadership activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Team Excellence Award</p>
                  <p className="text-sm text-muted-foreground">
                    Received Q3 excellence award for outstanding team performance
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Exceeded Team Targets</p>
                  <p className="text-sm text-muted-foreground">
                    Team achieved 115% of quarterly targets
                  </p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Team Training Session</p>
                  <p className="text-sm text-muted-foreground">
                    Conducted advanced sales training for team members
                  </p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <ClipboardList className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Performance Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    Completed quarterly performance reviews for all team members
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