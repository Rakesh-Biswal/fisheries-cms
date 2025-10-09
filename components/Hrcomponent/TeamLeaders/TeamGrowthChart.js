import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MoreHorizontal } from "lucide-react"

const teamGrowthData = [
  { month: "Jul", teams: 8, leaders: 6 },
  { month: "Aug", teams: 12, leaders: 9 },
  { month: "Sept", teams: 18, leaders: 14 },
]

export const TeamGrowthChart = ({ teamLeaders, teams }) => {
  const currentStats = {
    totalTeams: teams.length,
    totalLeaders: teamLeaders.length,
    activeLeaders: teamLeaders.filter(leader => leader.status === "active").length
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Team Growth</CardTitle>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Total Teams</p>
              <p className="text-xl font-bold">{currentStats.totalTeams}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Leaders</p>
              <p className="text-xl font-bold">{currentStats.activeLeaders}</p>
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Teams</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Leaders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamGrowthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis hide />
              <Tooltip
                formatter={(value, name) => [value, name === "teams" ? "Teams" : "Leaders"]}
                labelStyle={{ color: "#666" }}
              />
              <Bar dataKey="teams" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leaders" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}