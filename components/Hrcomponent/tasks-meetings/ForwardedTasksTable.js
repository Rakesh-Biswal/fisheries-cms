"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FilterIcon, FileText, Link2, Eye, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function ForwardedTasksTable({ 
  tasks, 
  onEditTask, 
  onTaskDeleted 
}) {
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

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  const handleViewTask = (task) => {
    alert("Task details view is under construction for now.")
  }

  const handleEditTask = (task) => {
    onEditTask(task)
  }

  const handleDeleteTask = async (task) => {
    if (!confirm(`Are you sure you want to delete the forwarded task "${task.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/forwarded-tasks/${task._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Forwarded task deleted successfully')
        onTaskDeleted?.(task._id)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting forwarded task:', error)
      toast.error(error.message || 'Failed to delete task')
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Forwarded Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tasks forwarded to team leaders yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Forwarded Tasks ({tasks.length})</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
          <Button size="icon" variant="ghost" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Task Name</TableHead>
                <TableHead className="w-[150px]">Description</TableHead>
                <TableHead className="w-[120px]">Assigned To</TableHead>
                <TableHead className="w-[100px]">Due Date</TableHead>
                <TableHead className="min-w-[180px]">Progress</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                {/* <TableHead className="w-[100px]">Priority</TableHead> */}
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">
                    <div 
                      className="truncate" 
                      title={task.title}
                    >
                      {truncateText(task.title, 30)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div 
                      className="text-sm text-muted-foreground truncate"
                      title={task.description}
                    >
                      {truncateText(task.description, 40)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={task.assignedTo?.photo} />
                        <AvatarFallback className="text-xs">
                          {task.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span 
                        className="text-sm truncate"
                        title={task.assignedTo?.name}
                      >
                        {truncateText(task.assignedTo?.name, 15)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm whitespace-nowrap">
                      {formatDate(task.deadline)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <Progress value={task.progress} className="h-2 flex-1 min-w-0" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {task.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize whitespace-nowrap">
                      {task.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    {getPriorityBadge(task.priority)}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewTask(task)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTask(task)}
                        className="h-8 w-8 p-0"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}