"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wheat,
  Users,
  MapPin,
  UserCheck,
  Wrench,
  Package,
  Truck,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard/projectmanager",
    icon: LayoutDashboard,
  },
  {
    name: "Puspreterie",
    href: "/dashboard/projectmanager/puspreterie",
    icon: Wheat,
  },
  { name: "Teams", href: "/dashboard/projectmanager/teams", icon: Users },
  {
    name: "Farms & Fields",
    href: "/dashboard/projectmanager/farms-fields",
    icon: MapPin,
  },
  {
    name: "Clients",
    href: "/dashboard/projectmanager/clients",
    icon: UserCheck,
  },
  {
    name: "Maintenance",
    href: "/dashboard/projectmanager/maintenance",
    icon: Wrench,
  },
  {
    name: "Equipment",
    href: "/dashboard/projectmanager/equipment",
    icon: Package,
  },
  {
    name: "Suppliers",
    href: "/dashboard/projectmanager/suppliers",
    icon: Truck,
  },
    {
    name: "Suppliers",
    href: "/dashboard/tea",
    icon: Truck,
  },
];

const bottomItems = [
  {
    name: "Setting",
    href: "/dashboard/projectmanager/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/dashboard/projectmanager/help",
    icon: HelpCircle,
  },
  { name: "Logout", href: "/dashboard/projectmanager/logout", icon: LogOut },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-gray-900">
            AgroFlow CRM
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose} // Close sidebar on mobile when link is clicked
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose} // Close sidebar on mobile when link is clicked
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
