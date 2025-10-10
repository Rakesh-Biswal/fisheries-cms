"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  BarChart3,
  Users,
  Calculator,
  FolderKanban,
  Phone,
  Settings,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  LogOut,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CeoSidebar({ onClose }) {
  const pathname = usePathname();
  const [expandedDepartments, setExpandedDepartments] = useState(true);

  const departments = [
    {
      id: "hr",
      name: "Human Resources",
      icon: Users,
      employees: 12,
      href: "/dashboard/ceo/hr",
    },
    {
      id: "accountant",
      name: "Accounting",
      icon: Calculator,
      employees: 8,
      href: "/dashboard/ceo/accountant",
    },
    {
      id: "projectmanager",
      name: "Project Management",
      icon: FolderKanban,
      employees: 15,
      href: "/dashboard/ceo/projectmanager",
    },
    {
      id: "telecaller",
      name: "Telecaller",
      icon: Phone,
      employees: 20,
      href: "/dashboard/ceo/telecaller",
    },
    {
      id: "tasksmeetings",
      name: "Tasks & Meetings",
      icon: Calendar,
      employees: 2,
      href: "/dashboard/ceo/tasks-meetings",
    },
  ];

  const bottomItems = [
    {
      name: "Profile",
      href: "/dashboard/ceo/profile",
      icon: UserCheck,
    },
    {
      name: "Help & Support",
      href: "/dashboard/ceo/help",
      icon: HelpCircle,
    },
    {
      name: "Logout",
      href: "/",
      icon: LogOut,
    },
  ];

  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">
              CEO Dashboard
            </h2>
            <p className="text-xs text-gray-500">Executive Control Panel</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Overview */}
        <Link href="/dashboard/ceo/overview" onClick={onClose}>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard/ceo/overview"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            Company Overview
          </div>
        </Link>

        {/* Departments */}
        <div>
          <button
            onClick={() => setExpandedDepartments(!expandedDepartments)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Departments
            </span>
            {expandedDepartments ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedDepartments && (
            <div className="ml-4 mt-2 space-y-1">
              {departments.map((dept) => {
                const Icon = dept.icon;
                const isActive = pathname === dept.href;
                return (
                  <Link key={dept.id} href={dept.href} onClick={onClose}>
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{dept.name}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold"
                      >
                        {dept.employees}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/dashboard/ceo/settings" onClick={onClose}>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard/ceo/settings"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Settings className="w-5 h-5" />
            Company Settings
          </div>
        </Link>

        {/* Today's Schedule */}
        <Card className="p-4 mt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-600" />
            Today's Schedule
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-700">
              <Clock className="w-3 h-3 mr-2 text-gray-400" />
              <span>Board Meeting - 10:00 AM</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-3 h-3 mr-2 text-gray-400" />
              <span>HR Review - 2:00 PM</span>
            </div>
          </div>
        </Card>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
