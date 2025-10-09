import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter } from "lucide-react"

export const TeamsTable = ({ teams, onManageTeam }) => {
  if (teams.length === 0) return null

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Active Teams ({teams.length})</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left pb-3 font-medium">Team Name</th>
                <th className="text-left pb-3 font-medium">Description</th>
                <th className="text-left pb-3 font-medium">Leader</th>
                <th className="text-left pb-3 font-medium">Region</th>
                <th className="text-left pb-3 font-medium">Members</th>
                <th className="text-left pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team._id} className={index > 0 ? "border-t" : ""}>
                  <td className="py-3">
                    <span className="font-medium text-gray-900 text-sm">{team.name}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-600">{team.description || "No description"}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={team.leader?.photo} />
                        <AvatarFallback className="text-xs">
                          {team.leader?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "TL"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{team.leader?.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium">{team.region || "Not assigned"}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium">{team.workers?.length || 0} members</span>
                  </td>
                  <td className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManageTeam(team)}
                      className="text-xs"
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}