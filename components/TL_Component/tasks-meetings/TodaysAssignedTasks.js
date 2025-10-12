"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Forward, Filter, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TodaysAssignedTasks({
    onAssignTask
}) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        fetchTodaysTasks()
    }, [selectedDate])

    const fetchTodaysTasks = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `${API_URL}/api/tl/tasks-meetings/tasks-by-date?date=${selectedDate}`,
                {
                    credentials: 'include'
                }
            )

            if (response.ok) {
                const data = await response.json()
                setTasks(data.data || [])
            } else {
                throw new Error('Failed to fetch today\'s tasks')
            }
        } catch (error) {
            console.error('Error fetching today\'s tasks:', error)
            toast.error('Failed to load today\'s tasks')
        } finally {
            setLoading(false)
        }
    }

    const getPriorityBadge = (priority) => {
        const variants = {
            high: "destructive",
            medium: "secondary",
            low: "outline"
        }
        return <Badge variant={variants[priority]}>{priority}</Badge>
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-gray-500",
            'in-progress': "bg-blue-500",
            completed: "bg-green-500",
            overdue: "bg-red-500",
            cancelled: "bg-gray-300"
        }
        return colors[status] || "bg-gray-500"
    }

    const hasResponse = (task) => {
        return task.response && task.response.submittedAt
    }

    const isToday = (date) => {
        const today = new Date().toDateString()
        const taskDate = new Date(date).toDateString()
        return today === taskDate
    }

    if (loading) {
        return (
            <Card className="border-muted">
                <CardHeader>
                    <CardTitle className="text-base">Today Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-muted">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Assigned Tasks</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="date-filter" className="text-sm text-muted-foreground">
                                Date:
                            </Label>
                            <Input
                                id="date-filter"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-32 h-8 text-sm"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3 w-3 mr-1" />
                            Filter
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground mb-2">
                                {isToday(selectedDate)
                                    ? "No tasks assigned for today"
                                    : `No tasks assigned for ${new Date(selectedDate).toLocaleDateString()}`
                                }
                            </p>
                            {isToday(selectedDate) && (
                                <p className="text-sm text-muted-foreground">
                                    Go to Tasks part & click on "Forward & Assign Task" button to assign task for today
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getPriorityBadge(task.priority)}
                                    <Badge variant="outline" className={getStatusColor(task.status)}>
                                        {task.status}
                                    </Badge>
                                    {hasResponse(task) && (
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Response Submitted
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.assignmentDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold">{task.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {task.description}
                                </p>
                            </div>

                            {/* Sales Employee Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignedTo?.photo} />
                                        <AvatarFallback className="text-xs">
                                            {task.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{task.assignedTo?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {task.assignedTo?.empCode} • {task.assignedTo?.assignedZone || 'Sales Executive'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Response Preview */}
                            {hasResponse(task) && (
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            Work Status: {task.response.workStatus}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            Submitted: {new Date(task.response.submittedAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm line-clamp-2">
                                        <strong>Response:</strong> {task.response.responseDescription}
                                    </p>
                                    {task.response.completionPercentage > 0 && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs">Completion:</span>
                                            <Progress value={task.response.completionPercentage} className="h-2 w-20" />
                                            <span className="text-xs">{task.response.completionPercentage}%</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Progress for tasks without response */}
                            {!hasResponse(task) && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-2" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {tasks.length > 0 && (
                    <div className="text-center pt-2">
                        <Button variant="outline" size="sm">
                            View All {tasks.length} Tasks
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}