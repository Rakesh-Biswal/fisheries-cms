"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, Download, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone } from "lucide-react"

const employeesData = [
  {
    id: 1,
    name: "Rob Mount",
    email: "rob.mount@company.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    position: "Senior Developer",
    salary: "₹12,00,000",
    joinDate: "2019-03-15",
    status: "Active",
    avatar: "/professional-man.png",
  },
  {
    id: 2,
    name: "Jill Turner",
    email: "jill.turner@company.com",
    phone: "+91 98765 43211",
    department: "Marketing",
    position: "Marketing Manager",
    salary: "₹10,50,000",
    joinDate: "2020-07-22",
    status: "Active",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 3,
    name: "Tanya Johnson",
    email: "tanya.johnson@company.com",
    phone: "+91 98765 43212",
    department: "Sales",
    position: "Sales Executive",
    salary: "₹8,00,000",
    joinDate: "2021-11-10",
    status: "Active",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    phone: "+91 98765 43213",
    department: "HR",
    position: "HR Specialist",
    salary: "₹9,50,000",
    joinDate: "2018-05-08",
    status: "Active",
    avatar: "/professional-man.png",
  },
  {
    id: 5,
    name: "Barbara Sales",
    email: "barbara.sales@company.com",
    phone: "+91 98765 43214",
    department: "Finance",
    position: "Financial Analyst",
    salary: "₹11,00,000",
    joinDate: "2020-01-20",
    status: "On Leave",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 6,
    name: "David Chen",
    email: "david.chen@company.com",
    phone: "+91 98765 43215",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: "₹13,50,000",
    joinDate: "2019-09-12",
    status: "Active",
    avatar: "/professional-man.png",
  },
  {
    id: 7,
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    phone: "+91 98765 43216",
    department: "Design",
    position: "UX Designer",
    salary: "₹9,00,000",
    joinDate: "2021-03-05",
    status: "Active",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 8,
    name: "James Rodriguez",
    email: "james.rodriguez@company.com",
    phone: "+91 98765 43217",
    department: "Operations",
    position: "Operations Manager",
    salary: "₹14,00,000",
    joinDate: "2017-12-01",
    status: "Active",
    avatar: "/professional-man.png",
  },
]

const departmentStats = [
  { name: "Engineering", count: 45, color: "bg-blue-500" },
  { name: "Marketing", count: 28, color: "bg-green-500" },
  { name: "Sales", count: 32, color: "bg-orange-500" },
  { name: "HR", count: 12, color: "bg-purple-500" },
  { name: "Finance", count: 18, color: "bg-red-500" },
  { name: "Design", count: 15, color: "bg-pink-500" },
  { name: "Operations", count: 22, color: "bg-indigo-500" },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [employees, setEmployees] = useState(employeesData)

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const totalEmployees = employees.length
  const activeEmployees = employees.filter((emp) => emp.status === "Active").length
  const onLeaveEmployees = employees.filter((emp) => emp.status === "On Leave").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">{totalEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">{activeEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-3xl font-bold text-orange-600">{onLeaveEmployees}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">{onLeaveEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="text-center">
                <div className={`w-16 h-16 ${dept.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{dept.count}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                <p className="text-xs text-gray-500">{dept.count} employees</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedDepartment("All")}>All Departments</DropdownMenuItem>
                {departmentStats.map((dept) => (
                  <DropdownMenuItem key={dept.name} onClick={() => setSelectedDepartment(dept.name)}>
                    {dept.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory ({filteredEmployees.length} employees)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">ID: EMP{employee.id.toString().padStart(3, "0")}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{employee.position}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-green-600">{employee.salary}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{new Date(employee.joinDate).toLocaleDateString("en-IN")}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.status === "Active" ? "default" : "secondary"}
                        className={employee.status === "Active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Employee
                          </DropdownMenuItem>
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
