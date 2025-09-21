"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { dashboardData } from "@/lib/PM_Lib/data";

export default function ProductionCostsChart() {
  const data = dashboardData.productionCosts;

  const totalProduction = data[data.length - 1]?.production || 0;
  const totalOverhead = data[data.length - 1]?.overhead || 0;
  const maintenanceCosts = data[data.length - 1]?.maintenance || 0;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Production Costs
        </CardTitle>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Total Production</span>
            <div className="font-semibold">
              ₹{(totalProduction / 100).toFixed(2)} PA
            </div>
          </div>
          <div>
            <span className="text-gray-600">Total Overhead</span>
            <div className="font-semibold">
              ₹{(totalOverhead / 100).toFixed(2)} PA
            </div>
          </div>
          <div>
            <span className="text-gray-600">Maintenance costs</span>
            <div className="font-semibold">
              ₹{maintenanceCosts.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Area
                type="monotone"
                dataKey="production"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="overhead"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last 30 days
        </div>
      </CardContent>
    </Card>
  );
}
