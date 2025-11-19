"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EmployeeViewPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const employeeId = params.id;

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/api/tl/teams/employee/${employeeId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        setEmployee(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch employee data");
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/teamleader/teams");
  };

  const handleSendEmail = () => {
    if (employee?.companyEmail) {
      window.location.href = `mailto:${employee.companyEmail}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "SE";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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

  if (loading) {
    return (
      <DashboardLayout title="Employee Details">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">Loading employee details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout title="Employee Details">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load employee details
            </h3>
            <p className="text-muted-foreground mb-4">
              {error || "Employee not found"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchEmployeeData}>Try Again</Button>
              <Button variant="outline" onClick={handleBack}>
                Back to Teams
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Employee Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleSendEmail}
            disabled={!employee.companyEmail}
          >
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
                  src={employee.photo || "/placeholder.svg"}
                  alt={employee.name}
                />
                <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{employee.name}</h1>
                  <Badge
                    className={
                      employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : employee.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {employee.status?.charAt(0).toUpperCase() +
                      employee.status?.slice(1) || "Unknown"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Employee ID:</span>
                    <p>{employee.empCode || "Not assigned"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>
                    <p>{employee.department || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Position:</span>
                    <p>{employee.role || "Not specified"}</p>
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
            {/* Personal Information */}
            {activeTab === "Personal Information" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium">{employee.companyEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium">{employee.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                    <p className="font-medium">{employee.empCode || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Qualification</p>
                    <p className="font-medium">
                      {employee.qualification || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="font-medium">
                      {employee.experience
                        ? `${employee.experience} years`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Join Date</p>
                    <p className="font-medium">
                      {formatDate(employee.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge
                      className={
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {employee.status?.charAt(0).toUpperCase() +
                        employee.status?.slice(1) || "Unknown"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contract Information */}
            {activeTab === "Contract" && (
              <>
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
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Contract Start
                      </p>
                      <p className="font-medium">
                        {employee.contractStart
                          ? formatDate(employee.contractStart)
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Contract End</p>
                      <p className="font-medium">
                        {employee.contractEnd
                          ? formatDate(employee.contractEnd)
                          : "Not specified"}
                      </p>
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
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Job Title</p>
                      <p className="font-medium">{employee.role || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Job Level</p>
                      <p className="font-medium">
                        {employee.jobLevel || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Expected Work Hours per week
                      </p>
                      <p className="font-medium">
                        {employee.workingHours || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Supervisor</p>
                      <p className="font-medium">
                        {employee.reportingTo || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Employment Status
                      </p>
                      <p className="font-medium">
                        {employee.employmentStatus || "Full-time"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Reports To</p>
                      <p className="font-medium">
                        {employee.reportingTo || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Other tabs can be implemented similarly */}
            {(activeTab === "Payroll" ||
              activeTab === "Time Management" ||
              activeTab === "Assets" ||
              activeTab === "Documents" ||
              activeTab === "Training" ||
              activeTab === "Finance") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tabs.find((tab) => tab.name === activeTab)?.icon && (
                      <>
                        {(() => {
                          const Icon = tabs.find(
                            (tab) => tab.name === activeTab
                          )?.icon;
                          return Icon ? <Icon className="w-5 h-5" /> : null;
                        })()}
                        {activeTab}
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      {activeTab} information will be displayed here once
                      integrated with the backend.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={fetchEmployeeData}
                    >
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                  {employee.workingScope ||
                    "Develop and test new solutions through creative experimentation and prototyping."}
                </p>
                <p className="text-sm text-gray-600">
                  Work closely with cross-functional teams providing technical
                  expertise and insights.
                </p>
                <p className="text-sm text-gray-600">
                  Conduct in-depth research to identify emerging technologies,
                  market trends, and potential opportunities.
                </p>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Additional Information
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="font-medium">
                    {employee.department || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Work Location</p>
                  <p className="font-medium">
                    {employee.workLocation || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="font-medium">
                    {employee.updatedAt
                      ? formatDate(employee.updatedAt)
                      : "Not available"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Assign Training
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}