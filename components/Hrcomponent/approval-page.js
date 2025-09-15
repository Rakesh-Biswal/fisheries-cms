"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  FileText,
  UserPlus,
  Briefcase,
  AlertCircle,
} from "lucide-react"

const pendingApprovals = [
  {
    id: 1,
    type: "Leave Request",
    employee: "Sarah Williams",
    avatar: "/professional-woman-diverse.png",
    department: "Design",
    details: "Annual Leave - 5 days",
    dateRange: "Jan 20-24, 2024",
    submittedDate: "2024-01-10",
    priority: "Medium",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    id: 2,
    type: "Expense Claim",
    employee: "David Chen",
    avatar: "/professional-man.png",
    department: "Engineering",
    details: "Travel expenses for client meeting",
    amount: "₹15,750",
    submittedDate: "2024-01-12",
    priority: "High",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    id: 3,
    type: "Document Review",
    employee: "Mike Wilson",
    avatar: "/professional-man.png",
    department: "HR",
    details: "Updated Employee Handbook",
    submittedDate: "2024-01-08",
    priority: "Low",
    icon: FileText,
    color: "bg-purple-500",
  },
  {
    id: 4,
    type: "Recruitment",
    employee: "Barbara Sales",
    avatar: "/professional-woman-diverse.png",
    department: "Finance",
    details: "New Financial Analyst position",
    submittedDate: "2024-01-05",
    priority: "High",
    icon: UserPlus,
    color: "bg-orange-500",
  },
  {
    id: 5,
    type: "Policy Change",
    employee: "James Rodriguez",
    avatar: "/professional-man.png",
    department: "Operations",
    details: "Remote work policy update",
    submittedDate: "2024-01-07",
    priority: "Medium",
    icon: Briefcase,
    color: "bg-indigo-500",
  },
]

const recentApprovals = [
  {
    id: 1,
    type: "Leave Request",
    employee: "Rob Mount",
    action: "Approved",
    date: "2024-01-14",
    approver: "Melanie Stone",
  },
  {
    id: 2,
    type: "Expense Claim",
    employee: "Jill Turner",
    action: "Approved",
    date: "2024-01-13",
    approver: "Melanie Stone",
  },
  {
    id: 3,
    type: "Overtime Request",
    employee: "Tanya Johnson",
    action: "Rejected",
    date: "2024-01-12",
    approver: "Melanie Stone",
  },
]

const approvalStats = [
  {
    title: "Pending Approvals",
    count: 12,
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
  },
  {
    title: "Approved Today",
    count: 8,
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-600",
  },
  {
    title: "Rejected Today",
    count: 2,
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600",
  },
  {
    title: "Overdue",
    count: 3,
    icon: AlertCircle,
    color: "bg-orange-500",
    textColor: "text-orange-600",
  },
]

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState(pendingApprovals)

  const handleApproval = (id, action) => {
    setApprovals((prev) => prev.filter((approval) => approval.id !== id))
    // In a real app, you would make an API call here
    console.log(`${action} approval with ID: ${id}`)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Center</h1>
          <p className="text-gray-600">Review and manage pending approvals across your organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            View All History
          </Button>
          <Button size="sm">Bulk Actions</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {approvalStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.count}</p>
                  </div>
                  <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals ({approvals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvals.map((approval) => {
              const Icon = approval.icon
              return (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 ${approval.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={approval.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {approval.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{approval.type}</h4>
                        <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{approval.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {approval.employee}</span>
                        <span>Dept: {approval.department}</span>
                        <span>Submitted: {new Date(approval.submittedDate).toLocaleDateString("en-IN")}</span>
                        {approval.dateRange && <span>Dates: {approval.dateRange}</span>}
                        {approval.amount && <span>Amount: {approval.amount}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* View details */
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleApproval(approval.id, "Rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproval(approval.id, "Approved")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approval History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.type}</TableCell>
                    <TableCell>{approval.employee}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(approval.action)}>
                        {approval.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(approval.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{approval.approver}</TableCell>
                    <TableCell>
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
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
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
