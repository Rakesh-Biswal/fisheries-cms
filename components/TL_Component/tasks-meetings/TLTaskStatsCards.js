"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, Clock, TrendingUp } from "lucide-react"

export default function TLTaskStatsCards({ stats }) {
  const statItems = [
    {
      label: "Today's Tasks",
      value: stats?.today?.totalToday || 0,
      icon: Calendar,
      color: "text-blue-600",
      description: `${stats?.today?.completedToday || 0} completed`
    },
    {
      label: "Pending Today",
      value: stats?.today?.pendingToday || 0,
      icon: Clock,
      color: "text-yellow-600",
      description: "Awaiting completion"
    },
    {
      label: "With Response",
      value: stats?.today?.withResponse || 0,
      icon: CheckCircle,
      color: "text-green-600",
      description: "Feedback received"
    },
    {
      label: "Total Assigned",
      value: stats?.overall?.totalAssigned || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      description: `${stats?.overall?.completed || 0} completed overall`
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