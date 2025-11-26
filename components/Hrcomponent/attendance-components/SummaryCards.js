// components/Hrcomponent/SummaryCards.js
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  UserX, 
  MoreHorizontal,
  Clock,
  AlertCircle 
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SummaryCards = ({ summary }) => {
  const mainCards = [
    {
      label: "Total",
      value: summary.totalEmployees || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Present",
      value: summary.active || 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      label: "Absent",
      value: summary.absent || 0,
      icon: UserX,
      color: "text-red-600",
    },
  ];

  const moreData = [
    { label: "Active", value: summary.active || 0, icon: Clock },
    { label: "Half Day", value: summary.halfDay || 0, icon: AlertCircle },
    { label: "Early Leave", value: summary.earlyLeave || 0, icon: AlertCircle },
    { label: "Pending", value: summary.awaitingApproval || 0, icon: AlertCircle },
    { label: "Holiday", value: summary.holiday || 0, icon: AlertCircle },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {mainCards.map((card, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <card.icon className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* More Dropdown Box */}
      <Card>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <CardContent className="p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">More</p>
                  <p className="text-xl font-bold text-gray-700">Options</p>
                </div>
                <MoreHorizontal className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            {moreData.map((item, i) => (
              <DropdownMenuItem key={i} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </div>
  );
};

export default SummaryCards;
