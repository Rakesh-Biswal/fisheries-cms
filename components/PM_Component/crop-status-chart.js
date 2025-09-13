"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardData } from "@/lib/PM_Lib/data";

export default function CropStatusChart() {
  const { cropStatus } = dashboardData
  const growingPercentage = (cropStatus.growing / cropStatus.total) * 100
  const occupiedPercentage = (cropStatus.occupied / cropStatus.total) * 100

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Crop Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${(growingPercentage / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{cropStatus.total}</div>
                <div className="text-sm text-gray-600">Units</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Growing</span>
            </div>
            <span className="text-sm font-medium">{cropStatus.growing}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <span className="text-sm font-medium">{cropStatus.occupied}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Vacant</span>
            </div>
            <span className="text-sm font-medium">{cropStatus.vacant}</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">Last 7 days</div>
      </CardContent>
    </Card>
  )
}
