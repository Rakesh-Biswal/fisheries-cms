"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HrTaskStatsCards from "@/components/HrComponent/tasks-meetings/HrTaskStatsCards"
import AssignedTasks from "@/components/HrComponent/tasks-meetings/AssignedTasks"
import ForwardedTasksTable from "@/components/HrComponent/tasks-meetings/ForwardedTasksTable"
import ForwardTaskModal from "@/components/HrComponent/tasks-meetings/ForwardTaskModal"
import MeetingSection from "@/components/Hromponent/tasks-meetings/MeetingSection"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HRTasksMeetings() {
  const [assignedTasks, setAssignedTasks] = useState([])
  const [forwardedTasks, setForwardedTasks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchAssignedTasks(),
        fetchForwardedTasks(),
        fetchStats()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignedTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/assigned-tasks`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAssignedTasks(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching assigned tasks:', error)
    }
  }

  const fetchForwardedTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/forwarded-tasks`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setForwardedTasks(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching forwarded tasks:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/stats`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.data || {})
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleForwardTask = (task) => {
    setSelectedTask(task)
    setForwardModalOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks & Meetings</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and schedule meetings across departments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Meeting
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <HrTaskStatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="xl:col-span-2 space-y-6">
            {/* Assigned Tasks */}
            <AssignedTasks
              tasks={assignedTasks}
              onForwardTask={handleForwardTask}
            />

            {/* Forwarded Tasks */}
            <ForwardedTasksTable
              tasks={forwardedTasks}
              onEditTask={() => {}}
              onTaskDeleted={() => {}}
            />
          </div>

          {/* Right Column - Meetings */}
          <div className="space-y-6">
            <MeetingSection />
          </div>
        </div>

        {/* Modals */}
        <ForwardTaskModal
          open={forwardModalOpen}
          onOpenChange={setForwardModalOpen}
          task={selectedTask}
          onTaskForwarded={() => {}}
        />
      </main>
    </DashboardLayout>
  )
}