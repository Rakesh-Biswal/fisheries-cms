"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Download,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Car,
  Utensils,
  Plane,
  Wifi,
} from "lucide-react"

const reimbursementRequests = [
  {
    id: 1,
    employee: "David Chen",
    avatar: "/professional-man.png",
    department: "Engineering",
    type: "Travel",
    description: "Client meeting in Mumbai",
    amount: 15750,
    submittedDate: "2024-01-12",
    status: "Pending",
    receipts: 3,
    icon: Plane,
    color: "bg-blue-500",
  },
  {
    id: 2,
    employee: "Sarah Williams",
    avatar: "/professional-woman-diverse.png",
    department: "Design",
    type: "Meals",
    description: "Team lunch during project meeting",
    amount: 2500,
    submittedDate: "2024-01-14",
    status: "Approved",
    receipts: 1,
    icon: Utensils,
    color: "bg-green-500",
  },
  {
    id: 3,
    employee: "James Rodriguez",
    avatar: "/professional-man.png",
    department: "Operations",
    type: "Transportation",
    description: "Uber rides for office visits",
    amount: 1200,
    submittedDate: "2024-01-10",
    status: "Rejected",
    receipts: 4,
    icon: Car,
    color: "bg-orange-500",
  },
  {
    id: 4,
    employee: "Barbara Sales",
    avatar: "/professional-woman-diverse.png",
    department: "Finance",
    type: "Internet",
    description: "Home internet for remote work",
    amount: 1800,
    submittedDate: "2024-01-08",
    status: "Processing",
    receipts: 1,
    icon: Wifi,
    color: "bg-purple-500",
  },
  {
    id: 5,
    employee: "Mike Wilson",
    avatar: "/professional-man.png",
    department: "HR",
    type: "Office Supplies",
    description: "Stationery and printing materials",
    amount: 3200,
    submittedDate: "2024-01-11",
    status: "Approved",
    receipts: 2,
    icon: FileText,
    color: "bg-indigo-500",
  },
]

const monthlyReimbursements = [
  { month: "Aug", amount: 125000, requests: 45 },
  { month: "Sep", amount: 142000, requests: 52 },
  { month: "Oct", amount: 138000, requests: 48 },
  { month: "Nov", amount: 156000, requests: 58 },
  { month: "Dec", amount: 189000, requests: 67 },
  { month: "Jan", amount: 165000, requests: 55 },
]

const reimbursementByType = [
  { name: "Travel", value: 45000, color: "#3B82F6", percentage: 27.3 },
  { name: "Meals", value: 32000, color: "#10B981", percentage: 19.4 },
  { name: "Transportation", value: 28000, color: "#F59E0B", percentage: 17.0 },
  { name: "Office Supplies", value: 25000, color: "#8B5CF6", percentage: 15.2 },
  { name: "Internet", value: 20000, color: "#EF4444", percentage: 12.1 },
  { name: "Others", value: 15000, color: "#6B7280", percentage: 9.1 },
]

const reimbursementStats = {
  totalRequests: 55,
  totalAmount: 165000,
  pendingRequests: 12,
  approvedRequests: 35,
  rejectedRequests: 8,
  averageAmount: 3000,
  processingTime: 3.2,
}

const departmentReimbursements = [
  { department: "Engineering", amount: 45000, requests: 15, avgAmount: 3000 },
  { department: "Marketing", amount: 32000, requests: 12, avgAmount: 2667 },
  { department: "Sales", amount: 28000, requests: 10, avgAmount: 2800 },
  { department: "Operations", amount: 25000, requests: 8, avgAmount: 3125 },
  { department: "Finance", amount: 20000, requests: 6, avgAmount: 3333 },
  { department: "Design", amount: 15000, requests: 4, avgAmount: 3750 },
]

export default function ReimbursementPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedMonth, setSelectedMonth] = useState("January 2024")

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Processing":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reimbursement Management</h1>
          <p className="text-gray-600">Track and manage employee expense reimbursements</p>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("All")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{reimbursementStats.totalRequests}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(reimbursementStats.totalAmount)}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{reimbursementStats.pendingRequests}</p>
                <p className="text-sm text-yellow-600">Awaiting approval</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-3xl font-bold text-purple-600">{reimbursementStats.processingTime}</p>
                <p className="text-sm text-purple-600">Days</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reimbursement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyReimbursements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => [formatCurrency(value), "Amount"]} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reimbursement by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Reimbursement by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={reimbursementByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reimbursementByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {reimbursementByType.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Reimbursements */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Reimbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentReimbursements.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{dept.department.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.department}</h4>
                    <p className="text-sm text-gray-500">{dept.requests} requests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(dept.amount)}</p>
                    <p className="text-xs text-gray-500">Total amount</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{formatCurrency(dept.avgAmount)}</p>
                    <p className="text-xs text-gray-500">Avg per request</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reimbursement Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reimbursement Requests</CardTitle>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reimbursementRequests.map((request) => {
              const Icon = request.icon
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 ${request.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {request.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{request.type}</h4>
                        <Badge variant="outline">{request.department}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{request.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {request.employee}</span>
                        <span>Submitted: {new Date(request.submittedDate).toLocaleDateString("en-IN")}</span>
                        <span>{request.receipts} receipts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(request.amount)}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Request
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
