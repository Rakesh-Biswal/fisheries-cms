"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FilterIcon, FileText, Link2 } from "lucide-react"
import { toast } from "sonner"
import TaskActionsModal from "./TaskActionsModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TaskListTable({ tasks, onEditTask, onTaskDeleted }) {
  const [actionsModalOpen, setActionsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

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

  const handleOpenActions = (task) => {
    setSelectedTask(task)
    setActionsModalOpen(true)
  }

  const handleViewTask = (task) => {
    alert("Task details view is under construction for now.")
  }

  const handleEditTask = (task) => {
    onEditTask(task)
  }

  const handleDeleteTask = async (task) => {
    if (!confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/ceo/tasks-meetings/tasks/${task._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Task deleted successfully')
        onTaskDeleted?.(task._id)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error(error.message || 'Failed to delete task')
    }
  }

  const AttachmentCell = ({ task }) => {
    if (task.attachments && task.attachments.length > 0) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          <span>{task.attachments.length} files</span>
        </div>
      )
    }
    if (task.images && task.images.length > 0) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          <span>{task.images.length} images</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link2 className="h-4 w-4" />
        <span>No attachments</span>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">List Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tasks available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">List Task ({tasks.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export CSV</DropdownMenuItem>
                <DropdownMenuItem>Columns</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="min-w-[180px]">Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{task.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignedTo?.photo} />
                          <AvatarFallback className="text-xs">
                            {task.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignedTo?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(task.deadline)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={task.progress} className="h-2 w-40" />
                        <span className="text-sm text-muted-foreground">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AttachmentCell task={task} />
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(task.priority)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenActions(task)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TaskActionsModal
        open={actionsModalOpen}
        onOpenChange={setActionsModalOpen}
        task={selectedTask}
        onView={handleViewTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </>
  )
}