// components/PM_Component/dashboard-stats.js
import { Card, CardContent } from "@/components/ui/card";
import { Users, IndianRupee, FileCheck, AlertCircle, CheckCircle } from "lucide-react";

export default function DashboardStats({ data }) {
  const stats = data || {
    totalFarmers: 0,
    totalPayments: 0,
    completedSteps: 0,
    pendingApprovals: 0,
    activeProjects: 0,
    totalRevenue: 0
  };

  const statCards = [
    {
      title: "Total Farmers",
      value: stats.totalFarmers,
      icon: Users,
      color: "blue",
      description: "Enrolled farmers"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: CheckCircle,
      color: "green",
      description: "Ongoing projects"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`,
      icon: IndianRupee,
      color: "emerald",
      description: "Total payments"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: "orange",
      description: "Need attention"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      emerald: "bg-emerald-100 text-emerald-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}