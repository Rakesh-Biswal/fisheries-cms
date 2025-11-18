// app/dashboard/project-manager/farmers/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import PaymentForm from "@/components/PM_Component/payment-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileCheck,
    FileX,
    MapPin,
    User,
    LandPlot,
    IndianRupee,
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    RefreshCw,
    AlertCircle,
    MoreVertical,
    CheckCircle,
    Edit,
    X
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FarmerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [farmerData, setFarmerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowDropdown(false);
        };

        // Add event listener when dropdown is open
        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    // Debug: Log the params to see what's being received
    useEffect(() => {
        console.log("Route params:", params);
        console.log("Farmer ID from params:", params.id);
    }, [params]);

    useEffect(() => {
        if (params.id) {
            fetchFarmerDetails();
        }
    }, [params.id]);

    const fetchFarmerDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching farmer details for ID:", params.id);

            const response = await fetch(`${API_URL}/api/project-manager/farmers/${params.id}`, {
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result);

            if (result.success) {
                setFarmerData(result.data);
                // Reset edit mode when data is refreshed
                setEditMode(false);
            } else {
                throw new Error(result.message || "Failed to fetch farmer details");
            }
        } catch (err) {
            console.error("Error fetching farmer details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateDocumentStatus = async (newStatus) => {
        try {
            setUpdatingStatus(true);

            const response = await fetch(`${API_URL}/api/project-manager/farmers/${params.id}/step2-status`, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentStatus: newStatus
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Update local state
                setFarmerData(prev => ({
                    ...prev,
                    step2Data: {
                        ...prev.step2Data,
                        documentStatus: newStatus
                    },
                    stepCompletion: {
                        ...prev.stepCompletion,
                        step2: newStatus === "Approved",
                        canMakePayment: prev.stepCompletion.step1 && newStatus === "Approved"
                    }
                }));

                // If status is no longer "Pending", exit edit mode
                if (newStatus !== "Pending") {
                    setEditMode(false);
                }
            } else {
                throw new Error(result.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Error updating document status:", err);
            alert("Failed to update document status: " + err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Approved":
                return "default";
            case "Rejected":
                return "destructive";
            case "Under Review":
                return "secondary";
            case "Needs Correction":
                return "outline";
            case "Pending":
            default:
                return "secondary";
        }
    };

    // Show loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="text-muted-foreground">Loading farmer details...</p>
                        <p className="text-sm text-muted-foreground mt-2">ID: {params.id}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Show error state
    if (error || !farmerData) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-8">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load farmer details</h3>
                        <p className="text-muted-foreground mb-4">{error || "Farmer not found"}</p>
                        <div className="space-y-2 mb-6">
                            <p className="text-sm text-gray-600">Farmer ID: {params.id}</p>
                            <p className="text-sm text-gray-600">Check if the farmer exists in the database</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={fetchFarmerDetails}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/dashboard/project-manager/farmers")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Farmers
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const { farmer, step2Data, payments, stepCompletion } = farmerData;
    const isStep2Pending = step2Data?.documentStatus === "Pending";

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" onClick={() => router.push("/dashboard/project-manager/farmers")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Farmers
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{farmer.name}</h1>
                                <p className="text-muted-foreground">Farmer ID: {farmer._id}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {stepCompletion.canMakePayment ? (
                                <Button onClick={() => setShowPaymentForm(true)}>
                                    <IndianRupee className="w-4 h-4 mr-2" />
                                    Create Payment
                                </Button>
                            ) : (
                                <Button disabled variant="outline">
                                    <FileX className="w-4 h-4 mr-2" />
                                    Make Payment (Steps Pending)
                                </Button>
                            )}
                            <Button variant="outline" onClick={fetchFarmerDetails}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Step Completion Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg border-2 ${stepCompletion.step1 ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${stepCompletion.step1 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Step 1: Basic Verification</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Sales Employee → Team Leader → HR Approval
                                            </p>
                                            <Badge variant={stepCompletion.step1 ? "default" : "secondary"} className="mt-2">
                                                {stepCompletion.step1 ? "Completed" : "Pending"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg border-2 ${stepCompletion.step2 ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${stepCompletion.step2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">Step 2: Land Verification</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Document verification and land approval
                                                    </p>
                                                    <Badge variant={getStatusBadgeVariant(step2Data?.documentStatus)} className="mt-2">
                                                        {step2Data ? step2Data.documentStatus : "Not Started"}
                                                    </Badge>
                                                </div>



                                                {/* Status Update Buttons */}
                                                {step2Data && (
                                                    <div className="flex gap-2 ml-4">
                                                        {editMode || isStep2Pending ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => updateDocumentStatus("Approved")}
                                                                    disabled={updatingStatus}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                                    Approve
                                                                </Button>

                                                                {/* Custom Dropdown */}
                                                                <div className="relative">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled={updatingStatus}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowDropdown(!showDropdown);
                                                                        }}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>

                                                                    {showDropdown && (
                                                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                                                            <button
                                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateDocumentStatus("Under Review");
                                                                                    setShowDropdown(false);
                                                                                }}
                                                                            >
                                                                                Under Review
                                                                            </button>
                                                                            <button
                                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateDocumentStatus("Needs Correction");
                                                                                    setShowDropdown(false);
                                                                                }}
                                                                            >
                                                                                Needs Correction
                                                                            </button>
                                                                            <button
                                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateDocumentStatus("Rejected");
                                                                                    setShowDropdown(false);
                                                                                }}
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setEditMode(true)}
                                                            >
                                                                <Edit className="w-4 h-4 mr-1" />
                                                                Edit Status
                                                            </Button>
                                                        )}

                                                        {editMode && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditMode(false);
                                                                    setShowDropdown(false);
                                                                }}
                                                                disabled={updatingStatus}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rest of the component remains the same */}
                    <Tabs defaultValue="personal" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">
                                <User className="w-4 h-4 mr-2" />
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger value="land" disabled={!step2Data}>
                                <LandPlot className="w-4 h-4 mr-2" />
                                Land Details
                            </TabsTrigger>
                            <TabsTrigger value="payments">
                                <IndianRupee className="w-4 h-4 mr-2" />
                                Payments ({payments.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg">Basic Details</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Name</p>
                                                        <p className="text-muted-foreground">{farmer.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Phone</p>
                                                        <p className="text-muted-foreground">{farmer.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Email</p>
                                                        <p className="text-muted-foreground">{farmer.email || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Age</p>
                                                        <p className="text-muted-foreground">{farmer.age || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-lg">Farm Details</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="font-medium">Farm Size</p>
                                                    <p className="text-muted-foreground">{farmer.farmSize}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Farm Type</p>
                                                    <p className="text-muted-foreground">{farmer.farmType}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Experience</p>
                                                    <p className="text-muted-foreground">{farmer.farmingExperience} years</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Preferred Fish</p>
                                                    <p className="text-muted-foreground">{farmer.preferredFishType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <h4 className="font-semibold mb-3">Address & Location</h4>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                            <p>{farmer.address}</p>
                                        </div>
                                    </div>

                                    {farmer.notes && (
                                        <div className="mt-6 pt-6 border-t">
                                            <h4 className="font-semibold mb-3">Additional Notes</h4>
                                            <p className="text-muted-foreground">{farmer.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="land">
                            {step2Data ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Land & Document Details</CardTitle>
                                        <CardDescription>
                                            Status: <Badge variant={getStatusBadgeVariant(step2Data.documentStatus)}>
                                                {step2Data.documentStatus}
                                            </Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg">Land Information</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="font-medium">Land Owner</p>
                                                        <p className="text-muted-foreground">{step2Data.landOwner}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Relation</p>
                                                        <p className="text-muted-foreground">{step2Data.landOwnerRelation}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Khatiyan No</p>
                                                        <p className="text-muted-foreground">{step2Data.khatiyanNo}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Plot No</p>
                                                        <p className="text-muted-foreground">{step2Data.plotNo}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Plot Area</p>
                                                        <p className="text-muted-foreground">{step2Data.plotArea.value} {step2Data.plotArea.unit}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg">Location</h4>
                                                {step2Data.landLocation && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="font-medium">Address</p>
                                                            <p className="text-muted-foreground">{step2Data.landLocation.fullAddress}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">Latitude</p>
                                                            <p className="text-muted-foreground">{step2Data.landLocation.latitude}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">Longitude</p>
                                                            <p className="text-muted-foreground">{step2Data.landLocation.longitude}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {step2Data.verificationNotes && (
                                            <div className="mt-6 pt-6 border-t">
                                                <h4 className="font-semibold mb-3">Verification Notes</h4>
                                                <p className="text-muted-foreground">{step2Data.verificationNotes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <LandPlot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-muted-foreground">No land details available yet</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Step 2 verification has not been completed
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="payments">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment History</CardTitle>
                                    <CardDescription>
                                        All payments associated with this farmer
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {payments.length === 0 ? (
                                        <div className="text-center py-6">
                                            <IndianRupee className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-muted-foreground">No payments created yet</p>
                                            {stepCompletion.canMakePayment && (
                                                <Button
                                                    onClick={() => setShowPaymentForm(true)}
                                                    className="mt-2"
                                                >
                                                    <IndianRupee className="w-4 h-4 mr-2" />
                                                    Create First Payment
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {payments.map((payment) => (
                                                <div key={payment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg">{payment.paymentTitle}</h4>
                                                            <p className="text-muted-foreground mt-1">{payment.description}</p>
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                <Badge variant="outline">
                                                                    Amount: ₹{payment.amount?.toLocaleString()}
                                                                </Badge>
                                                                <Badge variant={
                                                                    payment.paymentStatus === "Completed" ? "default" :
                                                                        payment.paymentStatus === "Pending" ? "secondary" : "destructive"
                                                                }>
                                                                    {payment.paymentStatus}
                                                                </Badge>
                                                                <Badge variant="outline">
                                                                    Work: {payment.workStatus}
                                                                </Badge>
                                                            </div>
                                                            {payment.reasonForPayment && (
                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                    <strong>Reason:</strong> {payment.reasonForPayment}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/dashboard/project-manager/farmers/${params.id}/payment/${payment._id}`)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Payment Form Modal */}
                {showPaymentForm && (
                    <PaymentForm
                        farmer={farmer}
                        onClose={() => setShowPaymentForm(false)}
                        onSuccess={() => {
                            setShowPaymentForm(false);
                            fetchFarmerDetails(); // Refresh data
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}