"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireTeamLeaderForm from "@/components/HrComponent/HireTeamLeaderForm"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import { StatsCards } from "@/components/HrComponent/TeamLeaders/StatsCards"
import { TeamLeadersTable } from "@/components/HrComponent/TeamLeaders/TeamLeadersTable"
import { TeamsTable } from "@/components/HrComponent/TeamLeaders/TeamsTable"
import { TeamGrowthChart } from "@/components/HrComponent/TeamLeaders/TeamGrowthChart"
import { CreateTeamModal } from "@/components/HrComponent/TeamLeaders/CreateTeamModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamLeadersPage() {
  const router = useRouter()
  const [teamLeaders, setTeamLeaders] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [teamLoading, setTeamLoading] = useState(false)
  const [showHireForm, setShowHireForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [selectedPeriod] = useState("01 Sept - 29 Sept 2025")
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    leader: "",
    region: "",
    project: "",
    performanceScore: null,
    notes: ""
  })

  const fetchTeamLeaders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/team-leaders/team-leader/fetch-data`, {
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
      toast.error("Failed to fetch team leaders")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/fetch`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data.data || [])
      }
    } catch (err) {
      console.error("Error fetching teams:", err)
    }
  }

  useEffect(() => {
    fetchTeamLeaders()
    fetchTeams()
  }, [])

  const handleHireSuccess = () => {
    fetchTeamLeaders()
    setShowHireForm(false)
  }

  const handleViewLeaderDetails = (managerId) => {
    router.push(`/dashboard/hr/team-leader/profile?id=${managerId}`)
  }

  const handleManageTeam = (team) => {
    const queryParams = new URLSearchParams({
      id: team._id,
      name: team.name,
    }).toString()
    router.push(`/dashboard/hr/team-leader/team-details?${queryParams}`)
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.leader) {
      toast.error("Please fill all required fields")
      return
    }

    setTeamLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newTeam),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Team created successfully!")
        setTeams(prev => [result.data, ...prev])
        setNewTeam({
          name: "",
          description: "",
          leader: "",
          region: "",
          project: "",
          performanceScore: null,
          notes: ""
        })
        setShowTeamForm(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create team")
      }
    } catch (error) {
      toast.error(error.message || "Failed to create team")
    } finally {
      setTeamLoading(false)
    }
  }

  if (showHireForm) {
    return (
      <DashboardLayout>
        <div className="bg-white p-2 w-full">
          <div className="rounded-lg">
            <HireTeamLeaderForm
              onClose={() => setShowHireForm(false)}
              onSuccess={handleHireSuccess}
            />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Leaders</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage sales team leaders and their performance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              {selectedPeriod}
            </Button>
            <Button
              onClick={() => setShowHireForm(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-xs"
            >
              <Plus className="h-4 w-4 mr-2" />
              Hire Team Leader
            </Button>
            <Button
              onClick={() => setShowTeamForm(true)}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-xs"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards teamLeaders={teamLeaders} teams={teams} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Leaders Table - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <TeamsTable teams={teams} onManageTeam={handleManageTeam} />
            <TeamLeadersTable
              teamLeaders={teamLeaders}
              onViewDetails={handleViewLeaderDetails}
              loading={loading}
            />
          </div>

          {/* Growth Chart - 1/3 width */}
          <div className="space-y-6">
            <TeamGrowthChart teamLeaders={teamLeaders} teams={teams} />
          </div>
        </div>

        {/* Create Team Modal */}
        <CreateTeamModal
          open={showTeamForm}
          onOpenChange={setShowTeamForm}
          teamLeaders={teamLeaders}
          onCreateTeam={handleCreateTeam}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          loading={teamLoading}
        />
      </div>
    </DashboardLayout>
  )
}