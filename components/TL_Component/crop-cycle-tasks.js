"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { dashboardData } from "@/lib/PM_Lib/data";

export default function CropCycleTasks() {
  const tasks = dashboardData.cropCycleTasks;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
          Crop Cycle Tasks
        </CardTitle>
        <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm">
          <span className="text-gray-600">Compliance (12)</span>
          <span className="text-gray-600 hidden sm:inline">Task To</span>
          <span className="text-gray-600 hidden sm:inline">Tax</span>
          <span className="text-gray-600 hidden sm:inline">Payments</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10" />
          </div>

          <div className="hidden lg:block">
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-4">Task Name</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Action</div>
                <div className="col-span-2"></div>
              </div>

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">
                      {task.taskName}
                    </div>
                    <div className="text-sm text-gray-500">{task.address}</div>
                  </div>
                  <div className="col-span-3">
                    <Badge
                      variant={
                        task.status === "Approved" ? "default" : "secondary"
                      }
                      className={
                        task.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <div className="col-span-3">
                    <Button variant="ghost" size="sm">
                      {task.action}
                    </Button>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {task.taskName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {task.address}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      task.status === "Approved" ? "default" : "secondary"
                    }
                    className={
                      task.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {task.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    {task.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last days</span>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
