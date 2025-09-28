import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Target } from "lucide-react"

export const TeamLeadersTable = ({ teamLeaders, onViewDetails, loading }) => {
  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (teamLeaders.length === 0) {
    return (
      <Card className="text-center p-8 bg-white">
        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Team Leaders Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by hiring your first team leader to manage sales operations.
        </p>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Team Leaders ({teamLeaders.length})</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            All
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
            Active
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left pb-3 font-medium">Leader</th>
                <th className="text-left pb-3 font-medium">Team Size</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {teamLeaders.map((leader, index) => (
                <tr key={leader._id} className={index > 0 ? "border-t" : ""}>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={leader.photo || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {leader.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "TL"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{leader.name || "Unknown Leader"}</p>
                        <p className="text-xs text-gray-500">{leader.businessData?.designation || "Team Leader"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium">{leader.businessData?.teamSize || 0} members</span>
                  </td>
                  <td className="py-3">
                    <Badge variant={leader.status === "active" ? "default" : "secondary"} className="text-xs">
                      {leader.status || "inactive"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(leader._id)}
                      className="text-xs"
                    >
                      View Details
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