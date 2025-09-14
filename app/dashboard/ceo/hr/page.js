"use client"

import { useState, useEffect } from "react"
import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import NoHrState from "../../../../components/CeoComponent/NoHrState"
import HireHrForm from "../../../../components/CeoComponent/HireHrForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import { Users, DollarSign, UserCheck, UserX, Clock, Award, Plus, Loader2 } from "lucide-react"

// Import chart components
import RecruitmentPipelineChart from "../../../../components/CeoComponent/charts/RecruitmentPipelineChart"
import TurnoverTrendChart from "../../../../components/CeoComponent/charts/TurnoverTrendChart"
import DepartmentDistributionChart from "../../../../components/CeoComponent/charts/DepartmentDistributionChart"
import TrainingBudgetCard from "../../../../components/CeoComponent/charts/TrainingBudgetCard"
import HrMetricsCards from "../../../../components/CeoComponent/charts/HrMetricsCards"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function CeoHrPage() {
  const [hrData, setHrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showHireForm, setShowHireForm] = useState(false)
  const [error, setError] = useState(null)

  // Demo data for charts (keeping as requested)
  const recruitmentPipeline = [
    { stage: "Applications", count: 245 },
    { stage: "Screening", count: 89 },
    { stage: "Interviews", count: 34 },
    { stage: "Final Round", count: 12 },
    { stage: "Offers", count: 8 },
  ]

  const departmentDistribution = [
    { name: "Engineering", value: 45, color: "#3b82f6" },
    { name: "Sales", value: 28, color: "#10b981" },
    { name: "Marketing", value: 18, color: "#f59e0b" },
    { name: "Operations", value: 22, color: "#ef4444" },
    { name: "HR", value: 14, color: "#8b5cf6" },
  ]

  const monthlyTurnover = [
    { month: "Jul", rate: 8.2 },
    { month: "Aug", rate: 11.5 },
    { month: "Sep", rate: 9.8 },
    { month: "Oct", rate: 13.2 },
    { month: "Nov", rate: 12.5 },
    { month: "Dec", rate: 10.1 },
  ]

  const fetchHrData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/ceo/hr/dashboard`, {
        method: "GET",
        credentials: "include", 
      });

      if (response.ok) {
        const json = await response.json();

        console.log("Fetched HR Data:", json);
        setHrData(json.data); 
      }
      else if (response.status === 404) {
        setHrData({ hrEmployees: [], metrics: null });
      } else {
        throw new Error("Failed to fetch HR data");
      }
    } catch (err) {
      console.error("Error fetching HR data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log("useEffect triggered - fetching HR data...");
    fetchHrData();
  }, []);


  const handleHireSuccess = (newHr) => {
    fetchHrData() // Refresh data after successful hire
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <CeoSidebar activeSection="hr" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading HR dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <CeoSidebar activeSection="hr" />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchHrData}>Try Again</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!hrData?.hrEmployees || hrData.hrEmployees.length === 0) {
    return (
      <div className="flex min-h-screen bg-background">
        <CeoSidebar activeSection="hr" />
        <main className="flex-1 p-4 md:p-6">
          <NoHrState onHireClick={() => setShowHireForm(true)} />
          {showHireForm && <HireHrForm onClose={() => setShowHireForm(false)} onSuccess={handleHireSuccess} />}
        </main>
      </div>
    )
  }

  const hrMetrics = hrData.metrics || {
    totalEmployees: 0,
    newHires: 0,
    turnoverRate: 0,
    avgSalary: 0,
    trainingBudget: 45000,
    trainingSpent: 32000,
    attendanceRate: 0,
    satisfactionScore: 0,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CeoSidebar activeSection="hr" />
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* HR Department Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Human Resources</h1>
            <p className="text-muted-foreground">Employee management and organizational development</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant="default" className="bg-blue-500 w-fit">
              <Users className="w-4 h-4 mr-1" />
              {hrData.hrEmployees.length} HR Staff
            </Badge>
            <Button onClick={() => setShowHireForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Hire New HR
            </Button>
          </div>
        </div>

        {/* Key HR Metrics */}
        <HrMetricsCards hrMetrics={hrMetrics} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recruitment Pipeline */}
          <RecruitmentPipelineChart data={recruitmentPipeline} />

          {/* Turnover Trend */}
          <TurnoverTrendChart data={monthlyTurnover} />
        </div>

        {/* Department Distribution & Training */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <DepartmentDistributionChart data={departmentDistribution} />

          {/* Training Budget */}
          <TrainingBudgetCard hrMetrics={hrMetrics} />
        </div>

        {/* HR Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>HR Team Members</CardTitle>
            <CardDescription>Current HR staff and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hrData.hrEmployees.map((employee, index) => (
                <div key={employee.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={employee.photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.designation}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined: {new Date(employee.joiningDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                    <div className="text-xs text-muted-foreground">{employee.employeeType}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hire HR Form Modal */}
        {showHireForm && <HireHrForm onClose={() => setShowHireForm(false)} onSuccess={handleHireSuccess} />}
      </main>
    </div>
  )
}