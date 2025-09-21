import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Phone, Mail, Building } from "lucide-react"

export default function ClientsPage() {
  const clients = [
    {
      id: 1,
      name: "Green Valley Co-op",
      contact: "+91 98765 43210",
      email: "contact@greenvalley.com",
      type: "Wholesale",
      orders: 15,
      revenue: "₹2,50,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Fresh Mart Ltd",
      contact: "+91 87654 32109",
      email: "orders@freshmart.com",
      type: "Retail",
      orders: 8,
      revenue: "₹1,20,000",
      status: "Active",
    },
    {
      id: 3,
      name: "Organic Foods Inc",
      contact: "+91 76543 21098",
      email: "procurement@organic.com",
      type: "Wholesale",
      orders: 22,
      revenue: "₹4,80,000",
      status: "Premium",
    },
    {
      id: 4,
      name: "Local Market",
      contact: "+91 65432 10987",
      email: "info@localmarket.com",
      type: "Retail",
      orders: 5,
      revenue: "₹75,000",
      status: "New",
    },
  ]

  return (
    <DashboardLayout title="Clients">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">50</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₹9,25,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Management</CardTitle>
              <Button>Add New Client</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Client Name</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Orders</th>
                    <th className="text-left p-4">Revenue</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.contact}
                        </div>
                      </td>
                      <td className="p-4">{client.type}</td>
                      <td className="p-4">{client.orders}</td>
                      <td className="p-4 font-medium">{client.revenue}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            client.status === "Premium"
                              ? "default"
                              : client.status === "Active"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            client.status === "Premium"
                              ? "bg-purple-100 text-purple-800"
                              : client.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Contact
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
