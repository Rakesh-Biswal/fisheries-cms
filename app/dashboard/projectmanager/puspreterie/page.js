import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wheat, TrendingUp, Calendar, Package } from "lucide-react"

export default function PuspreteriePage() {
  const crops = [
    {
      id: 1,
      name: "Wheat",
      variety: "HD-2967",
      area: "25 acres",
      status: "Growing",
      yield: "45 quintals/acre",
      harvestDate: "2024-04-15",
    },
    {
      id: 2,
      name: "Rice",
      variety: "Basmati-370",
      area: "30 acres",
      status: "Harvested",
      yield: "38 quintals/acre",
      harvestDate: "2024-03-20",
    },
    {
      id: 3,
      name: "Corn",
      variety: "Pioneer-3394",
      area: "20 acres",
      status: "Planted",
      yield: "Expected 42 quintals/acre",
      harvestDate: "2024-05-10",
    },
    {
      id: 4,
      name: "Soybean",
      variety: "JS-335",
      area: "15 acres",
      status: "Growing",
      yield: "18 quintals/acre",
      harvestDate: "2024-04-25",
    },
  ]

  return (
    <DashboardLayout title="Puspreterie">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Wheat className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Crops</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Area</p>
                  <p className="text-2xl font-bold">90 acres</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Yield</p>
                  <p className="text-2xl font-bold">36 Q/A</p>
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
                  <p className="text-sm text-gray-600">Next Harvest</p>
                  <p className="text-2xl font-bold">15 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crop Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Crop Management</CardTitle>
              <Button>Add New Crop</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Crop Name</th>
                    <th className="text-left p-4">Variety</th>
                    <th className="text-left p-4">Area</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Yield</th>
                    <th className="text-left p-4">Harvest Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{crop.name}</td>
                      <td className="p-4">{crop.variety}</td>
                      <td className="p-4">{crop.area}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            crop.status === "Growing"
                              ? "default"
                              : crop.status === "Harvested"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            crop.status === "Growing"
                              ? "bg-green-100 text-green-800"
                              : crop.status === "Harvested"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {crop.status}
                        </Badge>
                      </td>
                      <td className="p-4">{crop.yield}</td>
                      <td className="p-4">{crop.harvestDate}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
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
