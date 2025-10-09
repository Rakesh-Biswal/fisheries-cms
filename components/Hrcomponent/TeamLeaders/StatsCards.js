import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Crown, Users, Target, MoreHorizontal, MapPin } from "lucide-react"

export const StatsCards = ({ teamLeaders, teams }) => {
  const stats = {
    totalLeaders: teamLeaders.length,
    activeTeams: teams.length,
    totalMembers: teams.reduce((sum, team) => sum + (team.workers?.length || 0), 0),
    activeLeaders: teamLeaders.filter(leader => leader.status === "active").length
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="bg-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Team Leaders</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalLeaders}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active: {stats.activeLeaders}
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Active Teams</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.activeTeams}</p>
              <p className="text-xs text-blue-600 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {stats.totalMembers} total members
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Target</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                ₹{teamLeaders.length > 0
                  ? Math.round(teamLeaders.reduce((sum, leader) => sum + (leader.businessData?.monthlyTarget || 0), 0) / teamLeaders.length).toLocaleString()
                  : '0'
                }
              </p>
              <p className="text-xs text-orange-600 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Monthly average
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Zone Coverage</p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {Array.from(new Set(teamLeaders.map(l => l.businessData?.assignedZone).filter(Boolean))).slice(0, 3).map((zone, index) => (
              <div key={zone} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-gray-600">{zone}</span>
                </div>
                <span className="font-medium">
                  {teamLeaders.filter(l => l.businessData?.assignedZone === zone).length} leaders
                </span>
              </div>
            ))}
            {Array.from(new Set(teamLeaders.map(l => l.businessData?.assignedZone).filter(Boolean))).length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{Array.from(new Set(teamLeaders.map(l => l.businessData?.assignedZone).filter(Boolean))).length - 3} more zones
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}