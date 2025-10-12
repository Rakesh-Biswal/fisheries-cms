"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export default function TaskStatsCards({ stats }) {
  const statItems = [
    {
      label: "Total Task",
      value: stats?.total || 0,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: "Overdue",
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: "text-red-600"
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}