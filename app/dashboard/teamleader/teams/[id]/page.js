"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    User,
    Banknote,
    FileText,
    Shield,
    Calendar,
    GraduationCap,
    Briefcase,
    Users,
    Building,
    Target,
    Award,
    Mail as MailIcon,
    Phone as PhoneIcon,
    MapPin as MapPinIcon
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EmployeeDetailsPage() {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    const employeeId = params.id;

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails();
        }
    }, [employeeId]);

    const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/tl/teams/employee/${employeeId}`, {
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEmployee(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch employee details");
            }
        } catch (err) {
            console.error("Error fetching employee details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "inactive":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
            case "suspended":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <DashboardLayout title="Employee Details">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
                        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load employee details</h3>
                        <p className="text-muted-foreground mb-4">{error || "Employee not found"}</p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={fetchEmployeeDetails}>
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/dashboard/teamleader/teams')}>
                                Back to Team
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
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/teamleader/teams")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Team
                </Button>

                {/* Employee Profile Header */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage
                                        src={employee.photo || "/placeholder.svg"}
                                        alt={employee.name}
                                    />
                                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                                        {employee.name?.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {employee.name}
                                    </h1>
                                    <p className="text-gray-600">{employee.qualification || "Sales Employee"}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MailIcon className="w-4 h-4" />
                                            {employee.companyEmail}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <PhoneIcon className="w-4 h-4" />
                                            {employee.phone}
                                        </div>
                                        {getStatusBadge(employee.status)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Employee Code</div>
                                <div className="font-mono text-lg font-bold text-gray-900">
                                    {employee.empCode}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Role</div>
                                <div className="text-sm font-medium text-gray-900 capitalize">
                                    {employee.role?.replace('-', ' ') || 'Sales Employee'}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Personal Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-gray-900 font-medium">{employee.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-gray-900">{employee.phone}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company Email</label>
                                        <p className="text-gray-900">{employee.companyEmail}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Personal Email</label>
                                        <p className="text-gray-900">{employee.personalEmail || "Not provided"}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="text-gray-900 flex items-start gap-2">
                                        <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                        <span>{employee.address}</span>
                                    </p>
                                </div>

                                {employee.emergencyContact && (
                                    <div className="border-t pt-4">
                                        <label className="text-sm font-medium text-gray-500 block mb-2">Emergency Contact</label>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-gray-900 font-medium">
                                                {employee.emergencyContact.name} ({employee.emergencyContact.relation})
                                            </p>
                                            <p className="text-gray-600 text-sm">{employee.emergencyContact.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-green-600" />
                                <h2 className="text-lg font-semibold">Professional Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Qualification</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-gray-400" />
                                            {employee.qualification || "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Experience</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-gray-400" />
                                            {employee.experience || 0} years
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Previous Company</label>
                                    <p className="text-gray-900">{employee.previousCompany || "Not specified"}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Role</label>
                                        <p className="text-gray-900 capitalize">{employee.role?.replace('-', ' ') || 'Sales Employee'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div>{getStatusBadge(employee.status)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Joined Date</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(employee.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(employee.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Data */}
                    {employee.businessData && (
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-lg font-semibold">Performance & Business Data</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Designation</label>
                                            <p className="text-gray-900">{employee.businessData.designation || "Sales Executive"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Department</label>
                                            <p className="text-gray-900">{employee.businessData.department || "Sales"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Assigned Zone</label>
                                            <p className="text-gray-900">{employee.businessData.assignedZone || "Not assigned"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Monthly Target</label>
                                            <p className="text-gray-900">₹{employee.businessData.monthlyTarget?.toLocaleString() || "0"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Current Month Sales</label>
                                            <p className="text-gray-900">₹{employee.businessData.currentMonthSales?.toLocaleString() || "0"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Sales</label>
                                            <p className="text-gray-900">₹{employee.businessData.totalSales?.toLocaleString() || "0"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Target Achievement Rate</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(employee.businessData.targetAchievementRate || 0, 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {employee.businessData.targetAchievementRate || 0}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Banking Information */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Banknote className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold">Banking Information</h2>
                            </div>
                            {employee.bankAccount ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Account Number</label>
                                            <p className="font-mono text-gray-900">
                                                •••• {employee.bankAccount.accountNumber?.slice(-4)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                                            <p className="font-mono text-gray-900">{employee.bankAccount.ifscCode}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Bank Name</label>
                                            <p className="text-gray-900">{employee.bankAccount.bankName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Branch</label>
                                            <p className="text-gray-900">{employee.bankAccount.branch}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Banking information not available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Identification Documents */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-semibold">Identification Documents</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                                    <p className="font-mono text-gray-900">
                                        •••• •••• •••• {employee.aadhar?.slice(-4)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">PAN Number</label>
                                    <p className="font-mono text-gray-900">{employee.pan}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Referral Information */}
                    {employee.referredBy && (
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-lg font-semibold">Referral Information</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Referred By</label>
                                        <p className="text-gray-900 font-medium">{employee.referredBy.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Referrer Email</label>
                                        <p className="text-gray-900">{employee.referredBy.companyEmail}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}