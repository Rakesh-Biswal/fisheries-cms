"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Phone, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import HireTelecallerForm from "@/components/HrComponent/HireTeleCallerForm"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TelecallersPage() {
  const [telecallers, setTelecallers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [error, setError] = useState(null)

  const fetchTelecallers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/telecaller/fetch-data`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTelecallers(data.data)
      } else {
        throw new Error("Failed to fetch telecallers")
      }
    } catch (err) {
      console.error("Error fetching telecallers:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelecallers()
  }, [])

  const handleHireSuccess = (newTelecaller) => {
    // Refresh data and close takeover view
    fetchTelecallers()
    setShowHireForm(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {showHireForm ? (
        <div className="bg-white p-2 w-full">
          <div className="rounded-lg">
            <HireTelecallerForm onClose={() => setShowHireForm(false)} onSuccess={handleHireSuccess} />
          </div>
        </div>
      ) : (
        // Original page content
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Telecallers</h1>
              <p className="text-muted-foreground">Manage telecallers and their call performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="default" className="bg-orange-500 w-fit">
                <Users className="w-4 h-4 mr-1" />
                {telecallers.length} Telecallers
              </Badge>
              <Button onClick={() => setShowHireForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hire New Telecaller
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
                <Button onClick={fetchTelecallers}>Try Again</Button>
              </CardContent>
            </Card>
          ) : telecallers.length === 0 ? (
            <Card className="text-center p-8">
              <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Telecallers Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by hiring your first telecaller to manage call operations.
              </p>
              <Button onClick={() => setShowHireForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Hire First Telecaller
              </Button>
            </Card>
          ) : (
            <>
              {/* Telecallers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {telecallers.map((telecaller) => (
                  <Card key={telecaller._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={telecaller.photo || "/placeholder.svg"} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {telecaller.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{telecaller.name}</CardTitle>
                          <CardDescription>{telecaller.businessData?.designation}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shift:</span>
                        <span className="font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {telecaller.businessData?.shift || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{telecaller.experience || 0} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Daily Target:</span>
                        <span className="font-medium">{telecaller.businessData?.dailyCallTarget || "0"} calls</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={telecaller.status === "active" ? "default" : "secondary"}>
                          {telecaller.status}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
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
                    Telecallers Performance Overview
                  </CardTitle>
                  <CardDescription>Summary of all telecallers' performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{telecallers.length}</div>
                      <div className="text-sm text-muted-foreground">Total Telecallers</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {telecallers.filter((t) => t.status === "active").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Telecallers</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {telecallers.length > 0
                          ? Math.round(
                              telecallers.reduce((sum, telecaller) => sum + (telecaller.experience || 0), 0) /
                                telecallers.length,
                            )
                          : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Experience (Years)</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {telecallers.reduce(
                          (sum, telecaller) => sum + (telecaller.businessData?.dailyCallTarget || 0),
                          0,
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Daily Call Target</div>
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
