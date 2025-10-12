"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { MoreHorizontal, Video, Calendar } from "lucide-react"
import HrTaskStatsCards from "@/components/HrComponent/tasks-meetings/HrTaskStatsCards"
import AssignedTasks from "@/components/HrComponent/tasks-meetings/AssignedTasks"
import ForwardedTasksTable from "@/components/HrComponent/tasks-meetings/ForwardedTasksTable"
import ForwardTaskModal from "@/components/HrComponent/tasks-meetings/ForwardTaskModal"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Sample meetings data
const meetings = [
  {
    title: "Team Sync",
    status: "Starting Soon",
    platform: "Zoom Meeting",
    time: "10:00 AM — 11:00 AM",
    members: [
      { name: "TL1", fallback: "TL1" },
      { name: "TL2", fallback: "TL2" },
    ],
  },
  {
    title: "Progress Review",
    status: "Scheduled",
    platform: "Google Meeting",
    time: "02:00 PM — 03:00 PM",
    members: [
      { name: "CEO", fallback: "CEO" },
    ],
  },
]

export default function HRTM() {
  const [assignedTasks, setAssignedTasks] = useState([])
  const [forwardedTasks, setForwardedTasks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchAssignedTasks()
    fetchForwardedTasks()
    fetchStats()
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
    } finally {
      setLoading(false)
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
            <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
            <p className="text-muted-foreground">Manage assigned tasks and forward work to team leaders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <HrTaskStatsCards stats={stats} />

        {/* Middle row: Assigned Tasks + Schedule */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Assigned Tasks from CEO */}
          <div className="lg:col-span-2">
            <AssignedTasks 
              tasks={assignedTasks} 
              onForwardTask={handleForwardTask}
            />
          </div>

          {/* Schedule */}
          <Card className="border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Schedule</CardTitle>
              <Button size="icon" variant="ghost" aria-label="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="meetings">
                    Meetings
                    <Badge variant="secondary" className="ml-2">
                      {meetings.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    My Tasks
                    <Badge variant="secondary" className="ml-2">
                      {assignedTasks.filter(t => t.status !== 'completed').length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="meetings" className="space-y-4 pt-4">
                  {meetings.map((m) => (
                    <div key={m.title} className="rounded-lg border border-muted p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{m.title}</h4>
                            <Badge variant="outline">{m.status}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Video className="h-4 w-4" aria-hidden="true" />
                            <span>{m.platform}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="px-2">
                          Join
                        </Button>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          <span className="text-foreground">{m.time}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {m.members.map((mem) => (
                            <Avatar key={mem.fallback} className="h-7 w-7 ring-2 ring-background">
                              <AvatarImage src="/placeholder.svg" alt={mem.name} />
                              <AvatarFallback>{mem.fallback}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="tasks" className="pt-4">
                  <div className="space-y-3">
                    {assignedTasks
                      .filter(task => task.status !== 'completed')
                      .slice(0, 3)
                      .map(task => (
                        <div key={task._id} className="rounded-lg border border-muted p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                            <span>{task.progress}%</span>
                          </div>
                        </div>
                      ))}
                    {assignedTasks.filter(task => task.status !== 'completed').length === 0 && (
                      <div className="rounded-lg border border-muted p-6 text-sm text-muted-foreground text-center">
                        No pending tasks for today.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Forwarded Tasks Table */}
        <ForwardedTasksTable 
          tasks={forwardedTasks}
          onEditTask={handleEditForwardedTask}
          onTaskDeleted={handleTaskDeleted}
        />

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