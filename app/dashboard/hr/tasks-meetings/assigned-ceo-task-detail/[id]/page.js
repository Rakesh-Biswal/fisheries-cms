"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, User, FileText, Target, MessageSquare, Clock, CheckCircle, AlertCircle, Crown } from "lucide-react"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HrAssignedTaskDetail() {
    const params = useParams()
    const router = useRouter()
    const taskId = params.id

    const [task, setTask] = useState(null)
    const [forwardedTasks, setForwardedTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState("3days")
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    })
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0
    })

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails()
            fetchForwardedTasks()
        }
    }, [taskId, selectedPeriod, pagination.page])

    const fetchTaskDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/hr/tasks-meetings/assigned-tasks/${taskId}`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setTask(data.data)
            } else {
                throw new Error('Failed to fetch task details')
            }
        } catch (error) {
            console.error('Error fetching task details:', error)
            toast.error('Failed to load task details')
        }
    }

    const fetchForwardedTasks = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/hr/tasks-meetings/forwarded-tasks/${taskId}?period=${selectedPeriod}&page=${pagination.page}&limit=5`,
                {
                    credentials: 'include'
                }
            )

            if (response.ok) {
                const data = await response.json()
                setForwardedTasks(data.data || [])
                setStats(data.stats || { total: 0, completed: 0, inProgress: 0 })
                setPagination({
                    page: data.currentPage,
                    totalPages: data.totalPages,
                    total: data.total
                })
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

    const handleStatusUpdate = async (newStatus) => {
        if (!task) return

        setUpdatingStatus(true)
        try {
            const progress = newStatus === 'completed' ? 100 :
                newStatus === 'in-progress' ? 50 :
                    task.progress

            const response = await fetch(`${API_URL}/api/hr/tasks-meetings/assigned-tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus,
                    progress
                })
            })

            if (response.ok) {
                const data = await response.json()
                setTask(data.data)
                toast.success('Task status updated successfully')
            } else {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update task status')
            }
        } catch (error) {
            console.error('Error updating task status:', error)
            toast.error(error.message || 'Failed to update task status')
        } finally {
            setUpdatingStatus(false)
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'low': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4" />
            case 'in-progress': return <Clock className="h-4 w-4" />
            case 'overdue': return <AlertCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
                        <p className="text-gray-600 mb-6">The requested task could not be found.</p>
                        <Button onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Details</h1>
                                <p className="text-gray-600 mt-1">Assigned task from CEO with complete information</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Task Details - Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Task Overview Card */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                {task.title}
                                                <Badge className={getPriorityColor(task.priority)}>
                                                    {task.priority} Priority
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {task.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(task.status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(task.status)}
                                                    {task.status}
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Progress Section */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Overall Progress</span>
                                            <span>{task.progress}%</span>
                                        </div>
                                        <Progress value={task.progress} className="h-2" />
                                    </div>

                                    {/* Task Highlights */}
                                    {task.highlights && task.highlights.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Key Highlights</h4>
                                            <ul className="space-y-1">
                                                {task.highlights.map((highlight, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                        <span className="text-gray-700">{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Status Update Section */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Update Task Status</h4>
                                                <p className="text-xs text-gray-500">Update the progress of this CEO-assigned task</p>
                                            </div>
                                            <Select
                                                value={task.status}
                                                onValueChange={handleStatusUpdate}
                                                disabled={updatingStatus}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            Pending
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="in-progress">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            In Progress
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4" />
                                                            Completed
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="overdue">
                                                        <div className="flex items-center gap-2">
                                                            <AlertCircle className="h-4 w-4" />
                                                            Overdue
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline and Additional Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Timeline & Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Created:</span>
                                                <span>{format(new Date(task.createdAt), 'PPp')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Deadline:</span>
                                                <span className={new Date(task.deadline) < new Date() ? 'text-red-600 font-medium' : ''}>
                                                    {format(new Date(task.deadline), 'PPp')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Crown className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Assigned By:</span>
                                                <span>CEO</span>
                                            </div>
                                            {task.completedAt && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">Completed:</span>
                                                    <span>{format(new Date(task.completedAt), 'PPp')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Task Origin Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Crown className="h-5 w-5" />
                                        Assigned By CEO
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 bg-purple-100">
                                            <AvatarFallback className="text-purple-600">
                                                <Crown className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">CEO Office</p>
                                            <p className="text-sm text-gray-500">Chief Executive Officer</p>
                                            <p className="text-xs text-gray-400">Highest Priority Task</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Target className="h-5 w-5" />
                                        Forwarded Work Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Total Forwarded:</span>
                                        <Badge variant="secondary">{stats.total}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Completed:</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            {stats.completed}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">In Progress:</span>
                                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                                            {stats.inProgress}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Forwarded Tasks Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="h-5 w-5" />
                                    Forwarded Work to Team Leaders
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3days">Past 3 Days</SelectItem>
                                            <SelectItem value="7days">Past 7 Days</SelectItem>
                                            <SelectItem value="15days">Past 15 Days</SelectItem>
                                            <SelectItem value="1month">Past Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="list" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="list">Task List</TabsTrigger>
                                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                                </TabsList>

                                <TabsContent value="list" className="space-y-4 pt-4">
                                    {forwardedTasks.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>No tasks forwarded to team leaders for the selected period</p>
                                            <p className="text-sm mt-1">Start by forwarding this task to your team leaders</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                {forwardedTasks.map((ftask) => (
                                                    <div key={ftask._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold">{ftask.title}</h4>
                                                                    <Badge variant={ftask.priority === 'high' ? 'destructive' : 'secondary'}>
                                                                        {ftask.priority}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600 line-clamp-2">{ftask.description}</p>

                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-3 w-3" />
                                                                        <span>{ftask.assignedTo?.name}</span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {ftask.assignedTo?.designation || 'Team Leader'}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        <span>{format(new Date(ftask.assignmentDate), 'PP')}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{format(new Date(ftask.deadline), 'PP')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-end gap-2 ml-4">
                                                                <Badge variant={ftask.status === 'completed' ? 'default' : 'outline'}
                                                                    className={ftask.status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
                                                                    {ftask.status}
                                                                </Badge>
                                                                <div className="text-xs text-gray-500 text-right">
                                                                    Progress: {ftask.progress}%
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="mt-3">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span>Team Leader Progress</span>
                                                                <span>{ftask.progress}%</span>
                                                            </div>
                                                            <Progress value={ftask.progress} className="h-2" />
                                                        </div>

                                                        {/* Additional Info */}
                                                        {ftask.highlights && ftask.highlights.length > 0 && (
                                                            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <MessageSquare className="h-3 w-3 text-blue-600" />
                                                                    <span className="text-xs font-medium text-blue-800">Key Points</span>
                                                                </div>
                                                                <p className="text-xs text-blue-700 line-clamp-2">
                                                                    {ftask.highlights.slice(0, 2).join(', ')}
                                                                    {ftask.highlights.length > 2 && ` and ${ftask.highlights.length - 2} more...`}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pagination */}
                                            {pagination.totalPages > 1 && (
                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div className="text-sm text-gray-500">
                                                        Showing {forwardedTasks.length} of {pagination.total} tasks
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                                            disabled={pagination.page === 1}
                                                        >
                                                            Previous
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                                            disabled={pagination.page === pagination.totalPages}
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </TabsContent>

                                <TabsContent value="stats" className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                                    <p className="text-sm text-gray-600">Total Forwarded</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                                                    <p className="text-sm text-gray-600">Completed</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                                                    <p className="text-sm text-gray-600">In Progress</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Additional Statistics */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm">Team Leader Distribution</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {Array.from(new Set(forwardedTasks.map(t => t.assignedTo?.name))).map((leaderName, index) => {
                                                        const leaderTasks = forwardedTasks.filter(t => t.assignedTo?.name === leaderName);
                                                        return (
                                                            <div key={index} className="flex justify-between items-center text-sm">
                                                                <span className="truncate">{leaderName || 'Unknown Leader'}</span>
                                                                <Badge variant="outline">{leaderTasks.length}</Badge>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm">Priority Distribution</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {['high', 'medium', 'low'].map((priority) => {
                                                        const priorityTasks = forwardedTasks.filter(t => t.priority === priority);
                                                        return (
                                                            <div key={priority} className="flex justify-between items-center text-sm">
                                                                <span className="capitalize">{priority} Priority</span>
                                                                <Badge variant="outline">{priorityTasks.length}</Badge>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}