"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Edit,
  Clock,
  User,
  Briefcase,
  DollarSign,
  FileText,
  Shield,
  Award,
  CreditCard,
  Building,
} from "lucide-react";

export default function EmployeeViewPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Information");

  // Sample employee data - in real app, fetch based on params.id
  const employee = {
    id: params.id,
    name: "Panji Dwi",
    status: "Active",
    avatar: "/professional-woman.png",
    lastCheckedIn: "A few seconds ago",
    lastMessaged: "2 Days ago",
    employeeId: "#HY907",
    email: "panji.dwi@company.com",
    phone: "+1 (555) 123-4567",
    department: "Marketing Team",
    position: "Project Manager",
    contractStart: "17 September 2023",
    contractEnd: "17 September 2024",
    workingHours: "30 hours",
    baseSalary: "₹8,000/month",
    reportingTo: "Project Manager",
    workLocation: "Bogra PMI",
  };

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

  return (
    <DashboardLayout title="Employee Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </Button>
          <Button className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send Email
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
                  <h1 className="text-2xl font-bold">{employee.name}</h1>
                  <Badge className="bg-green-100 text-green-800">
                    {employee.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Last Checked In:</span>
                    <p>{employee.lastCheckedIn}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Messaged:</span>
                    <p>{employee.lastMessaged}</p>
                  </div>
                  <div>
                    <span className="font-medium">Employee ID:</span>
                    <p>{employee.employeeId}</p>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Contract Duration
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Terminate
                  </Button>
                  <Button size="sm">Extend Contract</Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contract Start</p>
                  <p className="font-medium">{employee.contractStart}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contract End</p>
                  <p className="font-medium">{employee.contractEnd}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contract Position Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Contract Position Details
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Title</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Level</p>
                  <p className="font-medium">Manager Level</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Expected Work Hours per week
                  </p>
                  <p className="font-medium">{employee.workingHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Supervisor</p>
                  <p className="font-medium">{employee.reportingTo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Employment Status
                  </p>
                  <p className="font-medium">Full-time</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reports To</p>
                  <p className="font-medium">{employee.reportingTo}</p>
                </div>
              </CardContent>
            </Card>

            {/* Compensation & Benefits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Compensation & Benefits
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Type</p>
                  <p className="font-medium">Monthly Salary</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Base Salary</p>
                  <p className="font-medium">{employee.baseSalary}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Provident Fund Amount
                  </p>
                  <p className="font-medium">Yes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Allowance Spend Expenses
                  </p>
                  <p className="font-medium">Yes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Working Scope */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Working Scope
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Develop and test new IT solutions, products, and systems
                  through creative experimentation and prototyping.
                </p>
                <p className="text-sm text-gray-600">
                  Work closely with cross-functional teams providing technical
                  expertise and insights.
                </p>
                <p className="text-sm text-gray-600">
                  Conduct in-depth research to identify emerging technologies,
                  market trends, and potential opportunities.
                </p>
                <p className="text-sm text-gray-600">
                  Analyze and interpret research data to make data- driven
                  decisions and recommendations.
                </p>
                <p className="text-sm text-gray-600">
                  Manage R&D projects, ensuring they are completed on time and
                  within budget.
                </p>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contract Details
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contract ID</p>
                  <p className="font-medium">#CTPY9920</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Contract Country Tax of Residence
                  </p>
                  <p className="font-medium">Indonesia</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Effective Date of Tax Residency
                  </p>
                  <p className="font-medium">11 December 2023</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
