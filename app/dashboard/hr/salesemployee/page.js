"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Target, MapPin, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireSalesEmployeeForm from "@/components/HrComponent/HireSalesEmployeeForm"
import { useRouter } from "next/navigation"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function SalesEmployeesPage() {
  const router = useRouter()
  const [salesEmployees, setSalesEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [error, setError] = useState(null)

  const fetchSalesEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/sales-employees/fetch-data`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setSalesEmployees(data.data)
      } else {
        throw new Error("Failed to fetch sales employees")
      }
    } catch (err) {
      console.error("Error fetching sales employees:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesEmployees()
  }, [])

  const handleHireSuccess = (newSalesEmployee) => {
    // Refresh data and close takeover view
    fetchSalesEmployees()
    setShowHireForm(false)
  }

  const handleViewDetails = (managerId) => {
    router.push(`/dashboard/hr/salesemployee/profile?id=${managerId}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {showHireForm ? (
        <div className="bg-white p-2 w-full">
          <div className="rounded-lg">
            <HireSalesEmployeeForm onClose={() => setShowHireForm(false)} onSuccess={handleHireSuccess} />
          </div>
        </div>
      ) : (
        // Original page content
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Sales Employees</h1>
              <p className="text-muted-foreground">Manage sales employees and their performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="default" className="bg-purple-500 w-fit">
                <Users className="w-4 h-4 mr-1" />
                {salesEmployees.length} Sales Employees
              </Badge>
              <Button onClick={() => setShowHireForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hire New Sales Employee
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchSalesEmployees}>Try Again</Button>
              </CardContent>
            </Card>
          ) : salesEmployees.length === 0 ? (
            <Card className="text-center p-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Sales Employees Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by hiring your first sales employee to manage sales operations.
              </p>
              <Button onClick={() => setShowHireForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Hire First Sales Employee
              </Button>
            </Card>
          ) : (
            <>
              {/* Sales Employees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salesEmployees.map((employee) => (
                  <Card key={employee._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.photo || "/placeholder.svg"} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{employee.name}</CardTitle>
                          <CardDescription>{employee.businessData?.designation}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Zone:</span>
                        <span className="font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {employee.businessData?.assignedZone || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{employee.experience || 0} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Target:</span>
                        <span className="font-medium">
                          ₹{employee.businessData?.monthlyTarget?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => handleViewDetails(employee._id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Sales Employees Performance Overview
                  </CardTitle>
                  <CardDescription>Summary of all sales employees' performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{salesEmployees.length}</div>
                      <div className="text-sm text-muted-foreground">Total Employees</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {salesEmployees.filter((e) => e.status === "active").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Employees</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {salesEmployees.reduce((sum, employee) => sum + (employee.experience || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Experience (Years)</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ₹
                        {salesEmployees
                          .reduce((sum, employee) => sum + (employee.businessData?.monthlyTarget || 0), 0)
                          .toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Monthly Target</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
