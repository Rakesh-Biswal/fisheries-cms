"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { MoreHorizontal, Video, Calendar, Plus } from "lucide-react"
import HrTaskStatsCards from "@/components/HrComponent/tasks-meetings/HrTaskStatsCards"
import AssignedTasks from "@/components/HrComponent/tasks-meetings/AssignedTasks"
import ForwardedTasksTable from "@/components/HrComponent/tasks-meetings/ForwardedTasksTable"
import ForwardTaskModal from "@/components/HrComponent/tasks-meetings/ForwardTaskModal"
import MeetingSection from "@/components/HrComponent/tasks-meetings/MeetingSection"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HRTM() {
  const [assignedTasks, setAssignedTasks] = useState([])
  const [forwardedTasks, setForwardedTasks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState({
    assigned: true,
    forwarded: true,
    stats: true
  })
  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const router = useRouter()

  const isLoading = loading.assigned || loading.forwarded || loading.stats

  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        assigned: true,
        forwarded: true,
        stats: true
      })
      try {
        await Promise.all([
          fetchAssignedTasks(),
          fetchForwardedTasks(),
          fetchStats()
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading({
          assigned: false,
          forwarded: false,
          stats: false
        })
      }
    }
    fetchData()
  }, [])

  const fetchAssignedTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/assigned-tasks`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAssignedTasks(data.data || [])
      } else {
        throw new Error('Failed to fetch assigned tasks')
      }
    } catch (error) {
      console.error('Error fetching assigned tasks:', error)
      toast.error('Failed to load assigned tasks')
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
      } else {
        throw new Error('Failed to fetch forwarded tasks')
      }
    } catch (error) {
      console.error('Error fetching forwarded tasks:', error)
      toast.error('Failed to load forwarded tasks')
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

  const handleEditForwardedTask = (task) => {
    setEditingTask(task)
    setEditModalOpen(true)
  }

  const handleTaskForwarded = (newTask) => {
    setForwardedTasks(prev => [newTask, ...prev])
    fetchStats() // Refresh stats
  }

  const handleTaskUpdated = (updatedTask) => {
    setForwardedTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchStats() // Refresh stats
    setEditModalOpen(false)
    setEditingTask(null)
  }

  const handleTaskDeleted = (taskId) => {
    setForwardedTasks(prev => prev.filter(task => task._id !== taskId))
    fetchStats() // Refresh stats
  }

  if (isLoading) {
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
            <p className="text-gray-600 mt-1">Manage assigned tasks and schedule meetings across departments</p>
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
              onEditTask={handleEditForwardedTask}
              onTaskDeleted={handleTaskDeleted}
            />
          </div>

          {/* Right Column - Meetings & Quick Tasks */}
          <div className="space-y-6">
            {/* Professional Meeting Section */}
            <MeetingSection />

            {/* Quick Tasks Section (Your original tasks tab content) */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Quick Tasks</CardTitle>
                <Button size="icon" variant="ghost" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedTasks
                    .filter(task => task.status !== 'completed')
                    .slice(0, 4)
                    .map(task => (
                      <div 
                        key={task._id} 
                        className="rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                        onClick={() => router.push(`/dashboard/hr/tasks-meetings/assigned-ceo-task-detail/${task._id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs capitalize"
                            style={{
                              backgroundColor: 
                                task.status === 'pending' ? '#fef3c7' :
                                task.status === 'in-progress' ? '#dbeafe' :
                                task.status === 'completed' ? '#d1fae5' : '#f3f4f6',
                              color:
                                task.status === 'pending' ? '#92400e' :
                                task.status === 'in-progress' : '#1e40af' :
                                task.status === 'completed' ? '#065f46' : '#374151',
                              borderColor:
                                task.status === 'pending' ? '#f59e0b' :
                                task.status === 'in-progress' : '#3b82f6' :
                                task.status === 'completed' ? '#10b981' : '#9ca3af'
                            }}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-gray-500">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-700 font-medium">{task.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {assignedTasks.filter(task => task.status !== 'completed').length === 0 && (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-600">No pending tasks</p>
                      <p className="text-sm mt-1 text-gray-500">You're all caught up for today</p>
                    </div>
                  )}
                </div>

                {/* View All Tasks Button */}
                {assignedTasks.filter(task => task.status !== 'completed').length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      onClick={() => {/* Navigate to tasks page or expand view */}}
                    >
                      View All Tasks
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Today's Meetings</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {assignedTasks.filter(task => 
                    new Date(task.deadline).toDateString() === new Date().toDateString() && 
                    task.status !== 'completed'
                  ).length}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Pending Tasks</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {assignedTasks.filter(task => task.status !== 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forward Task Modal */}
        <ForwardTaskModal
          open={forwardModalOpen}
          onOpenChange={setForwardModalOpen}
          task={selectedTask}
          onTaskForwarded={handleTaskForwarded}
        />

        {/* Edit Forwarded Task Modal */}
        <ForwardTaskModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          task={editingTask}
          onTaskForwarded={handleTaskUpdated}
          isEditMode={true}
        />
      </main>
    </DashboardLayout>
  )
}