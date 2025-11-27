"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, FilterIcon, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import TaskDetailsPopup from "./TaskDetailsPopup"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function AssignedTasksTable({ onTaskDeleted }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskDetails, setTaskDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    fetchAssignedTasks()
  }, [selectedDate, page])

  const fetchAssignedTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${API_URL}/api/tl/tasks-meetings/assigned-tasks-history?date=${selectedDate}&page=${page}&limit=10`,
        {
          credentials: 'include'
        }
      )

      if (response.ok) {
        const data = await response.json()
        setTasks(data.data || [])
        setTotalPages(data.totalPages || 1)
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

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewTask = async (task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
    setDetailsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/tl/tasks-meetings/task-details/${task._id}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setTaskDetails(data.data)
      } else {
        throw new Error('Failed to fetch task details')
      }
    } catch (error) {
      console.error('Error fetching task details:', error)
      toast.error('Failed to load task details')
      setTaskDetails(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedTask(null)
    setTaskDetails(null)
  }

  const handleDeleteTask = async (task) => {
    if (!confirm(`Are you sure you want to delete the assigned task "${task.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/tl/tasks-meetings/assigned-tasks/${task._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Assigned task deleted successfully')
        onTaskDeleted?.(task._id)
        fetchAssignedTasks()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting assigned task:', error)
      toast.error(error.message || 'Failed to delete task')
    }
  }

  const hasResponse = (task) => {
    return task.response && task.response.submittedAt
  }

  if (loading) {
    return (
      <Card className="border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Assigned Tasks History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Assigned Tasks History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="table-date-filter" className="text-sm text-muted-foreground">
                Date:
              </Label>
              <Input
                id="table-date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-32 h-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] max-w-[200px]">Task Details</TableHead>
                  <TableHead className="w-[150px]">Assigned To</TableHead>
                  <TableHead className="w-[100px]">Assigned Date</TableHead>
                  <TableHead className="w-[100px]">Due Date</TableHead>
                  <TableHead className="w-[120px] min-w-[120px]">Progress</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Response</TableHead>
                  <TableHead className="w-[90px]">Priority</TableHead>
                  <TableHead className="w-[80px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id} className="hover:bg-muted/50">
                    <TableCell className="max-w-[200px]">
                      <div className="space-y-1">
                        <div className="font-medium text-sm truncate" title={task.title}>
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 break-words">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-[150px]">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={task.assignedTo?.photo} />
                          <AvatarFallback className="text-xs">
                            {task.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {task.assignedTo?.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {task.assignedTo?.empCode}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {formatDate(task.assignmentDate)}
                    </TableCell>

                    <TableCell className="text-sm">
                      {formatDate(task.deadline)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Progress value={task.progress} className="h-2 flex-1 min-w-[60px]" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {task.progress}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs whitespace-nowrap">
                        {task.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {hasResponse(task) ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
                          {task.response.workStatus}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          No Response
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {getPriorityBadge(task.priority)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewTask(task)}
                          className="h-7 w-7 p-0"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          title="Delete Task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found for the selected date
            </div>
          )}
        </CardContent>
      </Card>

      <TaskDetailsPopup
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        taskDetails={taskDetails}
        isLoading={detailsLoading}
        selectedTask={selectedTask}
      />
    </>
  )
}