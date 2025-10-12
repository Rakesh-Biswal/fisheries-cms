"use client"

import DashboardLayout from "@/components/CeoComponent/dashboard-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Video, Calendar, Plus, Filter, Clock, Users } from "lucide-react"
import TaskStatsCards from "@/components/CeoComponent/tasks-meetings/TaskStatsCards"
import RecentTasks from "@/components/CeoComponent/tasks-meetings/RecentTasks"
import TaskListTable from "@/components/CeoComponent/tasks-meetings/TaskListTable"
import TaskCreateModal from "@/components/CeoComponent/tasks-meetings/TaskCreateModal"
import MeetingModal from "@/components/CeoComponent/tasks-meetings/MeetingModal"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TM() {
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])
  const [stats, setStats] = useState({})
  const [meetingStats, setMeetingStats] = useState({})
  const [loading, setLoading] = useState({
    tasks: true,
    meetings: true,
    stats: true
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchTasks()
    fetchMeetings()
    fetchStats()
    fetchMeetingStats()
  }, [])

  useEffect(() => {
    if (meetingModalOpen === false) {
      setEditingMeeting(null)
    }
  }, [meetingModalOpen])

  const fetchTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }))
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
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchMeetings = async (date = selectedDate) => {
    try {
      setLoading(prev => ({ ...prev, meetings: true }))
      const response = await fetch(`${API_URL}/api/ceo/meetings?date=${date}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setMeetings(data.data || [])
      } else {
        throw new Error('Failed to fetch meetings')
      }
    } catch (error) {
      console.error('Error fetching meetings:', error)
      toast.error('Failed to load meetings')
    } finally {
      setLoading(prev => ({ ...prev, meetings: false }))
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

  const fetchMeetingStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ceo/meetings/stats`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setMeetingStats(data.data || {})
      }
    } catch (error) {
      console.error('Error fetching meeting stats:', error)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    fetchStats()
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task =>
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchStats()
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId))
    fetchStats()
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingTask(null)
  }

  const handleMeetingCreated = (newMeeting) => {
    setMeetings(prev => [newMeeting, ...prev])
    fetchMeetingStats()
  }

  const handleMeetingUpdated = (updatedMeeting) => {
    setMeetings(prev => prev.map(meeting =>
      meeting._id === updatedMeeting._id ? updatedMeeting : meeting
    ))
    fetchMeetingStats()
  }

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting)
    setMeetingModalOpen(true)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    fetchMeetings(date)
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-500",
      ongoing: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500"
    }
    return colors[status] || "bg-gray-500"
  }

  if (loading.tasks || loading.meetings) {
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
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6">
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

            {/* Schedule & Meetings */}
            <Card className="border-muted">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Schedule & Meetings</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="More options"
                  onClick={() => setMeetingModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
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
                      Task
                      <Badge variant="secondary" className="ml-2">
                        {tasks.filter(t => t.status !== 'completed').length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="meetings" className="space-y-4 pt-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                      <Input
                        id="meeting-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Button onClick={() => setMeetingModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </div>

                    {/* Meetings List */}
                    {loading.meetings ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : meetings.length === 0 ? (
                      <div className="text-center py-8 space-y-3">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground mb-2">No meetings scheduled</p>
                          <Button onClick={() => setMeetingModalOpen(true)} size="sm">
                            Create Your First Meeting
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {meetings.map((meeting) => (
                          <div key={meeting._id} className="rounded-lg border border-muted p-4 hover:shadow-sm transition-shadow">
                            {/* Header Section */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                  <h4 className="font-medium text-sm leading-tight line-clamp-2 flex-1">
                                    {meeting.title}
                                  </h4>
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {meeting.description}
                                </p>
                              </div>

                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleEditMeeting(meeting)}
                                >
                                  Edit
                                </Button>
                                {meeting.meetingLink && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                                  >
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">

                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span className="text-foreground font-medium">
                                    {new Date(meeting.meetingDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span className="text-foreground font-medium">
                                    {meeting.startTime} - {meeting.endTime}
                                  </span>
                                </div>
                              </div>

                              {/* Participants */}
                              <div className="flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                <div className="flex flex-wrap gap-1 ">
                                  {meeting.participants.map((participant, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 h-5"
                                    >
                                      {participant.department.split('-').map(word =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ')}
                                    </Badge>
                                  ))}
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

          {/* Meeting Modal */}
          <MeetingModal
            open={meetingModalOpen}
            onOpenChange={setMeetingModalOpen}
            meeting={editingMeeting}
            onMeetingCreated={handleMeetingCreated}
            onMeetingUpdated={handleMeetingUpdated}
          />
        </main>
      </div>
    </DashboardLayout>
  )
}