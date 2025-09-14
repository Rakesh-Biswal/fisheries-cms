"use client"

import { Card, CardContent, CardHeader, CardTitle } from ".././ui/card"
import { Button } from ".././"
import { Badge } from ".././ui/badge"
import { DollarSign, TrendingUp, Download, Calculator } from "lucide-react"

export default function HrPayroll() {
  const payrollData = [
    {
      id: 1,
      employee: "John Doe",
      salary: "$5,500",
      bonus: "$500",
      deductions: "$200",
      net: "$5,800",
      status: "Processed",
    },
    {
      id: 2,
      employee: "Jane Smith",
      salary: "$4,800",
      bonus: "$300",
      deductions: "$180",
      net: "$4,920",
      status: "Pending",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      salary: "$6,200",
      bonus: "$700",
      deductions: "$250",
      net: "$6,650",
      status: "Processed",
    },
    {
      id: 4,
      employee: "Sarah Wilson",
      salary: "$5,000",
      bonus: "$400",
      deductions: "$190",
      net: "$5,210",
      status: "Processing",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">$1.2M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$98K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">185</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Base Salary</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Bonus</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Deductions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Net Pay</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{record.employee}</td>
                    <td className="py-3 px-4 text-gray-600">{record.salary}</td>
                    <td className="py-3 px-4 text-green-600">{record.bonus}</td>
                    <td className="py-3 px-4 text-red-600">{record.deductions}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{record.net}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          record.status === "Processed"
                            ? "default"
                            : record.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          record.status === "Processed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
