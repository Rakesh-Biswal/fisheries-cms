// components/PM_Component/dashboard-layout.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  IndianRupee,
  BarChart3,
  Home,
  ChevronDown,
  LogOut,
  User,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const navigation = [
    { name: "Dashboard", href: "/dashboard/project-manager", icon: Home },
    { name: "Farmers", href: "/dashboard/project-manager/farmers", icon: Users },
    { name: "Payments", href: "/dashboard/project-manager/payments", icon: IndianRupee },
    { name: "Reports", href: "/dashboard/project-manager/reports", icon: BarChart3 },
  ];

  // ✅ Load employee data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("EmployeeData");
      if (stored) {
        setEmployeeData(JSON.parse(stored));
      }
    }
  }, []);

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Diga-Darshan</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            ×
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button in Sidebar */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${API_URL}/api/employee/signout`, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                const result = await response.json();

                if (result.success) {
                  localStorage.removeItem("EmployeeData");
                  window.location.href = "/";
                } else {
                  alert("Failed to log out, please try again.");
                }
              } catch (error) {
                console.error("Logout error:", error);
                alert("An error occurred while logging out.");
              }
            }}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                ☰
              </Button>
              <h1 className="ml-2 text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64 bg-gray-50 border-0" 
                />
              </div>

              {/* Notification Bell */}
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {/* Employee Showcase */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={employeeData?.photo || "/default-avatar.png"}
                    alt={employeeData?.name || "Project Manager"}
                  />
                  <AvatarFallback>
                    {employeeData?.name ? employeeData.name.charAt(0).toUpperCase() : "PM"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {employeeData?.name || "Project Manager"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {employeeData?.role || "Project Manager"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}