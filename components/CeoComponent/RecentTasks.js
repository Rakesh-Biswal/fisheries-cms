"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, MessageSquare, Paperclip, Plus } from "lucide-react"
import { toast } from "sonner"
import TaskActionsModal from "./TaskActionsModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function RecentTasks({ 
  tasks, 
  onCreateTask, 
  onEditTask, 
  onTaskDeleted 
}) {
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

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-500",
      'in-progress': "bg-blue-500",
      completed: "bg-green-500",
      overdue: "bg-red-500"
    }
    return colors[status] || "bg-gray-500"
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

  if (tasks.length === 0) {
    return (
      <Card className="lg:col-span-2 border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Tasks</CardTitle>
          <Button onClick={onCreateTask} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              No tasks assigned yet
            </div>
            <Button onClick={onCreateTask}>
              Assign First Task to Your HR
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="lg:col-span-2 border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Tasks</CardTitle>
          <Button onClick={onCreateTask} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tasks.slice(0, 4).map((task) => (
            <Card key={task._id} className="border-muted">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(task.priority)}
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleOpenActions(task)}
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                  {task.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignedTo?.photo} />
                      <AvatarFallback className="text-xs">
                        {task.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignedTo?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" aria-label="comments">
                      <MessageSquare className="h-3 w-3" />
                      {task.comments?.length || 0}
                    </span>
                    <span className="flex items-center gap-1" aria-label="attachments">
                      <Paperclip className="h-3 w-3" />
                      {task.attachments?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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