import DashboardLayout from "@/components/TL_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Phone, Mail, Package } from "lucide-react"

export default function SuppliersPage() {
  const suppliers = [
    {
      id: 1,
      name: "AgriSeeds Co.",
      contact: "+91 98765 43210",
      email: "sales@agriseeds.com",
      category: "Seeds",
      orders: 12,
      amount: "₹1,85,000",
      status: "Active",
      rating: 4.8,
    },
    {
      id: 2,
      name: "FertilizerMax Ltd",
      contact: "+91 87654 32109",
      email: "orders@fertilizermax.com",
      category: "Fertilizers",
      orders: 8,
      amount: "₹2,40,000",
      status: "Active",
      rating: 4.5,
    },
    {
      id: 3,
      name: "PestiCare Solutions",
      contact: "+91 76543 21098",
      email: "info@pesticare.com",
      category: "Pesticides",
      orders: 15,
      amount: "₹1,95,000",
      status: "Premium",
      rating: 4.9,
    },
    {
      id: 4,
      name: "ToolMart Industries",
      contact: "+91 65432 10987",
      email: "support@toolmart.com",
      category: "Tools",
      orders: 6,
      amount: "₹85,000",
      status: "New",
      rating: 4.2,
    },
  ]

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Suppliers</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Suppliers</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Truck className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">41</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">₹7,05,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Management Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Supplier Management</CardTitle>
              <Button>Add New Supplier</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Supplier Name</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Orders</th>
                    <th className="text-left p-4">Total Amount</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Rating</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {supplier.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {supplier.contact}
                        </div>
                      </td>
                      <td className="p-4">{supplier.category}</td>
                      <td className="p-4">{supplier.orders}</td>
                      <td className="p-4 font-medium">{supplier.amount}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            supplier.status === "Premium"
                              ? "default"
                              : supplier.status === "Active"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            supplier.status === "Premium"
                              ? "bg-purple-100 text-purple-800"
                              : supplier.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {supplier.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Order
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
