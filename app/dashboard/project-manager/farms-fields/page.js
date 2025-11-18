import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Droplets, Thermometer, Wind } from "lucide-react"

export default function FarmsFieldsPage() {
  const fields = [
    {
      id: 1,
      name: "North Field",
      area: "25 acres",
      crop: "Wheat",
      soilType: "Loamy",
      irrigation: "Drip",
      status: "Healthy",
      lastWatered: "2024-03-20",
    },
    {
      id: 2,
      name: "South Field",
      area: "30 acres",
      crop: "Rice",
      soilType: "Clay",
      irrigation: "Flood",
      status: "Needs Attention",
      lastWatered: "2024-03-18",
    },
    {
      id: 3,
      name: "East Field",
      area: "20 acres",
      crop: "Corn",
      soilType: "Sandy",
      irrigation: "Sprinkler",
      status: "Healthy",
      lastWatered: "2024-03-21",
    },
    {
      id: 4,
      name: "West Field",
      area: "15 acres",
      crop: "Soybean",
      soilType: "Loamy",
      irrigation: "Drip",
      status: "Excellent",
      lastWatered: "2024-03-22",
    },
  ]

  return (
    <DashboardLayout title="Farms & Fields">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Fields</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Irrigation Active</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Thermometer className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Temperature</p>
                  <p className="text-2xl font-bold">28°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Wind className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-2xl font-bold">65%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Field Management</CardTitle>
              <Button>Add New Field</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Field Name</th>
                    <th className="text-left p-4">Area</th>
                    <th className="text-left p-4">Current Crop</th>
                    <th className="text-left p-4">Soil Type</th>
                    <th className="text-left p-4">Irrigation</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Last Watered</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{field.name}</td>
                      <td className="p-4">{field.area}</td>
                      <td className="p-4">{field.crop}</td>
                      <td className="p-4">{field.soilType}</td>
                      <td className="p-4">{field.irrigation}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            field.status === "Excellent"
                              ? "default"
                              : field.status === "Healthy"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            field.status === "Excellent"
                              ? "bg-green-100 text-green-800"
                              : field.status === "Healthy"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {field.status}
                        </Badge>
                      </td>
                      <td className="p-4">{field.lastWatered}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Monitor
                          </Button>
                          <Button variant="outline" size="sm">
                            Irrigate
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
