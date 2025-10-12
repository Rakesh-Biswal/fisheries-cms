"use client";

import { useState, useEffect } from "react";
import Sidebar from "./CeoSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Plus, Menu, Search, Bell } from "lucide-react";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  // ✅ Load employee data from localStorage when the page loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("EmployeeData");
      if (storedData) {
        setEmployeeData(JSON.parse(storedData));
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

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
                    {employeeData?.name
                      ? employeeData.name.charAt(0).toUpperCase()
                      : "E"}
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

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
