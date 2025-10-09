"use client"

import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, User, FileText, Target, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function AssignedTaskDetail() {
    const params = useParams()
    const router = useRouter()
    const taskId = params.id

    const [task, setTask] = useState(null)
    const [forwardedTasks, setForwardedTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [taskLoading, setTaskLoading] = useState(true) // Separate loading for task
    const [forwardedLoading, setForwardedLoading] = useState(true) // Separate loading for forwarded tasks
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
        withResponse: 0
    })

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails()
            fetchForwardedTasks()
        }
    }, [taskId, selectedPeriod, pagination.page])

    const fetchTaskDetails = async () => {
        try {
            setTaskLoading(true)
            console.log("Fetching task details for ID:", taskId);
            const response = await fetch(`${API_URL}/api/tl/tasks-meetings/assigned-tasks/${taskId}`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                console.log("Task data received:", data.data);
                setTask(data.data)
            } else {
                console.error("Failed to fetch task details, status:", response.status);
                throw new Error('Failed to fetch task details')
            }
        } catch (error) {
            console.error('Error fetching task details:', error)
            toast.error('Failed to load task details')
        } finally {
            setTaskLoading(false)
        }
    }

    const fetchForwardedTasks = async () => {
        try {
            setForwardedLoading(true)
            const response = await fetch(
                `${API_URL}/api/tl/tasks-meetings/forwarded-tasks/${taskId}?period=${selectedPeriod}&page=${pagination.page}&limit=5`,
                {
                    credentials: 'include'
                }
            )

            if (response.ok) {
                const data = await response.json()
                setForwardedTasks(data.data || [])
                setStats(data.stats || { total: 0, completed: 0, withResponse: 0 })
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
            setForwardedLoading(false)
        }
    }

    // Update overall loading state based on both individual loading states
    useEffect(() => {
        if (!taskLoading && !forwardedLoading) {
            setLoading(false)
        }
    }, [taskLoading, forwardedLoading])

    const handleStatusUpdate = async (newStatus) => {
        if (!task) return

        setUpdatingStatus(true)
        try {
            const progress = newStatus === 'completed' ? 100 :
                newStatus === 'in-progress' ? 50 :
                    task.progress

            const response = await fetch(`${API_URL}/api/tl/tasks-meetings/assigned-tasks/${taskId}/status`, {
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

    // Show loading only when both APIs are loading
    if (loading) {
        return (
            <DashboardLayout title="Assigned Task Detail">
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

    // Show task not found only after task loading is complete and no task data
    if (!taskLoading && !task) {
        return (
            <DashboardLayout title="Task Not Found">
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
            </DashboardLayout>
        )
    }

    // Show task details even if forwarded tasks are still loading
    return (
        <DashboardLayout title="Assigned Task Detail">
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
                                <p className="text-gray-600 mt-1">Assigned task from HR with complete information</p>
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
                                                <p className="text-xs text-gray-500">Update the progress of this task</p>
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
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Assigned By:</span>
                                                <span>{task.assignedBy?.name || 'HR Department'}</span>
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
                            {/* Assigned By Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5" />
                                        Assigned By
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={task.assignedBy?.photo} />
                                            <AvatarFallback>
                                                {task.assignedBy?.name?.split(' ').map(n => n[0]).join('') || 'HR'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{task.assignedBy?.name || 'HR Department'}</p>
                                            <p className="text-sm text-gray-500">{task.assignedBy?.companyEmail}</p>
                                            <p className="text-xs text-gray-400">HR Manager</p>
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
                                        <span className="text-sm">With Response:</span>
                                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                                            {stats.withResponse}
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
                                    Forwarded Work to Sales Team
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
                            {forwardedLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <Tabs defaultValue="list" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="list">Task List</TabsTrigger>
                                        <TabsTrigger value="stats">Statistics</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="list" className="space-y-4 pt-4">
                                        {forwardedTasks.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                <p>No tasks forwarded for the selected period</p>
                                                <p className="text-sm mt-1">Start by forwarding this task to your sales team</p>
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
                                                                    {ftask.response?.submittedAt && (
                                                                        <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                                                                            Response: {ftask.response.workStatus}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {ftask.response?.submittedAt && (
                                                                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <MessageSquare className="h-4 w-4 text-blue-600" />
                                                                        <span className="text-sm font-medium text-blue-800">Sales Response</span>
                                                                        <span className="text-xs text-blue-600">
                                                                            {format(new Date(ftask.response.submittedAt), 'PPp')}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-blue-700 line-clamp-2">
                                                                        {ftask.response.responseDescription}
                                                                    </p>
                                                                    {ftask.response.completionPercentage > 0 && (
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className="text-xs text-blue-600">Completion:</span>
                                                                            <Progress value={ftask.response.completionPercentage} className="h-1.5 w-20" />
                                                                            <span className="text-xs text-blue-600">{ftask.response.completionPercentage}%</span>
                                                                        </div>
                                                                    )}
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
                                                        <div className="text-2xl font-bold text-purple-600">{stats.withResponse}</div>
                                                        <p className="text-sm text-gray-600">With Response</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}