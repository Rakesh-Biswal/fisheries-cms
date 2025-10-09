import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useState } from "react"

export const EditTeamModal = ({ 
  open, 
  onOpenChange, 
  team, 
  onUpdate, 
  onRemoveEmployee,
  loading 
}) => {
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description,
    region: team.region,
    project: team.project,
    performanceScore: team.performanceScore,
    notes: team.notes,
    status: team.status
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
  }

  const handleRemoveEmployee = (employeeId) => {
    if (window.confirm("Are you sure you want to remove this employee from the team?")) {
      onRemoveEmployee(employeeId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Team Details</DialogTitle>
          <p className="text-sm text-gray-600">Update team information and manage members</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="performanceScore">Performance Score</Label>
              <Input
                id="performanceScore"
                type="number"
                min="0"
                max="100"
                value={formData.performanceScore || ""}
                onChange={(e) => setFormData({ ...formData, performanceScore: e.target.value })}
                placeholder="0-100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project">Project</Label>
            <Input
              id="project"
              value={formData.project || ""}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              placeholder="Project name"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes about the team"
            />
          </div>

          {/* Current Team Members */}
          <div>
            <Label>Team Members ({team.workers?.length || 0})</Label>
            <div className="border rounded-lg mt-2">
              {team.workers?.map((worker) => (
                <div key={worker._id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={worker.photo} />
                      <AvatarFallback>
                        {worker.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{worker.name}</p>
                      <p className="text-xs text-gray-600">{worker.email}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveEmployee(worker._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!team.workers || team.workers.length === 0) && (
                <div className="p-4 text-center text-gray-500">
                  No team members
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}