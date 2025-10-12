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

export default function AssignTaskModal({ 
  open, 
  onOpenChange, 
  task, 
  onTaskAssigned 
}) {
  const [loading, setLoading] = useState(false)
  const [salesEmployees, setSalesEmployees] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    highlights: [""],
    assignedTo: "",
    priority: "medium"
  })

  useEffect(() => {
    if (open && task) {
      fetchSalesEmployees()
      // Set default deadline to today
      const today = new Date();
      const todayString = today.toISOString().slice(0, 16);
      
      // Pre-fill form with task data
      setFormData({
        title: task.title || "",
        description: task.description || "",
        deadline: todayString,
        highlights: [""],
        assignedTo: "",
        priority: task.priority || "medium"
      })
    }
  }, [open, task])

  const fetchSalesEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tl/tasks-meetings/sales-employees`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSalesEmployees(data.data || [])
      } else {
        throw new Error('Failed to fetch sales employees')
      }
    } catch (error) {
      console.error('Error fetching sales employees:', error)
      toast.error('Failed to load sales employees')
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
      const response = await fetch(`${API_URL}/api/tl/tasks-meetings/assign-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          originalTaskId: task._id,
          ...formData,
          highlights: filteredHighlights
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Task assigned successfully')
        onTaskAssigned?.(result.data)
        onOpenChange(false)
        // Reset form
        setFormData({
          title: "",
          description: "",
          deadline: "",
          highlights: [""],
          assignedTo: "",
          priority: "medium"
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to assign task')
      }
    } catch (error) {
      console.error('Error assigning task:', error)
      toast.error(error.message || 'Failed to assign task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Forward & Assign Task to Sales Employee</DialogTitle>
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

          {/* Assign to Sales Employee */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign to Sales Employee *</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sales employee" />
              </SelectTrigger>
              <SelectContent>
                {salesEmployees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    <div className="flex items-center gap-2">
                      <span>{employee.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {employee.designation}
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
              {loading ? "Assigning..." : "Assign Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}