import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, UserX, DollarSign, Clock } from "lucide-react"

export default function HrMetricsCards({ hrMetrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <UserCheck className="w-4 h-4 mr-2 text-green-500" />
            New Hires (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{hrMetrics.newHires}</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <UserX className="w-4 h-4 mr-2 text-red-500" />
            Turnover Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{hrMetrics.turnoverRate}%</div>
          <p className="text-xs text-muted-foreground">-2.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
            Avg Salary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{hrMetrics.avgSalary.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+3.2% YoY growth</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2 text-purple-500" />
            Attendance Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{hrMetrics.attendanceRate}%</div>
          <p className="text-xs text-muted-foreground">Above target (90%)</p>
        </CardContent>
      </Card>
    </div>
  )
}