"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload, Calendar } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TaskCreateModal({ 
  open, 
  onOpenChange, 
  onTaskCreated, 
  onTaskUpdated,
  editingTask = null 
}) {
  const [loading, setLoading] = useState(false)
  const [hrEmployees, setHrEmployees] = useState([])
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
      fetchHrEmployees()
      if (editingTask) {
        // Populate form with existing task data
        setFormData({
          title: editingTask.title || "",
          description: editingTask.description || "",
          deadline: editingTask.deadline ? new Date(editingTask.deadline).toISOString().slice(0, 16) : "",
          highlights: editingTask.highlights?.length > 0 ? editingTask.highlights : [""],
          assignedTo: editingTask.assignedTo?._id || "",
          priority: editingTask.priority || "medium",
          status: editingTask.status || "pending",
          progress: editingTask.progress || 0
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
  }, [open, editingTask])

  const fetchHrEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ceo/tasks-meetings/hr-employees`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setHrEmployees(data.data || [])
      } else {
        throw new Error('Failed to fetch HR employees')
      }
    } catch (error) {
      console.error('Error fetching HR employees:', error)
      toast.error('Failed to load HR employees')
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
      const url = editingTask 
        ? `${API_URL}/api/ceo/tasks-meetings/tasks/${editingTask._id}`
        : `${API_URL}/api/ceo/tasks-meetings/tasks`
      
      const method = editingTask ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          highlights: filteredHighlights
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        if (editingTask) {
          toast.success('Task updated successfully')
          onTaskUpdated?.(result.data)
        } else {
          toast.success('Task created successfully')
          onTaskCreated?.(result.data)
        }
        
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
        throw new Error(error.message || `Failed to ${editingTask ? 'update' : 'create'} task`)
      }
    } catch (error) {
      console.error(`Error ${editingTask ? 'updating' : 'creating'} task:`, error)
      toast.error(error.message || `Failed to ${editingTask ? 'update' : 'create'} task`)
    } finally {
      setLoading(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingTask ? 'Edit Task' : 'Assign New Task'}
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status & Progress (only for editing) */}
          {editingTask && (
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

          {/* Assign to HR */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign to HR *</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select HR employee" />
              </SelectTrigger>
              <SelectContent>
                {hrEmployees.map((hr) => (
                  <SelectItem key={hr._id} value={hr._id}>
                    <div className="flex items-center gap-2">
                      <span>{hr.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {hr.designation}
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
                ? (editingTask ? "Updating..." : "Creating...") 
                : (editingTask ? "Update Task" : "Create Task")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}