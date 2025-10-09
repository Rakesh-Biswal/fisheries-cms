"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Video, Link2, Calendar } from "lucide-react"
import TaskStatsCards from "./TaskStatsCards"
import RecentTasks from "./RecentTasks"
import TaskListTable from "./TaskListTable"
import TaskCreateModal from "./TaskCreateModal"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Sample meetings data
const meetings = [
  {
    title: "Sprint Planning",
    status: "Starting Soon",
    platform: "Zoom Meeting",
    time: "10:00 AM — 11:00 AM",
    members: [
      { name: "AL", fallback: "AL" },
      { name: "JB", fallback: "JB" },
    ],
  },
  {
    title: "Design Handoff",
    status: "Scheduled",
    platform: "Google Meeting",
    time: "01:00 PM — 02:00 PM",
    members: [
      { name: "TS", fallback: "TS" },
      { name: "RK", fallback: "RK" },
    ],
  },
]

export default function TM() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ceo/tasks-meetings/tasks`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.data || [])
      } else {
        throw new Error('Failed to fetch tasks')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ceo/tasks-meetings/tasks/stats`, {
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

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    fetchStats() // Refresh stats
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchStats() // Refresh stats
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId))
    fetchStats() // Refresh stats
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
          <p className="text-muted-foreground">Manage task & meetings Effectively</p>
        </div>
      </div>

      {/* Stats Cards */}
      <TaskStatsCards stats={stats} />

      {/* Middle row: Recent Tasks + Schedule */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Tasks */}
        <RecentTasks 
          tasks={tasks} 
          onCreateTask={() => setShowCreateModal(true)}
          onEditTask={handleEditTask}
          onTaskDeleted={handleTaskDeleted}
        />

        {/* Schedule */}
        <Card className="border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Schedule</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Calendar</DropdownMenuItem>
                <DropdownMenuItem>New Meeting</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  Task
                  <Badge variant="secondary" className="ml-2">
                    {tasks.filter(t => t.status !== 'completed').length}
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
                        View Detail
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Meeting time</span>
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
                  {tasks
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
                  {tasks.filter(task => task.status !== 'completed').length === 0 && (
                    <div className="rounded-lg border border-muted p-6 text-sm text-muted-foreground text-center">
                      No task reminders for today.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* List Task Table */}
      <TaskListTable 
        tasks={tasks} 
        onEditTask={handleEditTask}
        onTaskDeleted={handleTaskDeleted}
      />

      {/* Create/Edit Task Modal */}
      <TaskCreateModal
        open={showCreateModal}
        onOpenChange={handleCloseModal}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        editingTask={editingTask}
      />
    </main>
  )
}