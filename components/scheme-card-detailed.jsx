import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertCircle, Users, Calendar, IndianRupee, FileText, ExternalLink } from "lucide-react"

const getStatusIcon = (status) => {
  switch (status) {
    case "live":
      return <CheckCircle className="h-4 w-4" />
    case "expiring":
      return <Clock className="h-4 w-4" />
    case "expired":
      return <AlertCircle className="h-4 w-4" />
    default:
      return null
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "live":
      return "bg-green-100 text-green-800 border-green-200"
    case "expiring":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "expired":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getDaysRemaining = (deadline) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function SchemeCardDetailed({ scheme }) {
  const daysRemaining = getDaysRemaining(scheme.deadline)
  const progressPercentage = Math.max(
    0,
    Math.min(100, ((scheme.maxApplicants - scheme.applicants) / scheme.maxApplicants) * 100),
  )

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className={`${getStatusColor(scheme.status)} flex items-center gap-1`}>
            {getStatusIcon(scheme.status)}
            {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary flex items-center">
              <IndianRupee className="h-5 w-5" />
              {scheme.amount.replace("₹", "")}
            </div>
            <div className="text-xs text-muted-foreground">Max Subsidy</div>
          </div>
        </div>

        <CardTitle className="text-lg leading-tight mb-2">{scheme.title}</CardTitle>
        <p className="text-sm text-muted-foreground font-medium mb-2">{scheme.titleOdia}</p>

        <div className="flex flex-wrap gap-1">
          {scheme.categories?.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{scheme.description}</p>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Deadline</div>
              <div className="text-muted-foreground">{new Date(scheme.deadline).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}</div>
              <div className="text-muted-foreground">{scheme.processingTime || "30-45 days"}</div>
            </div>
          </div>
        </div>

        {/* Application Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Applications
            </span>
            <span className="font-medium">
              {scheme.applicants?.toLocaleString()} / {scheme.maxApplicants?.toLocaleString()}
            </span>
          </div>
          <Progress value={100 - progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {scheme.maxApplicants - scheme.applicants} slots remaining
          </div>
        </div>

        {/* Key Benefits */}
        {scheme.keyBenefits && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Benefits:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {scheme.keyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1 bg-transparent">
            <FileText className="h-4 w-4" />
            View Details
          </Button>
          <Button size="sm" className="flex-1 flex items-center gap-1" disabled={scheme.status === "expired"}>
            <ExternalLink className="h-4 w-4" />
            {scheme.status === "expired" ? "Expired" : "Apply Now"}
          </Button>
        </div>

        {/* Eligibility Quick Check */}
        {scheme.eligibilityHighlights && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            <span className="font-medium">Eligibility: </span>
            {scheme.eligibilityHighlights.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
