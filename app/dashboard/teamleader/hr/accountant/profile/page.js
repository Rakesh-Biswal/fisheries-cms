"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calculator,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Loader2,
  CreditCard,
  PieChart,
  BarChart3,
  CheckCircle,
  Clock
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function AccountantProfilePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  console.log("Accountant Profile ID from URL:", id)
  const router = useRouter()
  const [accountant, setAccountant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAccountantProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/accountants/profile/${id}`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setAccountant(data.data)
      } else {
        throw new Error("Failed to fetch Accountant profile")
      }
    } catch (err) {
      console.error("Error fetching Accountant profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchAccountantProfile()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Accountant profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !accountant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || "Accountant profile not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate accounting metrics
  const financialAccuracy = accountant.businessData?.financialAccuracy || 98.5
  const reportsCompleted = accountant.businessData?.reportsCompleted || 47
  const taxFilingAccuracy = accountant.businessData?.taxFilingAccuracy || 100
  const auditSuccessRate = accountant.businessData?.auditSuccessRate || 95

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accountants
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={accountant.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {accountant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={accountant.status === "active" ? "default" : "secondary"} className="mb-2">
                  {accountant.status}
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Calculator className="w-3 h-3 mr-1" />
                  Accountant
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{accountant.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {accountant.businessData?.designation || "Senior Accountant"}
                  </p>
                  <p className="text-sm text-muted-foreground">Employee ID: {accountant.empCode}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{accountant.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{accountant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined:{" "}
                      {accountant.businessData?.joiningDate
                        ? new Date(accountant.businessData.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Reports: {reportsCompleted}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-medium">{accountant.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{accountant.phone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Email:</span>
                <span className="font-medium">{accountant.companyEmail}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personal Email:</span>
                <span className="font-medium">{accountant.personalEmail || "Not provided"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aadhar Number:</span>
                <span className="font-medium">****-****-{accountant.aadhar?.slice(-4) || "****"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAN Number:</span>
                <span className="font-medium">{accountant.pan || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Code:</span>
                <span className="font-medium">{accountant.empCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{accountant.businessData?.department || "Finance & Accounting"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Type:</span>
                <span className="font-medium">{accountant.businessData?.employeeType}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joining Date:</span>
                <span className="font-medium">
                  {accountant.businessData?.joiningDate
                    ? new Date(accountant.businessData.joiningDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={accountant.status === "active" ? "default" : "secondary"}>
                  {accountant.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounting Details */}
        <Card>
          <CardHeader>
            <CardTitle>Accounting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Financial Accuracy:</span>
                <span className="font-medium flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {financialAccuracy}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax Filing Accuracy:</span>
                <span className="font-medium">{taxFilingAccuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audit Success Rate:</span>
                <span className="font-medium">{auditSuccessRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reports Completed:</span>
                <span className="font-medium">{reportsCompleted}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-blue-500" />
                Financial Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{financialAccuracy}%</div>
              <Progress value={financialAccuracy} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Accuracy in financial reporting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2 text-green-500" />
                Tax Filing Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{taxFilingAccuracy}%</div>
              <Progress value={taxFilingAccuracy} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Error-free tax submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                Audit Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{auditSuccessRate}%</div>
              <Progress value={auditSuccessRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Successful audit completions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Summary of financial responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">₹4.2M</div>
                <p className="text-sm text-blue-800">Monthly Payroll</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">₹18.5M</div>
                <p className="text-sm text-green-800">Quarterly Taxes</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">32</div>
                <p className="text-sm text-yellow-800">Vendor Payments</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <p className="text-sm text-purple-800">Financial Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest accounting activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Monthly Financial Report</p>
                  <p className="text-sm text-muted-foreground">
                    Completed and submitted monthly financial report
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Tax Filing Completed</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully filed quarterly taxes without errors
                  </p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Internal Audit Passed</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully completed internal audit with no discrepancies
                  </p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Budget Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Completed Q3 budget analysis and identified cost-saving opportunities
                  </p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications & Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications & Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Chartered Accountant (CA)</p>
                  <p className="text-sm text-muted-foreground">Institute of Chartered Accountants</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Certified Public Accountant (CPA)</p>
                  <p className="text-sm text-muted-foreground">American Institute of CPAs</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">QuickBooks Certified</p>
                  <p className="text-sm text-muted-foreground">Intuit QuickBooks</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}