"use client"

import { useState, useEffect } from "react"
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
  Calendar,
  Database,
  Users,
  CreditCard,
  UserCheck,
  UserPlus,
  Shield,
  Cloud,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
      { name: "Tasks & Meetings", href: "/dashboard/hr/tasks-meetings", icon: Calendar },
      { name: "Timesheet", href: "/dashboard/hr/timesheet", icon: Clock },
      { name: "Data Management", href: "/dashboard/hr/data-management", icon: Database },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Employees", href: "/dashboard/hr/employees", icon: Users },
      { name: "Payroll", href: "/dashboard/hr/payroll", icon: CreditCard },
      { name: "Attendance", href: "/dashboard/hr/attendance", icon: UserCheck },
      { name: "Recruitment", href: "/dashboard/hr/recruitment", icon: UserPlus },
      { name: "Attendance (Holidays)", href: "/dashboard/hr/holidays-management", icon: UserCheck },
    ],
  },
  {
    title: "Department",
    collapsible: true,
    items: [
      { name: "Team Leader", href: "/dashboard/hr/team-leader", icon: Settings },
      { name: "Accountant", href: "/dashboard/hr/accountant", icon: Shield },
      { name: "Project Manager", href: "/dashboard/hr/project-manager", icon: Shield },
      { name: "Sales Employee", href: "/dashboard/hr/salesemployee", icon: HelpCircle },
      { name: "Telecaller", href: "/dashboard/hr/telecaller", icon: HelpCircle },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Profile & Settings", href: "/dashboard/hr/settings", icon: Settings },
      { name: "Help", href: "/dashboard/hr/help", icon: HelpCircle },
      { name: "Logout", href: "/", icon: HelpCircle },
    ],
  },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)
  const pathname = usePathname()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // ✅ Load employee data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("EmployeeData")
      if (stored) {
        setEmployeeData(JSON.parse(stored))
      }
    }
  }, [])

  return (
    <div className="flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">HR Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {menuItems.map((section) => (
            <div key={section.title}>
              {/* Section Title */}
              <div
                className={cn(
                  "flex items-center justify-between px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3",
                  section.collapsible && "cursor-pointer hover:text-gray-700"
                )}
                onClick={() => section.collapsible && setDepartmentOpen(!departmentOpen)}
              >
                {section.title}
                {section.collapsible &&
                  (departmentOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </div>

              {/* Render items */}
              <div className={cn("space-y-1", section.collapsible && !departmentOpen && "hidden")}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  // ✅ Check if this is the Logout item
                  const isLogout = item.name === "Logout";

                  return (
                    <div key={item.name}>
                      {isLogout ? (
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`${API_URL}/api/employee/signout`, {
                                method: "POST",
                                credentials: "include", // important to send cookie
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              });

                              const result = await response.json();

                              if (result.success) {
                                // ✅ Clear local data
                                localStorage.removeItem("EmployeeData");

                                // ✅ Redirect to login page
                                window.location.href = "/";
                              } else {
                                alert("Failed to log out, please try again.");
                              }
                            } catch (error) {
                              console.error("Logout error:", error);
                              alert("An error occurred while logging out.");
                            }
                          }}
                          className={cn(
                            "flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      )}
                    </div>
                  );
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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

            {/* ✅ Dynamic employee info */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={employeeData?.photo || "/professional-woman-diverse.png"}
                    alt={employeeData?.name || "Employee"}
                  />
                  <AvatarFallback>
                    {employeeData?.name ? employeeData.name.charAt(0).toUpperCase() : "E"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {employeeData?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {employeeData?.role || "Employee"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
