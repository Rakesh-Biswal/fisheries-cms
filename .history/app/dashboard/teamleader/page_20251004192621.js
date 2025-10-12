// Your updated dashboard page
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/TL_Component/dashboard-layout";
import DashboardStats from "@/components/TL_Component/dashboard-stats";
import MonthlyYieldChart from "@/components/TL_Component/monthly-yield-chart";
import FieldHealthChart from "@/components/TL_Component/field-health-chart";
import CropStatusChart from "@/components/TL_Component/crop-status-chart";
import ProductionCostsChart from "@/components/TL_Component/production-costs-chart";
import CropCycleTasks from "@/components/TL_Component/crop-cycle-tasks";
import FarmLocations from "@/components/TL_Component/farm-locations";
import DataManagementPanel from "@/components/TL_Component/data-management-panel";
import MeetingSection from "@/components/TL_Component/meeting-section"; // Import the new component

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6" key={refreshKey}>
        <DashboardStats />

        {/* Add Meeting Section in the grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <MeetingSection />
          </div>
          <div className="xl:col-span-2">
            <MonthlyYieldChart />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <FieldHealthChart />
          </div>
          <div>
            <ProductionCostsChart />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <CropStatusChart />
          </div>
          <div>
            <CropCycleTasks />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <FarmLocations />
          </div>
        </div>
      </div>

      {/* Interactive data management panel */}
      <DataManagementPanel onDataUpdate={handleDataUpdate} />
    </DashboardLayout>
  );
}