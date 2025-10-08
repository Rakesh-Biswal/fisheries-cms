"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function ForwardTaskModal({ 
  open, 
  onOpenChange, 
  task, 
  onTaskForwarded,
  isEditMode = false 
}) {
  const [loading, setLoading] = useState(false)
  const [teamLeaders, setTeamLeaders] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    highlights: [""],
    assignedTo: "",
    priority: "medium",
    status: "pending",
    progress: 0
  })

  useEffect(() => {
    if (open) {
      fetchTeamLeaders()
      if (task) {
        // Pre-fill form with task data
        setFormData({
          title: task.title || "",
          description: task.description || "",
          deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
          highlights: task.highlights?.length > 0 ? task.highlights : [""],
          assignedTo: task.assignedTo?._id || task.assignedTo || "",
          priority: task.priority || "medium",
          status: task.status || "pending",
          progress: task.progress || 0
        })
      } else {
        // Reset form for new task
        setFormData({
          title: "",
          description: "",
          deadline: "",
          highlights: [""],
          assignedTo: "",
          priority: "medium",
          status: "pending",
          progress: 0
        })
      }
    }
  }, [open, task])

  const fetchTeamLeaders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/tasks-meetings/team-leaders`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setTeamLeaders(data.data || [])
      } else {
        throw new Error('Failed to fetch team leaders')
      }
    } catch (error) {
      console.error('Error fetching team leaders:', error)
      toast.error('Failed to load team leaders')
    }
  }

  const handleAddHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ""]
    }))
  }

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const handleHighlightChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((item, i) => i === index ? value : item)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.deadline || !formData.assignedTo) {
      toast.error('Please fill all required fields')
      return
    }

    // Filter out empty highlights
    const filteredHighlights = formData.highlights.filter(highlight => highlight.trim() !== "")

    setLoading(true)
    try {
      let url, method, body

      if (isEditMode && task) {
        // Edit mode - update existing task
        url = `${API_URL}/api/hr/tasks-meetings/forwarded-tasks/${task._id}`
        method = 'PUT'
        body = {
          ...formData,
          highlights: filteredHighlights
        }
      } else {
        // Create mode - forward new task
        url = `${API_URL}/api/hr/tasks-meetings/forward-task`
        method = 'POST'
        body = {
          originalTaskId: task._id,
          ...formData,
          highlights: filteredHighlights
        }
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const result = await response.json()
        
        const successMessage = isEditMode 
          ? 'Task updated successfully' 
          : 'Task forwarded successfully'
        
        toast.success(successMessage)
        onTaskForwarded?.(result.data)
        onOpenChange(false)
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          deadline: "",
          highlights: [""],
          assignedTo: "",
          priority: "medium",
          status: "pending",
          progress: 0
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || `Failed to ${isEditMode ? 'update' : 'forward'} task`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'forwarding'} task:`, error)
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'forward'} task`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? 'Edit Forwarded Task' : 'Forward Work to Team Leader'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task in detail..."
              rows={4}
              required
            />
          </div>

          {/* Deadline & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </SelectItem>
                  <SelectItem value="high">
                    <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status & Progress (only for editing) */}
          {isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  placeholder="0-100"
                />
              </div>
            </div>
          )}

          {/* Assign to Team Leader */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign to Team Leader *</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team leader" />
              </SelectTrigger>
              <SelectContent>
                {teamLeaders.map((leader) => (
                  <SelectItem key={leader._id} value={leader._id}>
                    <div className="flex items-center gap-2">
                      <span>{leader.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {leader.designation}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Task Highlights (Important Points)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Point
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder={`Important point ${index + 1}`}
                  />
                  {formData.highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveHighlight(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (isEditMode ? "Updating..." : "Forwarding...") 
                : (isEditMode ? "Update Task" : "Forward Task")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}