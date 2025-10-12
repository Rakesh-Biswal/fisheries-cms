"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, CheckCircle, Users, Calendar } from "lucide-react"

export default function HrTaskStatsCards({ stats, meetingStats }) {
  const statItems = [
    {
      label: "Assigned Tasks",
      value: stats?.assigned?.totalAssigned || 0,
      icon: Users,
      color: "text-blue-600",
      description: `${stats?.assigned?.pendingAssigned || 0} pending`
    },
    {
      label: "In Progress",
      value: stats?.assigned?.inProgressAssigned || 0,
      icon: Clock,
      color: "text-yellow-600",
      description: "From CEO"
    },
    {
      label: "Forwarded Tasks",
      value: stats?.forwarded?.totalForwarded || 0,
      icon: TrendingUp,
      color: "text-green-600",
      description: "To team leaders"
    },
    {
      label: "Total Meetings",
      value: meetingStats?.totalMeetings || 0,
      icon: Calendar,
      color: "text-purple-600",
      description: `${meetingStats?.todayMeetings || 0} today`
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.label} className="border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}