"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import {
  BarChart3,
  Users,
  Calculator,
  FolderKanban,
  Phone,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  Calendar,
  Clock,
} from "lucide-react"

export default function CeoSidebar({ activeSection }) {
  const [expandedDepartments, setExpandedDepartments] = useState(true)
  const pathname = usePathname()

  const departments = [
    {
      id: "hr",
      name: "Human Resources",
      icon: Users,
      employees: 12,
      status: "active",
      color: "bg-blue-500",
      href: "/dashboard/ceo/hr",
    },
    {
      id: "accountant",
      name: "Accounting",
      icon: Calculator,
      employees: 8,
      status: "active",
      color: "bg-green-500",
      href: "/dashboard/ceo/accountant",
    },
    {
      id: "projectmanager",
      name: "Project Management",
      icon: FolderKanban,
      employees: 15,
      status: "busy",
      color: "bg-purple-500",
      href: "/dashboard/ceo/projectmanager",
    },
    {
      id: "telecaller",
      name: "Telecaller",
      icon: Phone,
      employees: 20,
      status: "active",
      color: "bg-orange-500",
      href: "/dashboard/ceo/telecaller",
    },
  ]

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-4 space-y-4">
      {/* CEO Header */}
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">CEO Dashboard</h2>
            <p className="text-sm text-muted-foreground">Executive Control Panel</p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="space-y-2">
        <Link href="/dashboard/ceo/overview">
          <Button
            variant={pathname === "/employee/ceo/overview" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Company Overview
          </Button>
        </Link>

        {/* Departments Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setExpandedDepartments(!expandedDepartments)}
          >
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Departments
            </span>
            {expandedDepartments ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>

          {expandedDepartments && (
            <div className="ml-4 space-y-1">
              {departments.map((dept) => (
                <Link key={dept.id} href={dept.href}>
                  <Button
                    variant={pathname === dept.href ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                  >
                    <dept.icon className="w-3 h-3 mr-2" />
                    <span className="flex-1 text-left">{dept.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {dept.employees}
                    </Badge>
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/dashboard/ceo/settings">
          <Button
            variant={pathname === "/employee/ceo/settings" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Company Settings
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Employees</span>
            <span className="font-medium">55</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Projects</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Revenue</span>
            <span className="font-medium text-green-600">$125K</span>
          </div>
        </div>
      </Card>

      {/* Today's Schedule */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Today's Schedule
        </h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-2 text-muted-foreground" />
            <span>Board Meeting - 10:00 AM</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-2 text-muted-foreground" />
            <span>HR Review - 2:00 PM</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
