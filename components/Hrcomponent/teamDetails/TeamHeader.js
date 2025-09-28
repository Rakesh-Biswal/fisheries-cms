import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Mail, Phone, MapPin } from "lucide-react"

export const TeamHeader = ({ team, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            ←
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600">{team.description || "No description available"}</p>
          </div>
        </div>
        <Badge variant="default" className="bg-blue-500">
          <Users className="w-4 h-4 mr-1" />
          {team.workers?.length || 0} Members
        </Badge>
      </div>

      {/* Team Leader Info */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Team Leader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={team.leader?.photo || "/placeholder.svg"} />
              <AvatarFallback>
                {team.leader?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "TL"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-xl">{team.leader?.name || "Unknown Leader"}</h3>
              <p className="text-sm text-gray-600">{team.leader?.email}</p>
              <p className="text-sm text-gray-600">{team.leader?.phone}</p>
              <div className="flex mt-2 space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}