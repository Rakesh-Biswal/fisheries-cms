"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Target, MapPin } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireTeamLeaderForm from "@/components/HrComponent/HireTeamLeaderForm"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"   // ✅ for success popup


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamLeadersPage() {
  const router = useRouter()
  const [teamLeaders, setTeamLeaders] = useState([])
  const [teams, setTeams] = useState([]) // <-- new state for teams
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false) // <-- team form modal
  const [error, setError] = useState(null)

  const [newTeam, setNewTeam] = useState({
    name: "",
    title: "",
    leader: "",
  })

  const fetchTeamLeaders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/team-leaders/fetch-data`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeamLeaders(data.data)
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

  useEffect(() => {
    fetchTeamLeaders()
  }, [])

  const handleHireSuccess = () => {
    fetchTeamLeaders()
    setShowHireForm(false)
  }

  const handleViewDetails = (managerId) => {
    router.push(`/dashboard/hr/team-leader/profile?id=${managerId}`)
  }

  const handleCreateTeam = () => {
    if (!newTeam.name || !newTeam.title || !newTeam.leader) return

    const leader = teamLeaders.find(l => l._id === newTeam.leader)

    const newTeamData = {
      id: Date.now(),
      name: newTeam.name,
      title: newTeam.title,
      leaderName: leader?.name || "Unknown",
      size: 0,
      createdAt: new Date().toLocaleDateString(),
    }

    setTeams([...teams, newTeamData])
    setNewTeam({ name: "", title: "", leader: "" })
    setShowTeamForm(false)
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

          {/* Team Cards */}
          {teams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="font-medium">{team.size} members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leader:</span>
                      <span className="font-medium">{team.leaderName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{team.createdAt}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Existing Team Leaders Grid */}
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
            <>
              {/* Team Leaders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamLeaders.map((leader) => (
                  <Card key={leader._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={leader.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            {leader.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{leader.name}</CardTitle>
                          <CardDescription>{leader.businessData?.designation}</CardDescription>
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
                          ₹{leader.businessData?.monthlyTarget?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={leader.status === "active" ? "default" : "secondary"}>
                          {leader.status}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewDetails(leader._id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
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
              />
            </div>
            <div>
              <Label>Team Title</Label>
              <Input
                value={newTeam.title}
                onChange={(e) => setNewTeam({ ...newTeam, title: e.target.value })}
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
       {/* ✅ Team Details Modal */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-4">
              <p><strong>Team Name:</strong> {selectedTeam.name}</p>
              <p><strong>Team Leader:</strong> {selectedTeam.leaderName}</p>
              <p><strong>No. of Workers:</strong> {selectedTeam.size}</p>

              <div>
                <strong>Workers List:</strong>
                {selectedTeam.workers && selectedTeam.workers.length > 0 ? (
                  <ul className="list-disc pl-6 mt-2 text-gray-700">
                    {selectedTeam.workers.map((worker, index) => (
                      <li key={index}>{worker}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-2">No workers yet.</p>
                )}
              </div>

              {/* Assign new employee */}
              <div className="flex gap-2 items-center mt-4">
                <Input
                  placeholder="Enter new employee name"
                  value={newEmployee}
                  onChange={(e) => setNewEmployee(e.target.value)}
                />
                <Button onClick={handleAssignEmployee}>Assign</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
 