"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, X } from "lucide-react"

export default function TaskActionsModal({ 
  open, 
  onOpenChange, 
  task, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const handleAction = (action) => {
    onOpenChange(false)
    switch (action) {
      case 'view':
        onView?.(task)
        break
      case 'edit':
        onEdit?.(task)
        break
      case 'delete':
        onDelete?.(task)
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Actions</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="border-b pb-2">
            <p className="text-sm font-medium text-gray-900">{task?.title}</p>
            <p className="text-xs text-gray-500 line-clamp-2">{task?.description}</p>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleAction('view')}
          >
            <Eye className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">View Details</div>
              <div className="text-xs text-gray-500">See full task information</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleAction('edit')}
          >
            <Edit className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Edit Task</div>
              <div className="text-xs text-gray-500">Modify task details</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction('delete')}
          >
            <Trash2 className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Delete Task</div>
              <div className="text-xs text-red-500">Remove this task permanently</div>
            </div>
          </Button>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}