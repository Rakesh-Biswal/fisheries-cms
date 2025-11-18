import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Wrench, Calendar, TrendingUp } from "lucide-react"

export default function EquipmentPage() {
  const equipment = [
    {
      id: 1,
      name: "Tractor JD-5075E",
      type: "Tractor",
      status: "Active",
      condition: "Good",
      lastMaintenance: "2024-02-15",
      nextMaintenance: "2024-04-15",
      value: "₹12,50,000",
    },
    {
      id: 2,
      name: "Irrigation Pump IP-200",
      type: "Pump",
      status: "Active",
      condition: "Excellent",
      lastMaintenance: "2024-03-01",
      nextMaintenance: "2024-05-01",
      value: "₹85,000",
    },
    {
      id: 3,
      name: "Harvester MF-9500",
      type: "Harvester",
      status: "Maintenance",
      condition: "Fair",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-03-25",
      value: "₹25,00,000",
    },
    {
      id: 4,
      name: "Sprayer SP-400",
      type: "Sprayer",
      status: "Active",
      condition: "Good",
      lastMaintenance: "2024-02-28",
      nextMaintenance: "2024-04-28",
      value: "₹45,000",
    },
  ]

  return (
    <DashboardLayout title="Equipment">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Equipment</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Maintenance</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">₹38.8L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Equipment Management</CardTitle>
              <Button>Add Equipment</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Equipment Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Condition</th>
                    <th className="text-left p-4">Last Maintenance</th>
                    <th className="text-left p-4">Next Maintenance</th>
                    <th className="text-left p-4">Value</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">{item.type}</td>
                      <td className="p-4">
                        <Badge
                          variant={item.status === "Active" ? "default" : "secondary"}
                          className={
                            item.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            item.condition === "Excellent"
                              ? "default"
                              : item.condition === "Good"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            item.condition === "Excellent"
                              ? "bg-green-100 text-green-800"
                              : item.condition === "Good"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {item.condition}
                        </Badge>
                      </td>
                      <td className="p-4">{item.lastMaintenance}</td>
                      <td className="p-4">{item.nextMaintenance}</td>
                      <td className="p-4 font-medium">{item.value}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Maintain
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
