"use client"

import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Video, Calendar, Forward, Plus, Filter, Clock, Users } from "lucide-react"
import TLTaskStatsCards from "@/components/TL_Component/tasks-meetings/TLTaskStatsCards"
import TodaysAssignedTasks from "@/components/TL_Component/tasks-meetings/TodaysAssignedTasks"
import AssignedTasksTable from "@/components/TL_Component/tasks-meetings/AssignedTasksTable"
import AssignTaskModal from "@/components/TL_Component/tasks-meetings/AssignTaskModal"
import MeetingModal from "@/components/TL_Component/tasks-meetings/MeetingModal"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TLTM() {
    const [assignedTasks, setAssignedTasks] = useState([])
    const [meetings, setMeetings] = useState([])
    const [stats, setStats] = useState({})
    const [meetingStats, setMeetingStats] = useState({})
    const [loading, setLoading] = useState({
        assigned: true,
        meetings: true,
        stats: true
    })
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [meetingModalOpen, setMeetingModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [editingMeeting, setEditingMeeting] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const router = useRouter()

    const isLoading = loading.assigned || loading.meetings || loading.stats

    useEffect(() => {
        fetchAssignedTasks()
        fetchMeetings()
        fetchStats()
        fetchMeetingStats()
    }, [])

    useEffect(() => {
        if (meetingModalOpen === false) {
            setEditingMeeting(null)
        }
    }, [meetingModalOpen])

    const fetchAssignedTasks = async () => {
        try {
            setLoading(prev => ({ ...prev, assigned: true }))
            const response = await fetch(`${API_URL}/api/tl/tasks-meetings/assigned-tasks`, {
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
        } finally {
            setLoading(prev => ({ ...prev, assigned: false }))
        }
    }

    const fetchMeetings = async (date = selectedDate) => {
        try {
            setLoading(prev => ({ ...prev, meetings: true }))
            const response = await fetch(`${API_URL}/api/tl/meetings?date=${date}`, {
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
            const response = await fetch(`${API_URL}/api/tl/tasks-meetings/stats`, {
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
            const response = await fetch(`${API_URL}/api/tl/meetings/stats`, {
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

    const handleAssignTask = (task) => {
        setSelectedTask(task)
        setAssignModalOpen(true)
    }

    const handleTaskAssigned = (newTask) => {
        fetchStats()
    }

    const handleTaskDeleted = (taskId) => {
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

    if (isLoading) {
        return (
            <DashboardLayout title="Tasks & Meetings">
                <main className="p-4 space-y-4">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </main>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Tasks & Meetings">
            <main className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
                        <p className="text-muted-foreground">Manage daily task assignments and team coordination</p>
                    </div>
                    <Button onClick={() => setMeetingModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Meeting
                    </Button>
                </div>

                {/* Stats Cards */}
                <TLTaskStatsCards stats={stats} />

                {/* Middle row: TODAY'S ASSIGNED TASKS + MY TASKS FROM HR */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* TODAY'S ASSIGNED TASKS (Now on the left side - larger box) */}
                    <div className="lg:col-span-2">
                        <TodaysAssignedTasks onAssignTask={handleAssignTask} />
                    </div>

                    {/* MY TASKS FROM HR & MEETINGS (Now on the right side - smaller box) */}
                    <Card className="border-muted">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base">Schedule & Meetings</CardTitle>
                            <Button size="icon" variant="ghost" aria-label="More options" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Tabs defaultValue="meetings" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-9">
                                    <TabsTrigger value="meetings" className="text-xs">
                                        Meetings
                                        <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                                            {meetings.length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="tasks" className="text-xs">
                                        My Tasks
                                        <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                                            {assignedTasks.length}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="meetings" className="space-y-3 pt-3">
                                    {/* Date Filter */}
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="meeting-date" className="text-xs text-muted-foreground whitespace-nowrap">
                                            Date:
                                        </Label>
                                        <Input
                                            id="meeting-date"
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className="h-7 text-xs"
                                        />
                                        <Button variant="outline" size="sm" className="h-7 px-2">
                                            <Filter className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Meetings List */}
                                    {loading.meetings ? (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : meetings.length === 0 ? (
                                        <div className="text-center py-6 space-y-2">
                                            <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-2">No meetings scheduled</p>
                                                <Button
                                                    onClick={() => setMeetingModalOpen(true)}
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                >
                                                    Create First Meeting
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {meetings.map((meeting) => (
                                                <div key={meeting._id} className="rounded-lg border border-muted p-3 hover:shadow-sm transition-shadow">
                                                    {/* Header Section */}
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start gap-2 mb-1">
                                                                <h4 className="font-medium text-xs leading-tight line-clamp-2 flex-1">
                                                                    {meeting.title}
                                                                </h4>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`
                                                                        flex-shrink-0 text-[10px] px-1.5 py-0 h-5
                                                                        ${getStatusColor(meeting.status)}
                                                                    `}
                                                                >
                                                                    {meeting.status}
                                                                </Badge>
                                                            </div>

                                                            <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1">
                                                                {meeting.description}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-1 flex-shrink-0">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-1.5 text-[10px]"
                                                                onClick={() => handleEditMeeting(meeting)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            {meeting.meetingLink && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    className="h-6 px-1.5 text-[10px] bg-blue-600 hover:bg-blue-700"
                                                                >
                                                                    Join
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Details Section */}
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Video className="h-3 w-3" />
                                                                <span className="truncate max-w-[80px]">{meeting.platform}</span>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span className="text-foreground font-medium">
                                                                    {new Date(meeting.meetingDate).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
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

                                                    {/* Time */}
                                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-foreground font-medium">
                                                            {meeting.startTime} - {meeting.endTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="tasks" className="space-y-3 pt-3">
                                    {assignedTasks.length === 0 ? (
                                        <div className="text-center py-6 text-muted-foreground text-sm">
                                            No tasks assigned from HR yet
                                        </div>
                                    ) : (
                                        assignedTasks.slice(0, 3).map((task) => (
                                            <div key={task._id} className="border rounded-lg p-3 space-y-2">
                                                {/* Header with badges and button */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                                                        <Badge
                                                            variant={
                                                                task.priority === 'high' ? 'destructive' :
                                                                    task.priority === 'medium' ? 'secondary' : 'outline'
                                                            }
                                                            className="text-xs h-5"
                                                        >
                                                            {task.priority}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs h-5 ${task.status === 'pending' ? 'bg-gray-500 text-white' :
                                                                task.status === 'in-progress' ? 'bg-blue-500 text-white' :
                                                                    task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAssignTask(task)}
                                                        className="flex items-center gap-1 h-7 text-xs whitespace-nowrap flex-shrink-0"
                                                    >
                                                        <Forward className="h-3 w-3" />
                                                        Assign
                                                    </Button>
                                                </div>

                                                {/* Task Title and Description */}
                                                <div className="space-y-1" onClick={() => router.push(`/dashboard/teamleader/tasks-meetings/assigned-hr-task-detail/${task._id}`)}>
                                                    <h4 className="font-semibold text-sm leading-tight line-clamp-2" title={task.title}>
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed" title={task.description}>
                                                        {task.description}
                                                    </p>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span>Progress</span>
                                                        <span>{task.progress}%</span>
                                                    </div>
                                                    <Progress value={task.progress} className="h-1.5" />
                                                </div>

                                                {/* Footer Info */}
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1 truncate min-w-0">
                                                        <span className="truncate">From: {task.assignedBy?.name || "HR"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {assignedTasks.length > 3 && (
                                        <div className="text-center pt-2">
                                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                                View All {assignedTasks.length} Tasks
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Assigned Tasks History Table */}
                <AssignedTasksTable onTaskDeleted={handleTaskDeleted} />

                {/* Assign Task Modal */}
                <AssignTaskModal
                    open={assignModalOpen}
                    onOpenChange={setAssignModalOpen}
                    task={selectedTask}
                    onTaskAssigned={handleTaskAssigned}
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