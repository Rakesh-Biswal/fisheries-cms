import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, MapPin, Users, TrendingUp } from "lucide-react"

export const TeamStats = ({ team }) => {
  const stats = [
    {
      title: "Performance Score",
      value: team.performanceScore ? `${team.performanceScore}%` : "Not set",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Region",
      value: team.region || "Not assigned",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Team Members",
      value: team.workers?.length || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Status",
      value: team.status?.charAt(0).toUpperCase() + team.status?.slice(1),
      icon: TrendingUp,
      color: team.status === "active" ? "text-green-600" : "text-gray-600",
      bgColor: team.status === "active" ? "bg-green-100" : "bg-gray-100"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`h-8 w-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            {stat.title === "Performance Score" && team.performanceScore && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${team.performanceScore}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}