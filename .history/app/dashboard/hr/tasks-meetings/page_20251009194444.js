"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { MoreHorizontal, Video, Calendar, Plus, ChevronDown, ChevronUp, Clock, Users } from "lucide-react"
import HrTaskStatsCards from "@/components/HrComponent/tasks-meetings/HrTaskStatsCards"
import AssignedTasks from "@/components/HrComponent/tasks-meetings/AssignedTasks"
import ForwardedTasksTable from "@/components/HrComponent/tasks-meetings/ForwardedTasksTable"
import ForwardTaskModal from "@/components/HrComponent/tasks-meetings/ForwardTaskModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format, isToday, isTomorrow, parseISO, isAfter, isBefore, startOfDay } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Departments for meeting creation
const DEPARTMENTS = [
  { id: "telecaller", name: "Telecaller", color: "bg-blue-500" },
  { id: "accountant", name: "Accountant", color: "bg-green-500" },
  { id: "teamleader", name: "Team Leader", color: "bg-purple-500" },
  { id: "projectmanager", name: "Project Manager", color: "bg-orange-500" },
]

export default function HRTM() {
  const [assignedTasks, setAssignedTasks] = useState([])
  const [forwardedTasks, setForwardedTasks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState({
    assigned: true,
    forwarded: true,
    stats: true,
    meetings: true
  });
  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [meetings, setMeetings] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFutureMeetings, setShowFutureMeetings] = useState(false)
  const [createMeetingModalOpen, setCreateMeetingModalOpen] = useState(false)
  const router = useRouter()

  const isLoading = loading.assigned || loading.forwarded || loading.stats || loading.meetings;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, meetings: true }))
      try {
        await Promise.all([
          fetchAssignedTasks(),
          fetchForwardedTasks(),
          fetchStats(),
          fetchMeetings()
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(prev => ({ ...prev, meetings: false }))
      }
    }
    fetchData()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings`, {
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
    }
  }

  const fetchAssignedTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, assigned: true }));
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
    finally {
      setLoading(prev => ({ ...prev, assigned: false }));
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
      setLoading(prev => ({ ...prev, forwarded: false }));
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
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
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

  // Filter meetings for selected date
  const getMeetingsForSelectedDate = () => {
    return meetings.filter(meeting => {
      const meetingDate = startOfDay(parseISO(meeting.date))
      const selected = startOfDay(selectedDate)
      return meetingDate.getTime() === selected.getTime()
    })
  }

  // Get current meetings (happening now)
  const getCurrentMeetings = () => {
    const now = new Date()
    return meetings.filter(meeting => {
      const meetingDate = parseISO(meeting.date)
      const startTime = parseISO(meeting.startTime)
      const endTime = parseISO(meeting.endTime)
      
      const meetingDateTime = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      )
      
      const meetingEndDateTime = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      )
      
      return now >= meetingDateTime && now <= meetingEndDateTime
    })
  }

  // Get future meetings (after today)
  const getFutureMeetings = () => {
    const today = startOfDay(new Date())
    return meetings.filter(meeting => {
      const meetingDate = startOfDay(parseISO(meeting.date))
      return isAfter(meetingDate, today)
    }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
  }

  // Get meeting status
  const getMeetingStatus = (meeting) => {
    const now = new Date()
    const meetingDate = parseISO(meeting.date)
    const startTime = parseISO(meeting.startTime)
    const endTime = parseISO(meeting.endTime)
    
    const meetingDateTime = new Date(
      meetingDate.getFullYear(),
      meetingDate.getMonth(),
      meetingDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    )
    
    const meetingEndDateTime = new Date(
      meetingDate.getFullYear(),
      meetingDate.getMonth(),
      meetingDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    )
    
    if (now >= meetingDateTime && now <= meetingEndDateTime) {
      return { status: "Live Now", variant: "destructive" }
    } else if (now < meetingDateTime && isToday(meetingDate)) {
      return { status: "Starting Soon", variant: "default" }
    } else if (isToday(meetingDate)) {
      return { status: "Today", variant: "secondary" }
    } else if (isTomorrow(meetingDate)) {
      return { status: "Tomorrow", variant: "outline" }
    } else {
      return { status: format(meetingDate, "MMM d"), variant: "outline" }
    }
  }

  const handleCreateMeeting = async (meetingData) => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(meetingData)
      })

      if (response.ok) {
        const newMeeting = await response.json()
        setMeetings(prev => [newMeeting.data, ...prev])
        toast.success('Meeting created successfully')
        setCreateMeetingModalOpen(false)
      } else {
        throw new Error('Failed to create meeting')
      }
    } catch (error) {
      console.error('Error creating meeting:', error)
      toast.error('Failed to create meeting')
    }
  }

  if (loading.meetings) {
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

  const currentMeetings = getCurrentMeetings()
  const selectedDateMeetings = getMeetingsForSelectedDate()
  const futureMeetings = getFutureMeetings()

  return (
    <DashboardLayout>
      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
            <p className="text-muted-foreground">Manage assigned tasks and forward work to team leaders</p>
          </div>
          <Button onClick={() => setCreateMeetingModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Meeting
          </Button>
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
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setSelectedDate(new Date())}
                  className={isToday(selectedDate) ? "bg-muted" : ""}
                >
                  Today
                </Button>
                <Button size="icon" variant="ghost" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="meetings">
                    Meetings
                    <Badge variant="secondary" className="ml-2">
                      {selectedDateMeetings.length}
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
                  {/* Date Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                      className="text-sm border rounded px-2 py-1"
                    />
                  </div>

                  {/* Current Meetings */}
                  {currentMeetings.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">Live Now</span>
                      </div>
                      {currentMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting._id} 
                          meeting={meeting} 
                          statusInfo={getMeetingStatus(meeting)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Selected Date Meetings */}
                  <div className="space-y-3">
                    {selectedDateMeetings
                      .filter(meeting => !getMeetingStatus(meeting).status.includes("Live"))
                      .map(meeting => (
                        <MeetingCard 
                          key={meeting._id} 
                          meeting={meeting} 
                          statusInfo={getMeetingStatus(meeting)}
                        />
                      ))}
                    
                    {selectedDateMeetings.length === 0 && (
                      <div className="rounded-lg border border-muted p-6 text-sm text-muted-foreground text-center">
                        No meetings scheduled for {format(selectedDate, "MMMM d")}.
                      </div>
                    )}
                  </div>

                  {/* Future Meetings Section */}
                  {futureMeetings.length > 0 && (
                    <div className="mt-6">
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => setShowFutureMeetings(!showFutureMeetings)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Upcoming Meetings ({futureMeetings.length})</span>
                        </div>
                        {showFutureMeetings ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {showFutureMeetings && (
                        <div className="mt-3 space-y-3">
                          {futureMeetings.map(meeting => (
                            <MeetingCard 
                              key={meeting._id} 
                              meeting={meeting} 
                              statusInfo={getMeetingStatus(meeting)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="pt-4">
                  <div className="space-y-3">
                    {assignedTasks
                      .filter(task => task.status !== 'completed')
                      .slice(0, 3)
                      .map(task => (
                        <div key={task._id} className="rounded-lg border border-muted p-3" onClick={()=>router.push(`/dashboard/hr/tasks-meetings/assigned-ceo-task-detail/${task._id}`)}>
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

        {/* Modals */}
        <ForwardTaskModal
          open={forwardModalOpen}
          onOpenChange={setForwardModalOpen}
          task={selectedTask}
          onTaskForwarded={handleTaskForwarded}
        />

        <ForwardTaskModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          task={editingTask}
          onTaskForwarded={handleTaskUpdated}
          isEditMode={true}
        />

        {/* Create Meeting Modal */}
        <CreateMeetingModal
          open={createMeetingModalOpen}
          onOpenChange={setCreateMeetingModalOpen}
          onCreateMeeting={handleCreateMeeting}
          departments={DEPARTMENTS}
        />
      </main>
    </DashboardLayout>
  )
}

// Meeting Card Component
function MeetingCard({ meeting, statusInfo }) {
  const formatTime = (dateString, timeString) => {
    const time = parseISO(timeString)
    return format(time, "h:mm a")
  }

  return (
    <div className="rounded-lg border border-muted p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{meeting.title}</h4>
            <Badge variant={statusInfo.variant}>{statusInfo.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="h-4 w-4" aria-hidden="true" />
            <span>{meeting.platform}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>With: {meeting.departments.map(dept => dept.name).join(", ")}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="px-2">
          Join
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span className="text-foreground">
            {formatTime(meeting.date, meeting.startTime)} — {formatTime(meeting.date, meeting.endTime)}
          </span>
        </div>
        <div className="flex -space-x-2">
          {meeting.departments.slice(0, 3).map((dept) => (
            <div 
              key={dept.id}
              className={`h-7 w-7 rounded-full ${dept.color} ring-2 ring-background flex items-center justify-center text-xs text-white font-medium`}
              title={dept.name}
            >
              {dept.name.charAt(0)}
            </div>
          ))}
          {meeting.departments.length > 3 && (
            <div className="h-7 w-7 rounded-full bg-gray-200 ring-2 ring-background flex items-center justify-center text-xs text-gray-600 font-medium">
              +{meeting.departments.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Create Meeting Modal Component
function CreateMeetingModal({ open, onOpenChange, onCreateMeeting, departments }) {
  const [formData, setFormData] = useState({
    title: "",
    platform: "Zoom Meeting",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00",
    selectedDepartments: [],
    description: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateMeeting(formData)
    setFormData({
      title: "",
      platform: "Zoom Meeting",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      endTime: "11:00",
      selectedDepartments: [],
      description: ""
    })
  }

  const toggleDepartment = (deptId) => {
    setFormData(prev => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(deptId)
        ? prev.selectedDepartments.filter(id => id !== deptId)
        : [...prev.selectedDepartments, deptId]
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Create New Meeting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Meeting Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Enter meeting title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="Zoom Meeting">Zoom Meeting</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Slack Huddle">Slack Huddle</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Departments</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => toggleDepartment(dept.id)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    formData.selectedDepartments.includes(dept.id)
                      ? `${dept.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm h-20"
              placeholder="Meeting description..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Meeting
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}