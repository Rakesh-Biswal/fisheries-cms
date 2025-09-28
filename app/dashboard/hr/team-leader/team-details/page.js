"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Import components
import { TeamHeader } from "@/components/HrComponent/TeamDetails/TeamHeader"
import { TeamStats } from "@/components/HrComponent/TeamDetails/TeamStats"
import { TeamMembersTable } from "@/components/HrComponent/TeamDetails/TeamMembersTable"
import { AssignEmployeesModal } from "@/components/HrComponent/TeamDetails/AssignEmployeesModal"
import { EditTeamModal } from "@/components/HrComponent/TeamDetails/EditTeamModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamId = searchParams.get("id")
  
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [availableEmployees, setAvailableEmployees] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchTeamDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/details/${teamId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeam(data.data)
      } else {
        throw new Error("Failed to fetch team details")
      }
    } catch (err) {
      console.error("Error fetching team details:", err)
      toast.error("Failed to fetch team details")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/details/employees/available`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableEmployees(data.data || [])
      }
    } catch (err) {
      console.error("Error fetching available employees:", err)
      // For demo purposes, using sample data
      setAvailableEmployees([
        {
          _id: "emp1",
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          designation: "Sales Executive",
          status: "active",
          photo: null
        },
        {
          _id: "emp2", 
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "0987654321",
          designation: "Sales Manager",
          status: "active",
          photo: null
        }
      ])
    }
  }

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails()
      fetchAvailableEmployees()
    }
  }, [teamId])

  const handleAssignEmployees = async (employeeIds) => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/details/add-employee/${teamId}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ employeeIds }),
      })

      if (response.ok) {
        const result = await response.json()
        setTeam(result.data)
        toast.success("Employees assigned successfully!")
        setShowAssignModal(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to assign employees")
      }
    } catch (error) {
      toast.error(error.message || "Failed to assign employees")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateTeam = async (formData) => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/hr/team-leaders/teams/details/update/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setTeam(result.data)
        toast.success("Team updated successfully!")
        setShowEditModal(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update team")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update team")
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveEmployee = async (employeeId) => {
    try {
      const response = await fetch(`${API_URL}/api/hr/teams/${teamId}/employees/${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        const result = await response.json()
        setTeam(result.data)
        toast.success("Employee removed from team successfully!")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to remove employee")
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove employee")
    }
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
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
        <TeamHeader team={team} onBack={() => router.back()} />
        
        <TeamStats team={team} />
        
        <TeamMembersTable 
          team={team}
          onAssignEmployees={() => setShowAssignModal(true)}
          onEditTeam={() => setShowEditModal(true)}
          onRemoveEmployee={handleRemoveEmployee}
        />

        {/* Modals */}
        <AssignEmployeesModal
          open={showAssignModal}
          onOpenChange={setShowAssignModal}
          availableEmployees={availableEmployees}
          onAssign={handleAssignEmployees}
          loading={actionLoading}
        />

        <EditTeamModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          team={team}
          onUpdate={handleUpdateTeam}
          onRemoveEmployee={handleRemoveEmployee}
          loading={actionLoading}
        />
      </div>
    </DashboardLayout>
  )
}