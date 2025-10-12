"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Paperclip, Forward } from "lucide-react"

export default function AssignedTasks({ 
  tasks, 
  onForwardTask 
}) {
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

  if (tasks.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base">Assigned Tasks from CEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tasks assigned from CEO yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="text-base">Assigned Tasks from CEO ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.slice(0, 3).map((task) => (
          <div key={task._id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPriorityBadge(task.priority)}
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
              <Button 
                size="sm" 
                onClick={() => onForwardTask(task)}
                className="flex items-center gap-1"
              >
                <Forward className="h-3 w-3" />
                Forward
              </Button>
            </div>
            
            <div>
              <h4 className="font-semibold">{task.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {task.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>From: {task.createdBy?.name || "CEO"}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {task.comments?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  {task.attachments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length > 3 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              View All {tasks.length} Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}