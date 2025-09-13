"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { dashboardData } from "@/lib/PM_Lib/data";

export default function FieldHealthChart() {
  const data = dashboardData.fieldHealthIndex;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Field Health Index
        </CardTitle>
        <div className="text-sm text-gray-600">₹59,001 line</div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />

              {/* ✅ Tooltip added */}
              <Tooltip
                cursor={{
                  stroke: "#3b82f6",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
            Catwalks
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
            Ivy watering
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
            Nutrient period
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
            West
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
            Moons
          </span>
        </div>
      </CardContent>
    </Card>
  );
}