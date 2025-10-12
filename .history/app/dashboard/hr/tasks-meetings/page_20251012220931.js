"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { MoreHorizontal, Video, Calendar, Plus, Filter, Clock, Users, CheckCircle } from "lucide-react"
import HrTaskStatsCards from "@/components/Hrcomponent/tasks-meetings/HrTaskStatsCards"
import AssignedTasks from "@/components/Hrcomponent/tasks-meetings/AssignedTasks"
import ForwardedTasksTable from "@/components/Hrcomponent/tasks-meetings/ForwardedTasksTable"
import ForwardTaskModal from "@/components/Hrcomponent/tasks-meetings/ForwardTaskModal"
import MeetingModal from "@/components/Hrcomponent/tasks-meetings/MeetingModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HRTM() {
  const [assignedTasks, setAssignedTasks] = useState([])
  const [forwardedTasks, setForwardedTasks] = useState([])
  const [meetings, setMeetings] = useState([])
  const [stats, setStats] = useState({})
  const [meetingStats, setMeetingStats] = useState({})
  const [loading, setLoading] = useState({
    assigned: true,
    forwarded: true,
    meetings: true,
    stats: true
  })
  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const router = useRouter()

  const isLoading = loading.assigned || loading.forwarded || loading.meetings || loading.stats

  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, assigned: true, forwarded: true, meetings: true, stats: true }))
      try {
        await Promise.all([
          fetchAssignedTasks(),
          fetchForwardedTasks(),
          fetchMeetings(),
          fetchStats(),
          fetchMeetingStats()
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(prev => ({ ...prev, assigned: false, forwarded: false, meetings: false, stats: false }))
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (meetingModalOpen === false) {
      setEditingMeeting(null)
    }
  }, [meetingModalOpen])

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

  const fetchMeetings = async (date = selectedDate) => {
    try {
      setLoading(prev => ({ ...prev, meetings: true }))
      const response = await fetch(`${API_URL}/api/hr/meetings?date=${date}`, {
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

  const fetchMeetingStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings/stats`, {
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
    fetchStats()
  }

  const handleTaskUpdated = (updatedTask) => {
    setForwardedTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ))
    fetchStats()
    setEditModalOpen(false)
    setEditingTask(null)
  }

  const handleTaskDeleted = (taskId) => {
    setForwardedTasks(prev => prev.filter(task => task._id !== taskId))
    fetchStats()
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

  const getDepartmentBadge = (department) => {
    const variants = {
      ceo: "default",
      hr: "secondary",
      'team-leader': "outline",
      'project-manager': "outline",
      'sales-employee': "outline",
      telecaller: "outline",
      accountant: "outline"
    }
    return <Badge variant={variants[department]}>{department}</Badge>
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
            <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
            <p className="text-muted-foreground">Manage assigned tasks, meetings, and forward work to team leaders</p>
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

          {/* Schedule & Meetings */}
          <Card className="border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Schedule & Meetings</CardTitle>
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
                      <Plus className="h-4 w-4 mr-1" />
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
                          Create Meeting
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
                    {assignedTasks
                      .filter(task => task.status !== 'completed')
                      .slice(0, 3)
                      .map(task => (
                        <div key={task._id} className="rounded-lg border border-muted p-3" onClick={() => router.push(`/dashboard/hr/tasks-meetings/assigned-ceo-task-detail/${task._id}`)}>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                            <Badge 
                              variant="outline" 
                              className="text-xs capitalize"
                              style={{
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                                borderColor: statusColors.border
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
                      )
                    },
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
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Pending Tasks</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {assignedTasks.filter(task => task.status !== 'completed').length}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Completed Today</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {assignedTasks.filter(task => 
                    task.status === 'completed' && 
                    new Date(task.updatedAt).toDateString() === new Date().toDateString()
                  ).length}
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

        {/* Meeting Modal */}
        <MeetingModal
          open={meetingModalOpen}
          onOpenChange={setMeetingModalOpen}
          meeting={editingMeeting}
          onMeetingCreated={handleMeetingCreated}
          onMeetingUpdated={handleMeetingUpdated}
        />
      </main>
    </DashboardLayout>
  )
}