import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Mail, Phone } from "lucide-react"

export const TeamMembersTable = ({ 
  team, 
  onAssignEmployees, 
  onEditTeam,
  onRemoveEmployee 
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Team Members ({team.workers?.length || 0})</CardTitle>
          <p className="text-sm text-gray-600">Current team members and their details</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onAssignEmployees}
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            Assign Employees
          </Button>
          <Button 
            onClick={onEditTeam}
            variant="outline" 
            size="sm" 
            className="text-xs"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Team
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left pb-3 font-medium">Employee</th>
                <th className="text-left pb-3 font-medium">Contact</th>
                <th className="text-left pb-3 font-medium">Position</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.workers?.map((worker, index) => (
                <tr key={worker._id} className={index > 0 ? "border-t" : ""}>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={worker.photo || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {worker.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "E"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{worker.name}</p>
                        <p className="text-xs text-gray-500">{worker.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {worker.email}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {worker.phone || "No phone"}
                      </p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-600">{worker.designation || "Sales Employee"}</span>
                  </td>
                  <td className="py-3">
                    <Badge 
                      variant={worker.status === "active" ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {worker.status || "inactive"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveEmployee(worker._id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {(!team.workers || team.workers.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No team members assigned yet. Click "Assign Employees" to add members.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}