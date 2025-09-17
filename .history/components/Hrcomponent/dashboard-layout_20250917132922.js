"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Clock,
  Database,
  CheckSquare,
  Users,
  CreditCard,
  UserCheck,
  UserPlus,
  Receipt,
  Shield,
  Cloud,
  Menu,
  X,
} from "lucide-react"

const menuItems = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
      { name: "Timesheet", href: "/dashboard/hr/timesheet", icon: Clock },
      { name: "Data Management", href: "/dashboard/hr/data-management", icon: Database },
      { name: "Approval", href: "/dashboard/hr/approval", icon: CheckSquare },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Employees", href: "/dashboard/hr/employees", icon: Users },
      { name: "Payroll", href: "/dashboard/hr/payroll", icon: CreditCard },
      { name: "Attendance", href: "/dashboard/hr/attendance", icon: UserCheck },
      { name: "Recruitment", href: "/dashboard/hr/recruitment", icon: UserPlus },
      { name: "Reimbursement", href: "/dashboard/hr/reimbursement", icon: Receipt },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Settings", href: "/dashboard/hr/settings", icon: Settings },
      { name: "Security", href: "/dashboard/hr/security", icon: Shield },
      { name: "Help", href: "/dashboard/hr/help", icon: HelpCircle },
    ],
  },
    {
    title: "Department",
    items: [
      { name: "Team Leader", href: "/dashboard/hr/set", icon: Settings },
      { name: "Accoutant", href: "/dashboard/hr/security", icon: Shield },
       { name: "Project Manger", href: "/dashboard/hr/security", icon: Shield },
      { name: "Sales Employee", href: "/dashboard/hr/help", icon: HelpCircle },
      { name: "Telecaller", href: "/dashboard/hr/help", icon: HelpCircle },
    ],
  },
  
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Neutrack</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Cloud Storage */}
        <div className="p-4 border-t">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Cloud Storage</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">28 GB of 35 GB used</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search employees..." className="pl-10 w-80 bg-gray-50 border-0" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/professional-woman-diverse.png" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Melanie Stone</p>
                  <p className="text-xs text-gray-500">HR Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
