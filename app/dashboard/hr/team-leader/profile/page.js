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
  DollarSign,
  TrendingUp,
  Users,
  Loader2,
  Target,
  Calendar,
  Building,
  CreditCard,
  MapPin,
  Award,
  Activity
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function SalesEmployeeProfilePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  console.log("Sales Employee Profile ID from URL:", id)
  const router = useRouter()
  const [salesEmployee, setSalesEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSalesEmployeeProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/sales-employees/profile/${id}`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setSalesEmployee(data.data)
      } else {
        throw new Error("Failed to fetch Sales Employee profile")
      }
    } catch (err) {
      console.error("Error fetching Sales Employee profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchSalesEmployeeProfile()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Sales Employee profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !salesEmployee) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || "Sales Employee profile not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const targetAchievement = salesEmployee.businessData?.targetAchievementRate || 0
  const currentSales = salesEmployee.businessData?.currentMonthSales || 0
  const monthlyTarget = salesEmployee.businessData?.monthlyTarget || 0

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales Employees
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={salesEmployee.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {salesEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={salesEmployee.status === "active" ? "default" : "secondary"} className="mb-2">
                  {salesEmployee.status}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{salesEmployee.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {salesEmployee.businessData?.designation || "Sales Executive"}
                  </p>
                  <p className="text-sm text-muted-foreground">Employee ID: {salesEmployee.empCode}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{salesEmployee.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{salesEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined:{" "}
                      {salesEmployee.businessData?.joiningDate
                        ? new Date(salesEmployee.businessData.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{salesEmployee.businessData?.employeeType}</span>
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
                <span className="font-medium">{salesEmployee.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{salesEmployee.phone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Email:</span>
                <span className="font-medium">{salesEmployee.companyEmail}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personal Email:</span>
                <span className="font-medium">{salesEmployee.personalEmail || "Not provided"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aadhar Number:</span>
                <span className="font-medium">****-****-{salesEmployee.aadhar?.slice(-4) || "****"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAN Number:</span>
                <span className="font-medium">{salesEmployee.pan || "Not provided"}</span>
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
                <span className="font-medium">{salesEmployee.empCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{salesEmployee.businessData?.department || "Sales"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Type:</span>
                <span className="font-medium">{salesEmployee.businessData?.employeeType}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joining Date:</span>
                <span className="font-medium">
                  {salesEmployee.businessData?.joiningDate
                    ? new Date(salesEmployee.businessData.joiningDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={salesEmployee.status === "active" ? "default" : "secondary"}>
                  {salesEmployee.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Details */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Zone:</span>
                <span className="font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {salesEmployee.businessData?.assignedZone || "Not assigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Target:</span>
                <span className="font-medium">₹{salesEmployee.businessData?.monthlyTarget?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Month Sales:</span>
                <span className="font-medium">₹{currentSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales:</span>
                <span className="font-medium">₹{salesEmployee.businessData?.totalSales?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                Target Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{targetAchievement}%</div>
              <Progress value={targetAchievement} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Target: ₹{monthlyTarget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                Current Month Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{currentSales.toLocaleString()}</div>
              <Progress value={(currentSales/monthlyTarget)*100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {((currentSales/monthlyTarget)*100).toFixed(1)}% of target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ₹{salesEmployee.businessData?.totalSales?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime sales performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-medium">{salesEmployee.bankAccount?.bankName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-medium">
                  {salesEmployee.bankAccount?.accountNumber 
                    ? `****${salesEmployee.bankAccount.accountNumber.slice(-4)}` 
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IFSC Code:</span>
                <span className="font-medium">{salesEmployee.bankAccount?.ifscCode || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-medium">{salesEmployee.bankAccount?.branch || "Not provided"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest sales activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Exceeded Monthly Sales Target</p>
                  <p className="text-sm text-muted-foreground">
                    Achieved {targetAchievement}% of monthly sales target
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Closed Major Deal</p>
                  <p className="text-sm text-muted-foreground">
                    Secured a corporate contract worth ₹2,50,000
                  </p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">New Client Acquisition</p>
                  <p className="text-sm text-muted-foreground">
                    Added 5 new clients to the portfolio
                  </p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Zone Expansion</p>
                  <p className="text-sm text-muted-foreground">
                    Expanded sales operations to new territory
                  </p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}