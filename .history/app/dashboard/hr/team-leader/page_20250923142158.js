"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Target, MapPin, TrendingUp, X, Mail, Phone, Calendar, Building, Crown } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireTeamLeaderForm from "@/components/HrComponent/HireTeamLeaderForm"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamLeadersPage() {
  const router = useRouter()
  const [teamLeaders, setTeamLeaders] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [availableEmployees, setAvailableEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [error, setError] = useState(null)

  const [newTeam, setNewTeam] = useState({
    name: "",
    title: "",
    leader: "",
  })

  // Sample employee data
  const sampleEmployees = [
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
    },
    {
      id: "emp3",
      name: "Sophia Miller",
      email: "sophia@gmail.com",
      position: "Strategy Consultant",
      level: "Senior",
      status: "Permanent",
      avatar: "SM"
    },
    {
      id: "emp4",
      name: "Barbara Sales",
      email: "barbara@gmail.com",
      position: "Finance",
      level: "Mid",
      status: "Contract",
      avatar: "BS"
    }
  ]

  const fetchTeamLeaders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/team-leaders/fetch-data`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeamLeaders(data.data || [])
      } else {
        throw new Error("Failed to fetch team leaders")
      }
    } catch (err) {
      console.error("Error fetching team leaders:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableEmployees = async () => {
    try {
      setAvailableEmployees(sampleEmployees)
    } catch (err) {
      console.error("Error fetching employees:", err)
      toast.error("Failed to fetch available employees")
    }
  }

  useEffect(() => {
    fetchTeamLeaders()
  }, [])

  const handleHireSuccess = () => {
    fetchTeamLeaders()
    setShowHireForm(false)
  }

  const handleViewLeaderDetails = (managerId) => {
    router.push(`/dashboard/hr/team-leader/profile?id=${managerId}`)
  }

  const handleManageTeam = (team) => {
    // Redirect to team details page with team data as query parameters
    const queryParams = new URLSearchParams({
      id: team.id,
      name: team.name,
      title: team.title,
      leaderId: team.leaderId,
      leaderName: team.leaderName,
      leaderEmail: team.leaderEmail
    }).toString()
    
    router.push(`d/team-leader/profile/team-details?${queryParams}`)
  }
//dashboard/hr/team-leader
  const handleCreateTeam = () => {
    if (!newTeam.name || !newTeam.title || !newTeam.leader) {
      toast.error("Please fill all fields")
      return
    }

    const leader = teamLeaders.find(l => l._id === newTeam.leader)

    const newTeamData = {
      id: Date.now().toString(),
      name: newTeam.name,
      title: newTeam.title,
      leaderId: newTeam.leader,
      leaderName: leader?.name || "Unknown",
      leaderAvatar: leader?.photo || "/placeholder.svg",
      leaderEmail: leader?.email || "No email",
      size: 0,
      members: [],
      createdAt: new Date().toLocaleDateString(),
      progress: Math.floor(Math.random() * 100),
      target: Math.floor(Math.random() * 100000) + 50000,
    }

    setTeams([...teams, newTeamData])
    setNewTeam({ name: "", title: "", leader: "" })
    setShowTeamForm(false)
    toast.success("Team created successfully!")
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Permanent": return "default"
      case "Contract": return "secondary"
      case "Probation": return "outline"
      default: return "secondary"
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Senior": return "text-green-600 bg-green-100"
      case "Mid": return "text-blue-600 bg-blue-100"
      case "Junior": return "text-orange-600 bg-orange-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
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
            <HireTeamLeaderForm
              onClose={() => setShowHireForm(false)}
              onSuccess={handleHireSuccess}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Team Leaders</h1>
              <p className="text-muted-foreground">Manage sales team leaders and their performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="default" className="bg-blue-500 w-fit">
                <Users className="w-4 h-4 mr-1" />
                {teamLeaders.length} Team Leaders
              </Badge>
              <Button onClick={() => setShowHireForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hire New Team Leader
              </Button>
              <Button onClick={() => setShowTeamForm(true)} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-1" />
                Create New Team
              </Button>
            </div>
          </div>

          {/* Teams Table Format */}
          {teams.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Teams ({teams.length})</h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Team Name</th>
                      <th className="px-4 py-3 text-left font-medium">Title</th>
                      <th className="px-4 py-3 text-left font-medium">Leader</th>
                      <th className="px-4 py-3 text-left font-medium">Progress</th>
                      <th className="px-4 py-3 text-left font-medium">Target</th>
                      <th className="px-4 py-3 text-left font-medium">Created</th>
                      <th className="px-4 py-3 text-left font-medium">Members</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{team.name}</td>
                        <td className="px-4 py-3">{team.title}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={team.leaderAvatar} />
                            <AvatarFallback>
                              {team.leaderName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{team.leaderName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(team.progress)}`}
                                style={{ width: `${team.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{team.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">₹{team.target?.toLocaleString()}</td>
                        <td className="px-4 py-3">{team.createdAt}</td>
                        <td className="px-4 py-3">{team.size} members</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageTeam(team)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Team Leaders Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Leaders ({teamLeaders.length})</h2>
            
            {error ? (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchTeamLeaders}>Try Again</Button>
                </CardContent>
              </Card>
            ) : teamLeaders.length === 0 ? (
              <Card className="text-center p-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Team Leaders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by hiring your first team leader to manage sales operations.
                </p>
                <Button onClick={() => setShowHireForm(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Hire First Team Leader
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamLeaders.map((leader) => (
                  <Card key={leader._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={leader.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            {leader.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "TL"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{leader.name || "Unknown Leader"}</CardTitle>
                          <CardDescription>{leader.businessData?.designation || "Team Leader"}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Zone:</span>
                        <span className="font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {leader.businessData?.assignedZone || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Team Size:</span>
                        <span className="font-medium">{leader.businessData?.teamSize || 0} members</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Target:</span>
                        <span className="font-medium">
                          ₹{(leader.businessData?.monthlyTarget || 0)?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={leader.status === "active" ? "default" : "secondary"}>
                          {leader.status || "inactive"}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewLeaderDetails(leader._id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Team Name</Label>
              <Input
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Enter team name"
              />
            </div>
            <div>
              <Label>Team Title</Label>
              <Input
                value={newTeam.title}
                onChange={(e) => setNewTeam({ ...newTeam, title: e.target.value })}
                placeholder="Enter team title"
              />
            </div>
            <div>
              <Label>Assign Leader</Label>
              <Select
                value={newTeam.leader}
                onValueChange={(val) => setNewTeam({ ...newTeam, leader: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leader" />
                </SelectTrigger>
                <SelectContent>
                  {teamLeaders.map((leader) => (
                    <SelectItem key={leader._id} value={leader._id}>
                      {leader.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowTeamForm(false)}>Cancel</Button>
            <Button onClick={handleCreateTeam}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}