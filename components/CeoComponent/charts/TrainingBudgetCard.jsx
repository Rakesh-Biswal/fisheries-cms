import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Users } from "lucide-react"

export default function TrainingBudgetCard({ hrMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training & Development</CardTitle>
        <CardDescription>Budget utilization and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Budget Utilization</span>
            <span>
              ₹{hrMetrics.trainingSpent.toLocaleString()} / ₹{hrMetrics.trainingBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={(hrMetrics.trainingSpent / hrMetrics.trainingBudget) * 100} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Certifications</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-muted-foreground">Training Hours</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}