"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { dashboardData } from "@/lib/PM_Lib/data";

export default function MonthlyYieldChart() {
  const data = dashboardData.monthlyYieldTrend;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
          Monthly Yield Trend
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              Rental Income: ₹{data[data.length - 1]?.rental.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>
              Expenses: ₹{data[data.length - 1]?.expenses.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />

              {/* ✅ Tooltip added */}
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
              />

              <Bar dataKey="rental" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
