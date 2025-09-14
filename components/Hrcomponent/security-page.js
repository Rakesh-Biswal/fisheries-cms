"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Key,
  Globe,
  Smartphone,
  Monitor,
  MoreHorizontal,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react"

const securityEvents = [
  {
    id: 1,
    type: "Login Success",
    user: "Melanie Stone",
    device: "Chrome on Windows",
    location: "Mumbai, India",
    timestamp: "2024-01-15 10:30 AM",
    risk: "Low",
    status: "Success",
  },
  {
    id: 2,
    type: "Failed Login",
    user: "Unknown",
    device: "Firefox on Linux",
    location: "Unknown Location",
    timestamp: "2024-01-15 09:45 AM",
    risk: "High",
    status: "Blocked",
  },
  {
    id: 3,
    type: "Password Change",
    user: "John Smith",
    device: "Mobile App",
    location: "Delhi, India",
    timestamp: "2024-01-14 08:20 PM",
    risk: "Medium",
    status: "Success",
  },
  {
    id: 4,
    type: "Data Export",
    user: "Sarah Johnson",
    device: "Chrome on Mac",
    location: "Bangalore, India",
    timestamp: "2024-01-14 03:15 PM",
    risk: "Medium",
    status: "Success",
  },
  {
    id: 5,
    type: "API Access",
    user: "System",
    device: "API Client",
    location: "Server",
    timestamp: "2024-01-14 02:30 PM",
    risk: "Low",
    status: "Success",
  },
]

const securityMetrics = [
  { day: "Mon", threats: 5, blocked: 3, allowed: 2 },
  { day: "Tue", threats: 8, blocked: 6, allowed: 2 },
  { day: "Wed", threats: 3, blocked: 2, allowed: 1 },
  { day: "Thu", threats: 12, blocked: 10, allowed: 2 },
  { day: "Fri", threats: 7, blocked: 5, allowed: 2 },
  { day: "Sat", threats: 2, blocked: 1, allowed: 1 },
  { day: "Sun", threats: 1, blocked: 1, allowed: 0 },
]

const activeSessions = [
  {
    id: 1,
    user: "Melanie Stone",
    device: "Chrome on Windows",
    location: "Mumbai, India",
    ip: "192.168.1.100",
    lastActive: "2024-01-15 10:30 AM",
    status: "Active",
  },
  {
    id: 2,
    user: "John Smith",
    device: "Mobile App",
    location: "Delhi, India",
    ip: "192.168.1.101",
    lastActive: "2024-01-15 09:15 AM",
    status: "Active",
  },
  {
    id: 3,
    user: "Sarah Johnson",
    device: "Safari on Mac",
    location: "Bangalore, India",
    ip: "192.168.1.102",
    lastActive: "2024-01-14 06:45 PM",
    status: "Idle",
  },
]

const securityPolicies = [
  {
    name: "Password Policy",
    description: "Minimum 8 characters, special characters required",
    status: "Active",
    lastUpdated: "2024-01-10",
  },
  {
    name: "Two-Factor Authentication",
    description: "Required for all admin users",
    status: "Active",
    lastUpdated: "2024-01-08",
  },
  {
    name: "Session Timeout",
    description: "Auto logout after 30 minutes of inactivity",
    status: "Active",
    lastUpdated: "2024-01-05",
  },
  {
    name: "IP Whitelist",
    description: "Restrict access to approved IP addresses",
    status: "Inactive",
    lastUpdated: "2024-01-03",
  },
]

const securityStats = {
  totalThreats: 38,
  blockedThreats: 28,
  activeSessions: 15,
  failedLogins: 12,
  securityScore: 92,
  lastScan: "2024-01-15 08:00 AM",
}

export default function SecurityPage() {
  const [selectedFilter, setSelectedFilter] = useState("All Events")

  const getRiskColor = (risk) => {
    switch (risk) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
      case "Active":
        return "bg-green-100 text-green-800"
      case "Blocked":
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Idle":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success":
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Blocked":
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Idle":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getDeviceIcon = (device) => {
    if (device.includes("Mobile") || device.includes("iPhone") || device.includes("Android")) {
      return <Smartphone className="h-4 w-4 text-gray-400" />
    }
    return <Monitor className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600">Monitor security events and manage access controls</p>
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
              <DropdownMenuItem onClick={() => setSelectedFilter("All Events")}>All Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("High Risk")}>High Risk</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Failed Logins")}>Failed Logins</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Successful Logins")}>
                Successful Logins
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Security Scan
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-3xl font-bold text-green-600">{securityStats.securityScore}%</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threats Blocked</p>
                <p className="text-3xl font-bold text-red-600">{securityStats.blockedThreats}</p>
                <p className="text-sm text-red-600">This week</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-blue-600">{securityStats.activeSessions}</p>
                <p className="text-sm text-blue-600">Currently online</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                <p className="text-3xl font-bold text-orange-600">{securityStats.failedLogins}</p>
                <p className="text-sm text-orange-600">Last 24 hours</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Security Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={securityMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="blocked" fill="#EF4444" name="Blocked" />
              <Bar dataKey="allowed" fill="#F59E0B" name="Allowed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Sessions</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(session.device)}
                        <span className="text-sm">{session.device}</span>
                      </div>
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <Badge variant="outline" className={getStatusColor(session.status)}>
                          {session.status}
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Terminate Session</DropdownMenuItem>
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

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.type}</TableCell>
                    <TableCell>{event.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(event.device)}
                        <span className="text-sm">{event.device}</span>
                      </div>
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRiskColor(event.risk)}>
                        {event.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.status}
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Investigate</DropdownMenuItem>
                          <DropdownMenuItem>Block IP</DropdownMenuItem>
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

      {/* Security Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Security Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityPolicies.map((policy, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Key className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{policy.name}</h4>
                    <p className="text-sm text-gray-500">{policy.description}</p>
                    <p className="text-xs text-gray-400">Last updated: {policy.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={policy.status === "Active" ? "default" : "secondary"}
                    className={policy.status === "Active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {policy.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
