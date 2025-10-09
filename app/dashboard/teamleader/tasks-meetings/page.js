"use client"

import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Video, Calendar, Forward } from "lucide-react"
import TLTaskStatsCards from "@/components/TL_Component/TLTaskStatsCards"
import TodaysAssignedTasks from "@/components/TL_Component/TodaysAssignedTasks"
import AssignedTasksTable from "@/components/TL_Component/AssignedTasksTable"
import AssignTaskModal from "@/components/TL_Component/AssignTaskModal"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Sample meetings data
const meetings = [
    {
        title: "Daily Sales Sync",
        status: "Starting Soon",
        platform: "Zoom Meeting",
        time: "09:00 AM — 09:30 AM",
        members: [
            { name: "SE1", fallback: "SE1" },
            { name: "SE2", fallback: "SE2" },
        ],
    },
    {
        title: "Weekly Review",
        status: "Scheduled",
        platform: "Google Meeting",
        time: "03:00 PM — 04:00 PM",
        members: [
            { name: "HR", fallback: "HR" },
        ],
    },
]

export default function TLTM() {
    const [assignedTasks, setAssignedTasks] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const router= useRouter()

    useEffect(() => {
        fetchAssignedTasks()
        fetchStats()
    }, [])

    const fetchAssignedTasks = async () => {
        try {
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
            setLoading(false)
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

    const handleAssignTask = (task) => {
        setSelectedTask(task)
        setAssignModalOpen(true)
    }

    const handleTaskAssigned = (newTask) => {
        fetchStats() // Refresh stats
        // You might want to refresh the assigned tasks list as well
    }

    const handleTaskDeleted = (taskId) => {
        fetchStats() // Refresh stats
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
        <DashboardLayout title="Tasks & Meetings">
            <main className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Tasks & Meetings</h1>
                        <p className="text-muted-foreground">Manage daily task assignments and team coordination</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <TLTaskStatsCards stats={stats} />

                {/* Middle row: TODAY'S ASSIGNED TASKS + MY TASKS FROM HR (INTERCHANGED) */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* TODAY'S ASSIGNED TASKS (Now on the left side - larger box) */}
                    <div className="lg:col-span-2">
                        <TodaysAssignedTasks onAssignTask={handleAssignTask} />
                    </div>

                    {/* MY TASKS FROM HR (Now on the right side - smaller box) */}
                    <Card className="border-muted">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base">My Tasks from HR</CardTitle>
                            <Button size="icon" variant="ghost" aria-label="More options" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Tabs defaultValue="tasks" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-9">
                                    <TabsTrigger value="tasks" className="text-xs">
                                        Tasks
                                        <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                                            {assignedTasks.length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="meetings" className="text-xs">
                                        Meetings
                                        <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                                            {meetings.length}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

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
                                                            className={`text-xs h-5 ${
                                                                task.status === 'pending' ? 'bg-gray-500 text-white' :
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
                                                <div className="space-y-1"  onClick={() => router.push(`/dashboard/teamleader/tasks-meetings/assigned-hr-task-detail/${task._id}`)}>
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

                                <TabsContent value="meetings" className="pt-3">
                                    <div className="space-y-3">
                                        {meetings.map((m) => (
                                            <div key={m.title} className="rounded-lg border border-muted p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium text-sm truncate" title={m.title}>
                                                                {m.title}
                                                            </h4>
                                                            <Badge variant="outline" className="text-xs h-5 whitespace-nowrap">
                                                                {m.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Video className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">{m.platform}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs flex-shrink-0">
                                                        Join
                                                    </Button>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-3 w-3 flex-shrink-0" />
                                                        <span className="text-foreground truncate">{m.time}</span>
                                                    </div>
                                                    <div className="flex -space-x-1.5">
                                                        {m.members.map((mem) => (
                                                            <Avatar key={mem.fallback} className="h-6 w-6 ring-1 ring-background">
                                                                <AvatarImage src="/placeholder.svg" alt={mem.name} />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {mem.fallback}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
            </main>
        </DashboardLayout>
    )
}