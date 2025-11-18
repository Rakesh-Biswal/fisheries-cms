"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  Building,
  User,
  Clock,
  Shield,
  Award,
  CreditCard,
} from "lucide-react";

export default function EmployeeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Information");

  // Sample employee data - in real app, fetch based on params.id
  const [employee, setEmployee] = useState({
    id: params.id,
    name: "Panji Dwi",
    status: "Active",
    avatar: "/professional-woman.png",
    email: "panji.dwi@company.com",
    phone: "+1 (555) 123-4567",
    department: "Marketing Team",
    position: "Project Manager",
    contractStart: "2023-09-17",
    contractEnd: "2024-09-17",
    workingHours: "30",
    baseSalary: "8000",
    reportingTo: "Project Manager",
    workLocation: "Bogra PMI",
    jobLevel: "Manager Level",
    employmentStatus: "Full-time",
    paymentType: "Monthly Salary",
    workingScope:
      "Develop and test new IT solutions, products, and systems through creative experimentation and prototyping.",
  });

  const tabs = [
    { name: "Personal Information", icon: User },
    { name: "Contract", icon: FileText },
    { name: "Payroll", icon: CreditCard },
    { name: "Time Management", icon: Clock },
    { name: "Assets", icon: Shield },
    { name: "Documents", icon: FileText },
    { name: "Training", icon: Award },
    { name: "Finance", icon: DollarSign },
  ];

  const handleSave = () => {
    // In real app, save to backend
    console.log("Saving employee data:", employee);
    router.push(`/teams/${params.id}/view`);
  };

  const handleInputChange = (field, value) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout title="Edit Employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Employee Details
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {/* Employee Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={employee.avatar || "/placeholder.svg"}
                  alt={employee.name}
                />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Input
                    value={employee.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold border-none p-0 h-auto"
                  />
                  <Select
                    value={employee.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      value={employee.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input
                      value={employee.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 pb-2 border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab.name
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Contract Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Contract Start</Label>
                  <Input
                    type="date"
                    value={employee.contractStart}
                    onChange={(e) =>
                      handleInputChange("contractStart", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Contract End</Label>
                  <Input
                    type="date"
                    value={employee.contractEnd}
                    onChange={(e) =>
                      handleInputChange("contractEnd", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contract Position Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Contract Position Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Job Title</Label>
                  <Input
                    value={employee.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Job Level</Label>
                  <Select
                    value={employee.jobLevel}
                    onValueChange={(value) =>
                      handleInputChange("jobLevel", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior Level">Junior Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="Manager Level">
                        Manager Level
                      </SelectItem>
                      <SelectItem value="Director Level">
                        Director Level
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Working Hours per week
                  </Label>
                  <Input
                    value={employee.workingHours}
                    onChange={(e) =>
                      handleInputChange("workingHours", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select
                    value={employee.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing Team">
                        Marketing Team
                      </SelectItem>
                      <SelectItem value="Design Team">Design Team</SelectItem>
                      <SelectItem value="Developer Team">
                        Developer Team
                      </SelectItem>
                      <SelectItem value="Management Team">
                        Management Team
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Employment Status
                  </Label>
                  <Select
                    value={employee.employmentStatus}
                    onValueChange={(value) =>
                      handleInputChange("employmentStatus", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reports To</Label>
                  <Input
                    value={employee.reportingTo}
                    onChange={(e) =>
                      handleInputChange("reportingTo", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compensation & Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Compensation & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Payment Type</Label>
                  <Select
                    value={employee.paymentType}
                    onValueChange={(value) =>
                      handleInputChange("paymentType", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly Salary">
                        Monthly Salary
                      </SelectItem>
                      <SelectItem value="Hourly Rate">Hourly Rate</SelectItem>
                      <SelectItem value="Project Based">
                        Project Based
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Base Salary (₹)</Label>
                  <Input
                    type="number"
                    value={employee.baseSalary}
                    onChange={(e) =>
                      handleInputChange("baseSalary", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Working Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Working Scope
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={employee.workingScope}
                  onChange={(e) =>
                    handleInputChange("workingScope", e.target.value)
                  }
                  rows={8}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
