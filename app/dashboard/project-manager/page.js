// app/dashboard/projectmanager/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import DashboardStats from "@/components/PM_Component/dashboard-stats";
import FarmerEnrollmentChart from "@/components/PM_Component/farmer-enrollment-chart";
import PaymentStatusChart from "@/components/PM_Component/payment-status-chart";
import StepCompletionChart from "@/components/PM_Component/step-completion-chart";
import RecentFarmersTable from "@/components/PM_Component/recent-farmers-table";
import PendingActions from "@/components/PM_Component/pending-actions";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProjectManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/project-manager/dashboard`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllFarmers = () => {
    router.push("/dashboard/project-manager/farmers");
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Project Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor farmer enrollment, payments, and project progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleViewAllFarmers}>
              <Users className="w-4 h-4 mr-2" />
              View All Farmers
            </Button>
            <Button variant="outline" onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats data={dashboardData?.stats} />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FarmerEnrollmentChart data={dashboardData?.enrollmentChart} />
          <PaymentStatusChart data={dashboardData?.paymentChart} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StepCompletionChart data={dashboardData?.stepCompletionChart} />
          <PendingActions data={dashboardData?.pendingActions} />
        </div>

        {/* Recent Farmers Table */}
        <RecentFarmersTable
          data={dashboardData?.recentFarmers}
          onViewAll={handleViewAllFarmers}
        />
      </div>
    </DashboardLayout>
  );
}