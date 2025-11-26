"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  FileText,
  Users,
  Calendar,
  DollarSign,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
} from "lucide-react"

const dataCategories = [
  {
    name: "Employee Records",
    count: 205,
    size: "2.4 GB",
    lastUpdated: "2024-01-15",
    status: "Synced",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Payroll Data",
    count: 1250,
    size: "890 MB",
    lastUpdated: "2024-01-14",
    status: "Syncing",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    name: "Attendance Logs",
    count: 15420,
    size: "1.2 GB",
    lastUpdated: "2024-01-15",
    status: "Synced",
    icon: Calendar,
    color: "bg-orange-500",
  },
  {
    name: "Documents",
    count: 3240,
    size: "5.6 GB",
    lastUpdated: "2024-01-13",
    status: "Error",
    icon: FileText,
    color: "bg-purple-500",
  },
]

const recentBackups = [
  {
    id: 1,
    name: "Full System Backup",
    date: "2024-01-15 02:00 AM",
    size: "12.4 GB",
    status: "Completed",
    duration: "45 minutes",
  },
  {
    id: 2,
    name: "Employee Data Backup",
    date: "2024-01-14 11:30 PM",
    size: "2.4 GB",
    status: "Completed",
    duration: "12 minutes",
  },
  {
    id: 3,
    name: "Payroll Backup",
    date: "2024-01-14 06:00 PM",
    size: "890 MB",
    status: "Failed",
    duration: "8 minutes",
  },
  {
    id: 4,
    name: "Incremental Backup",
    date: "2024-01-14 12:00 PM",
    size: "1.8 GB",
    status: "Completed",
    duration: "18 minutes",
  },
]

const dataIntegrations = [
  {
    name: "HRMS Integration",
    status: "Connected",
    lastSync: "2024-01-15 10:30 AM",
    records: "205 employees",
  },
  {
    name: "Payroll System",
    status: "Connected",
    lastSync: "2024-01-15 09:15 AM",
    records: "1,250 transactions",
  },
  {
    name: "Time Tracking",
    status: "Syncing",
    lastSync: "2024-01-15 10:45 AM",
    records: "15,420 entries",
  },
  {
    name: "Document Storage",
    status: "Error",
    lastSync: "2024-01-13 08:20 AM",
    records: "3,240 files",
  },
]

export default function DataManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusIcon = (status) => {
    switch (status) {
      case "Synced":
      case "Connected":
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "Error":
      case "Failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Synced":
      case "Connected":
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Syncing":
        return "bg-blue-100 text-blue-800"
      case "Error":
      case "Failed":
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
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600">Monitor and manage your HR data across all systems</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Data Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {getStatusIcon(category.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{category.count.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mb-2">{category.size}</p>
                  <Badge variant="outline" className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    Updated: {new Date(category.lastUpdated).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Storage Used</span>
              <span className="text-sm text-gray-500">28.4 GB of 50 GB</span>
            </div>
            <Progress value={56.8} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {dataCategories.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${category.color} rounded-full`} />
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Data Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataIntegrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(integration.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500">
                      Last sync: {integration.lastSync} • {integration.records}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Database className="h-4 w-4 mr-2" />
                        View Data
                      </DropdownMenuItem>
                      <DropdownMenuItem>Configure</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Backups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Backups</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(backup.status)}
                        <Badge variant="outline" className={getStatusColor(backup.status)}>
                          {backup.status}
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
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
