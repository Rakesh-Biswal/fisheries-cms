"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator,
  FileText,
  Send,
} from "lucide-react"

const payrollData = [
  {
    id: 1,
    employee: "Rob Mount",
    avatar: "/professional-man.png",
    employeeId: "EMP001",
    department: "Engineering",
    basicSalary: 1000000,
    allowances: 200000,
    deductions: 150000,
    netSalary: 1050000,
    status: "Processed",
    payDate: "2024-01-31",
  },
  {
    id: 2,
    employee: "Jill Turner",
    avatar: "/professional-woman-diverse.png",
    employeeId: "EMP002",
    department: "Marketing",
    basicSalary: 850000,
    allowances: 170000,
    deductions: 120000,
    netSalary: 900000,
    status: "Processed",
    payDate: "2024-01-31",
  },
  {
    id: 3,
    employee: "Tanya Johnson",
    avatar: "/professional-woman-diverse.png",
    employeeId: "EMP003",
    department: "Sales",
    basicSalary: 700000,
    allowances: 140000,
    deductions: 100000,
    netSalary: 740000,
    status: "Pending",
    payDate: "2024-01-31",
  },
  {
    id: 4,
    employee: "Mike Wilson",
    avatar: "/professional-man.png",
    employeeId: "EMP004",
    department: "HR",
    basicSalary: 800000,
    allowances: 160000,
    deductions: 110000,
    netSalary: 850000,
    status: "Processed",
    payDate: "2024-01-31",
  },
  {
    id: 5,
    employee: "Barbara Sales",
    avatar: "/professional-woman-diverse.png",
    employeeId: "EMP005",
    department: "Finance",
    basicSalary: 950000,
    allowances: 190000,
    deductions: 140000,
    netSalary: 1000000,
    status: "Review",
    payDate: "2024-01-31",
  },
]

const monthlyPayrollTrend = [
  { month: "Aug", amount: 18500000, employees: 195 },
  { month: "Sep", amount: 19200000, employees: 198 },
  { month: "Oct", amount: 19800000, employees: 200 },
  { month: "Nov", amount: 20100000, employees: 202 },
  { month: "Dec", amount: 20500000, employees: 205 },
  { month: "Jan", amount: 21200000, employees: 205 },
]

const departmentPayroll = [
  { department: "Engineering", employees: 45, totalCost: 5400000, avgSalary: 1200000 },
  { department: "Marketing", employees: 28, totalCost: 2520000, avgSalary: 900000 },
  { department: "Sales", employees: 32, totalCost: 2560000, avgSalary: 800000 },
  { department: "HR", employees: 12, totalCost: 1080000, avgSalary: 900000 },
  { department: "Finance", employees: 18, totalCost: 1980000, avgSalary: 1100000 },
  { department: "Design", employees: 15, totalCost: 1350000, avgSalary: 900000 },
  { department: "Operations", employees: 22, totalCost: 2200000, avgSalary: 1000000 },
]

const payrollSummary = {
  totalEmployees: 205,
  totalPayroll: 21200000,
  processedPayrolls: 180,
  pendingPayrolls: 25,
  averageSalary: 1034146,
  totalDeductions: 2650000,
  totalAllowances: 3540000,
}

const taxBreakdown = [
  { type: "Income Tax", amount: 1580000, percentage: 59.6 },
  { type: "Provident Fund", amount: 680000, percentage: 25.7 },
  { type: "ESI", amount: 240000, percentage: 9.1 },
  { type: "Professional Tax", amount: 150000, percentage: 5.7 },
]

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2024")
  const [selectedFilter, setSelectedFilter] = useState("All")

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Review":
        return "bg-blue-100 text-blue-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "Failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const formatFullCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">Manage employee salaries, deductions, and payroll processing</p>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedMonth}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedMonth("January 2024")}>January 2024</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedMonth("December 2023")}>December 2023</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedMonth("November 2023")}>November 2023</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(payrollSummary.totalPayroll)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.4% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-3xl font-bold text-gray-900">{payrollSummary.totalEmployees}</p>
                <p className="text-sm text-gray-500">Active payroll</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-3xl font-bold text-green-600">{payrollSummary.processedPayrolls}</p>
                <p className="text-sm text-green-600">
                  {((payrollSummary.processedPayrolls / payrollSummary.totalEmployees) * 100).toFixed(1)}% complete
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{payrollSummary.pendingPayrolls}</p>
                <p className="text-sm text-yellow-600">Requires attention</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payroll Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payroll Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPayrollTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(value), "Payroll Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tax Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Tax & Deductions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxBreakdown.map((tax) => (
                <div key={tax.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tax.type}</span>
                    <span className="text-sm text-gray-500">
                      {formatFullCurrency(tax.amount)} ({tax.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${tax.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between font-medium">
                  <span>Total Deductions</span>
                  <span>{formatCurrency(payrollSummary.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Payroll */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Average Salary</TableHead>
                  <TableHead>% of Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentPayroll.map((dept) => (
                  <TableRow key={dept.department}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell>{dept.employees}</TableCell>
                    <TableCell className="font-medium text-green-600">{formatCurrency(dept.totalCost)}</TableCell>
                    <TableCell>{formatCurrency(dept.avgSalary)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(dept.totalCost / payrollSummary.totalPayroll) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {((dept.totalCost / payrollSummary.totalPayroll) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Export Report</DropdownMenuItem>
                          <DropdownMenuItem>Salary Analysis</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Payroll Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Payroll Details - {selectedMonth}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Payslips
            </Button>
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Payslips
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    <TableCell>{formatFullCurrency(employee.basicSalary)}</TableCell>
                    <TableCell className="text-green-600">{formatFullCurrency(employee.allowances)}</TableCell>
                    <TableCell className="text-red-600">{formatFullCurrency(employee.deductions)}</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {formatFullCurrency(employee.netSalary)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(employee.status)}
                        <Badge variant="outline" className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Payslip</DropdownMenuItem>
                          <DropdownMenuItem>Edit Salary</DropdownMenuItem>
                          <DropdownMenuItem>Send Payslip</DropdownMenuItem>
                          <DropdownMenuItem>Salary History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
