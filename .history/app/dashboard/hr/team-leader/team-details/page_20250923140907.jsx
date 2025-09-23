"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Target, MapPin, Mail, Phone, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function TeamDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sample team data - in real app, you would fetch this from API
  const sampleTeamData = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    title: searchParams.get("title"),
    leaderId: searchParams.get("leaderId"),
    leaderName: searchParams.get("leaderName"),
    leaderEmail: searchParams.get("leaderEmail"),
    size: 4,
    members: [
      {
        id: "emp1",
        name: "Tanya Johnson",
        email: "tanya@gmail.com",
        position: "UX/UI Consultant",
        level: "Junior",
        status: "Permanent",
        avatar: "TJ"
      },
      {
        id: "emp2",
        name: "Rob Moon",
        email: "robmoon@gmail.com",
        position: "Software Engineer",
        level: "Senior",
        status: "Permanent",
        avatar: "RM"
      }
    ],
    progress: 75,
    target: 150000,
    createdAt: new Date().toLocaleDateString()
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeam(sampleTeamData)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Team not found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{team.name} Team</h1>
              <p className="text-muted-foreground">{team.title}</p>
            </div>
          </div>
          <Badge variant="default" className="bg-blue-500">
            <Users className="w-4 h-4 mr-1" />
            {team.size} Members
          </Badge>
        </div>

        {/* Team Leader Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Leader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {team.leaderName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-xl">{team.leaderName}</h3>
                <p className="text-sm text-muted-foreground">{team.leaderEmail}</p>
                <div className="flex mt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{team.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${team.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{team.target.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{team.createdAt}</div>
              <p className="text-xs text-muted-foreground">Team creation date</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members ({team.members.length})</CardTitle>
            <CardDescription>Current team members and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-sm">{member.position}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className={
                          member.level === "Senior" ? "text-green-600 bg-green-100" :
                          member.level === "Mid" ? "text-blue-600 bg-blue-100" :
                          "text-orange-600 bg-orange-100"
                        }>
                          {member.level}
                        </Badge>
                        <Badge variant={
                          member.status === "Permanent" ? "default" :
                          member.status === "Contract" ? "secondary" : "outline"
                        }>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}