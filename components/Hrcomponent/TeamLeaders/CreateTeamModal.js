import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const CreateTeamModal = ({ open, onOpenChange, teamLeaders, onCreateTeam, newTeam, setNewTeam, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateTeam()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="Enter team name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              placeholder="Enter team description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="leader">Assign Leader *</Label>
            <Select
              value={newTeam.leader}
              onValueChange={(val) => setNewTeam({ ...newTeam, leader: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team leader" />
              </SelectTrigger>
              <SelectContent>
                {teamLeaders.filter(leader => leader.status === "active").map((leader) => (
                  <SelectItem key={leader._id} value={leader._id}>
                    {leader.name} - {leader.businessData?.assignedZone || "No zone"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="region">Region</Label>
            <Select
              value={newTeam.region}
              onValueChange={(val) => setNewTeam({ ...newTeam, region: val })}
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
            <Label htmlFor="project">Project</Label>
            <Input
              id="project"
              value={newTeam.project}
              onChange={(e) => setNewTeam({ ...newTeam, project: e.target.value })}
              placeholder="Assign project (optional)"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}