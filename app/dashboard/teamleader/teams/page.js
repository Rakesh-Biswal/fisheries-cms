"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import HireWorkerForm from "@/components/TL_Component/HireNewWorker"; // ✅ import your form

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("Requested");
  const [showHireForm, setShowHireForm] = useState(false); // ✅ toggle state
  const router = useRouter();

  const timeOffData = [
    {
      id: 1,
      name: "Olivia Carter Martinez",
      department: "Marketing Team",
      avatar: "/professional-woman.png",
      period: "5 Apr → 7 Apr 2025",
      days: "3 days",
      requestType: "Sick Leave",
      reason: "Recovering from flu",
      status: "Pending",
    },
    {
      id: 2,
      name: "James Richardson",
      department: "Design Team",
      avatar: "/man-designer.png",
      period: "12 Jun → 15 Jun 2025",
      days: "4 days",
      requestType: "Annual Leave",
      reason: "Family vacation",
      status: "Approve",
    },
    {
      id: 3,
      name: "Sophia Johnson",
      department: "HR Team",
      avatar: "/woman-hr.png",
      period: "20 Jul → 22 Jul 2025",
      days: "3 days",
      requestType: "Maternity Leave",
      reason: "Doctor’s appointment and rest",
      status: "Approve",
    },
    {
      id: 4,
      name: "Michael Brown",
      department: "Engineering Team",
      avatar: "/engineer-man.png",
      period: "1 Aug → 5 Aug 2025",
      days: "5 days",
      requestType: "Annual Leave",
      reason: "Attending cousin’s wedding",
      status: "Rejected",
    },
    {
      id: 5,
      name: "Emma Wilson",
      department: "Finance Team",
      avatar: "/finance-woman.png",
      period: "10 Sep → 12 Sep 2025",
      days: "3 days",
      requestType: "Sick Leave",
      reason: "Recovering from surgery",
      status: "Pending",
    },
    {
      id: 6,
      name: "Daniel Lee",
      department: "IT Support",
      avatar: "/it-man.png",
      period: "18 Oct → 19 Oct 2025",
      days: "2 days",
      requestType: "Personal Leave",
      reason: "Moving to a new apartment",
      status: "Approve",
    },
  ];

  const totalTimeOff = 491;
  const approvalTimeOff = 276;
  const rejectedTimeOff = 68;
  const pendingTimeOff = 147;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
      case "Approve":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckCircle className="w-4 h-4" /> Approve
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  const handleView = (employeeId) => {
    router.push(`/dashboard/teamleader/teams/${employeeId}/view`);
  };

  const handleEdit = (employeeId) => {
    router.push(`/dashboard/teamleader/teams/${employeeId}/edit`);
  };

  const handleDelete = (employeeId) => {
    router.push(`/dashboard/teamleader/teams/${employeeId}/delete`);
  };

  return (
    <DashboardLayout title="Time off">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalTimeOff}</p>
                  <span className="text-sm text-green-600">+28</span>
                </div>
                <p className="text-sm text-gray-600">Total time off</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{approvalTimeOff}</p>
                  <span className="text-sm text-red-600">-12</span>
                </div>
                <p className="text-sm text-gray-600">Approval time off</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{rejectedTimeOff}</p>
                  <span className="text-sm text-green-600">+29</span>
                </div>
                <p className="text-sm text-gray-600">Rejected time off</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{pendingTimeOff}</p>
                  <span className="text-sm text-red-600">-31</span>
                </div>
                <p className="text-sm text-gray-600">Pending time off</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => setShowHireForm(true)} // ✅ open form
            >
              <span className="text-lg">+</span> Add new
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Employee name
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Period time off
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Request type
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Reason
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeOffData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={item.avatar || "/placeholder.svg"}
                            alt={item.name}
                          />
                          <AvatarFallback>
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {item.period}
                      </div>
                      <div className="text-sm text-gray-500">{item.days}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {item.requestType}
                    </td>
                    <td className="p-4 max-w-xs text-sm text-gray-600 truncate">
                      {item.reason}
                    </td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Hire Worker Form Modal */}
      {showHireForm && (
        <HireWorkerForm
          onClose={() => setShowHireForm(false)}
          onSuccess={(newEmployee) => {
            console.log("New Employee Added:", newEmployee);
            setShowHireForm(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
