"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  MoreHorizontal,
  MapPin,
  Eye,
  Edit,
  Search,
  RefreshCw,
  User
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HRAttendanceManagementPage() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updateStatus, setUpdateStatus] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        department: selectedDepartment,
        status: selectedStatus
      })

      const response = await fetch(`${API_URL}/api/hr/attendance-management/pending-requests?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setPendingRequests(data.data)
      } else {
        throw new Error('Failed to fetch pending requests')
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
      toast.error('Failed to load pending requests')
    }
  }

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/attendance-management/employees`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees(data.data)
      } else {
        throw new Error('Failed to fetch employees')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Failed to load employees list')
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedDate, selectedDepartment, selectedStatus])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchPendingRequests(), fetchEmployees()])
    setLoading(false)
  }

  // Quick approve function - sets status to "Present" without dialog
  const handleQuickApprove = async (attendance) => {
    try {
      const response = await fetch(`${API_URL}/api/hr/attendance-management/update-status/${attendance._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'Present',
          description: 'Approved by HR'
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Attendance approved successfully')
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to approve attendance')
      }
    } catch (error) {
      console.error('Error approving attendance:', error)
      toast.error(error.message || 'Failed to approve attendance')
    }
  }

  const handleUpdateStatus = async () => {
    if (!updateStatus) {
      toast.error('Please select a status')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/hr/attendance-management/update-status/${selectedAttendance._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: updateStatus,
          description: description
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Attendance status updated successfully')
        setIsDialogOpen(false)
        setSelectedAttendance(null)
        setUpdateStatus("")
        setDescription("")
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(error.message || 'Failed to update status')
    }
  }

  const openStatusDialog = (attendance, status = "") => {
    setSelectedAttendance(attendance)
    setUpdateStatus(status || "")
    setDescription("")
    setIsDialogOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return "bg-green-100 text-green-800"
      case 'Absent':
        return "bg-red-100 text-red-800"
      case 'Half Day':
      case 'Early Leave':
        return "bg-yellow-100 text-yellow-800"
      case 'AwaitingApproval':
      case 'Active':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Absent':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'AwaitingApproval':
      case 'Active':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Team Leader':
        return "bg-blue-100 text-blue-800"
      case 'HR':
        return "bg-purple-100 text-purple-800"
      case 'Accountant':
        return "bg-green-100 text-green-800"
      case 'Tele Caller':
        return "bg-orange-100 text-orange-800"
      case 'Project Manager':
        return "bg-indigo-100 text-indigo-800"
      case 'Sales Employee':
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRequests = pendingRequests.filter(request =>
    request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.companyEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(employee =>
    selectedDepartment === 'all' || employee.department === selectedDepartment
  )

  const handleViewDetails = (employeeId) => {
    router.push(`/dashboard/hr/data-management/attendance-history/${employeeId}`)
  }

  return (
    <DashboardLayout title="HR Attendance Management">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600">Manage and approve employee attendance records</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Team Leader">Team Leader</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Accountant">Accountant</SelectItem>
                    <SelectItem value="Tele Caller">Tele Caller</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Sales Employee">Sales Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="AwaitingApproval">Pending Approval</SelectItem>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Half Day">Half Day</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Early Leave">Early Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="search">Search Employee</Label>
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Attendance Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending attendance requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Work Duration</TableHead>
                      <TableHead>Current Status</TableHead>
                      <TableHead>Work Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.employeeName}</div>
                            <div className="text-sm text-gray-500">{request.employeeEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.department}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.date).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{request.totalWorkDuration || 0} hours</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(request.workModeOnTime).toLocaleTimeString()} - {new Date(request.workModeOffTime).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.currentStatus)}
                            <Badge variant="outline" className={getStatusColor(request.currentStatus)}>
                              {request.currentStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.workType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleQuickApprove(request)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>

                            <Button size="sm" variant="outline" onClick={() => openStatusDialog(request, 'Present')}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Employees List ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No employees found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Employee Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {employee.photo ? (
                              <img
                                src={employee.photo}
                                alt={employee.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {employee.empCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDepartmentColor(employee.department)}>
                            {employee.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{employee.companyEmail}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(employee.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(employee._id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Attendance Status</DialogTitle>
              <DialogDescription>
                Update the attendance status for {selectedAttendance?.employeeName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Half Day">Half Day</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Early Leave">Early Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description / Remarks</Label>
                <Textarea
                  id="description"
                  placeholder="Enter any remarks or description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Add any notes or remarks for this attendance record
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Attendance Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Date: {selectedAttendance && new Date(selectedAttendance.date).toLocaleDateString('en-IN')}</div>
                  <div>Duration: {selectedAttendance?.totalWorkDuration || 0} hours</div>
                  <div>Work Type: {selectedAttendance?.workType}</div>
                  <div>Department: {selectedAttendance?.department}</div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}