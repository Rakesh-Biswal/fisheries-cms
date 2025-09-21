"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { dashboardData } from "@/lib/PM_Lib/data";

export default function DashboardStats() {
  const { currentHarvestValue, upcomingDeliveries, totalInputCosts } =
    dashboardData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Current Harvest Value */}
      <Card className="bg-white">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Current Harvest Value
            </h3>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              {currentHarvestValue.currency}
              {currentHarvestValue.value.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              {currentHarvestValue.currency}
              {currentHarvestValue.estimated.toLocaleString()} estimated this
              month
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deliveries */}
      <Card className="bg-white">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Upcoming Deliveries
            </h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              {upcomingDeliveries.count}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs lg:text-sm text-green-600">
                {upcomingDeliveries.currency}
                {upcomingDeliveries.value.toLocaleString()}
              </span>
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              {upcomingDeliveries.count} next {upcomingDeliveries.nextDays} days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Another Upcoming Deliveries Card */}
      <Card className="bg-white">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Upcoming Deliveries
            </h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              {upcomingDeliveries.count}
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              next {upcomingDeliveries.nextDays} days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Input Costs */}
      <Card className="bg-white">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Total Input Costs
            </h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              {totalInputCosts.currency}
              {totalInputCosts.value.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-xs lg:text-sm text-red-600">
                {totalInputCosts.percentage}%
              </span>
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              {totalInputCosts.period}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
