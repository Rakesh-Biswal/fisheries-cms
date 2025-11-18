import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

export default function MaintenancePage() {
  const maintenanceTasks = [
    {
      id: 1,
      equipment: "Tractor - JD-5075E",
      task: "Engine Oil Change",
      priority: "High",
      status: "Pending",
      dueDate: "2024-03-25",
      assignedTo: "Ramesh Kumar",
      cost: "₹2,500",
    },
    {
      id: 2,
      equipment: "Irrigation Pump - IP-200",
      task: "Filter Replacement",
      priority: "Medium",
      status: "In Progress",
      dueDate: "2024-03-28",
      assignedTo: "Suresh Singh",
      cost: "₹1,200",
    },
    {
      id: 3,
      equipment: "Harvester - MF-9500",
      task: "Blade Sharpening",
      priority: "Low",
      status: "Completed",
      dueDate: "2024-03-20",
      assignedTo: "Vikash Yadav",
      cost: "₹800",
    },
    {
      id: 4,
      equipment: "Sprayer - SP-400",
      task: "Nozzle Cleaning",
      priority: "High",
      status: "Overdue",
      dueDate: "2024-03-22",
      assignedTo: "Rajesh Patel",
      cost: "₹500",
    },
  ]

  return (
    <DashboardLayout title="Maintenance">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Tasks Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Maintenance Tasks</CardTitle>
              <Button>Schedule Maintenance</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Equipment</th>
                    <th className="text-left p-4">Task</th>
                    <th className="text-left p-4">Priority</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Due Date</th>
                    <th className="text-left p-4">Assigned To</th>
                    <th className="text-left p-4">Cost</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{task.equipment}</td>
                      <td className="p-4">{task.task}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            task.priority === "High"
                              ? "destructive"
                              : task.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                          className={
                            task.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            task.status === "Completed"
                              ? "default"
                              : task.status === "Overdue"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            task.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "Overdue"
                                ? "bg-red-100 text-red-800"
                                : task.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          {task.status}
                        </Badge>
                      </td>
                      <td className="p-4">{task.dueDate}</td>
                      <td className="p-4">{task.assignedTo}</td>
                      <td className="p-4 font-medium">{task.cost}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
