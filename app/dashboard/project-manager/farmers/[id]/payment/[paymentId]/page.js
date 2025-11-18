// app/dashboard/project-manager/farmers/[id]/payment/[paymentId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import PaymentSubmissionForm from "@/components/payment-submission-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    IndianRupee,
    CheckCircle,
    XCircle,
    Clock,
    Upload,
    User,
    Calendar,
    FileText,
    Building,
    Edit,
    MoreVertical
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowDropdown(false);
        };

        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    useEffect(() => {
        if (params.paymentId) {
            fetchPaymentDetails();
        }
    }, [params.paymentId]);

    const fetchPaymentDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/project-manager/payments/${params.paymentId}`, {
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
                setPayment(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch payment details");
            }
        } catch (err) {
            console.error("Error fetching payment details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updatePaymentStatus = async (newStatus) => {
        try {
            setUpdatingStatus(true);

            const response = await fetch(`${API_URL}/api/project-manager/payments/${params.paymentId}/status`, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentStatus: newStatus
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setPayment(result.data);
                setShowDropdown(false);
            } else {
                throw new Error(result.message || "Failed to update payment status");
            }
        } catch (err) {
            console.error("Error updating payment status:", err);
            alert("Failed to update payment status: " + err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePaymentSubmissionSuccess = (updatedPayment) => {
        setPayment(updatedPayment);
        setShowPaymentForm(false);
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Completed":
                return "default";
            case "Failed":
                return "destructive";
            case "Processing":
                return "secondary";
            case "Cancelled":
                return "outline";
            case "Pending":
            default:
                return "secondary";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle className="w-4 h-4" />;
            case "Failed":
                return <XCircle className="w-4 h-4" />;
            case "Processing":
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading payment details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !payment) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-8">
                        <h3 className="text-lg font-semibold mb-2">Failed to load payment details</h3>
                        <p className="text-muted-foreground mb-4">{error || "Payment not found"}</p>
                        <Button onClick={() => router.push(`/dashboard/project-manager/farmers/${params.id}`)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Farmer
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const showPaymentMethods = payment.paymentStatus === "Pending" && payment.paymentSubmissions.length === 0;
    const showVerificationButtons = payment.paymentStatus === "Processing" && payment.paymentSubmissions.length > 0;
    const showEditButton = ["Completed", "Failed", "Cancelled"].includes(payment.paymentStatus);

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" onClick={() => router.push(`/dashboard/project-manager/farmers/${params.id}`)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Farmer
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{payment.paymentTitle}</h1>
                                <p className="text-muted-foreground">Payment ID: {payment._id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant={getStatusBadgeVariant(payment.paymentStatus)} className="flex items-center gap-1">
                                {getStatusIcon(payment.paymentStatus)}
                                {payment.paymentStatus}
                            </Badge>

                            {/* Show Update Status button only for Processing status */}
                            {payment.paymentStatus === "Processing" && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => updatePaymentStatus("Completed")}
                                        disabled={updatingStatus}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve Payment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => updatePaymentStatus("Cancelled")}
                                        disabled={updatingStatus}
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Cancel Payment
                                    </Button>
                                </div>
                            )}

                            {/* Show Submit Payment button for Pending status */}
                            {payment.paymentStatus === "Pending" && (
                                <Button
                                    onClick={() => setShowPaymentForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Upload className="w-4 h-4 mr-1" />
                                    Submit Payment Proof
                                </Button>
                            )}

                            {/* Show Edit button for Completed, Failed, Cancelled status */}
                            {showEditButton && (
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDropdown(!showDropdown);
                                        }}
                                        disabled={updatingStatus}
                                        className="flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit Status
                                    </Button>

                                    {showDropdown && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updatePaymentStatus("Completed");
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Mark as Completed</span>
                                                </div>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updatePaymentStatus("Processing");
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span>Mark as Processing</span>
                                                </div>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updatePaymentStatus("Pending");
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-600" />
                                                    <span>Mark as Pending</span>
                                                </div>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updatePaymentStatus("Failed");
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4" />
                                                    <span>Mark as Failed</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rest of the component remains exactly the same */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <CardTitle>Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <IndianRupee className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-sm text-muted-foreground">Amount</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        ₹{payment.amount?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-sm text-muted-foreground">Created On</p>
                                                    <p className="text-sm font-medium">
                                                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-purple-600" />
                                                <div>
                                                    <p className="font-medium text-sm text-muted-foreground">Work Status</p>
                                                    <Badge variant="outline" className="mt-1">
                                                        {payment.workStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Only show Created By if data exists */}
                                        {payment.projectManagerId?.name && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-orange-600" />
                                                    <div>
                                                        <p className="font-medium text-sm text-muted-foreground">Created By</p>
                                                        <p className="text-sm font-medium">{payment.projectManagerId.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <div>
                                            <p className="font-medium text-sm text-muted-foreground mb-1">Description</p>
                                            <p className="text-sm bg-gray-50 p-3 rounded-lg border">{payment.description}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-sm text-muted-foreground mb-1">Reason for Payment</p>
                                            <p className="text-sm bg-gray-50 p-3 rounded-lg border">{payment.reasonForPayment}</p>
                                        </div>
                                    </div>

                                    {payment.requirements && payment.requirements.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <p className="font-medium text-sm text-muted-foreground mb-3">Requirements</p>
                                            <div className="space-y-2">
                                                {payment.requirements.map((req, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                        <div className={`w-3 h-3 rounded-full ${req.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                        <span className="text-sm flex-1">{req.description}</span>
                                                        {req.isCompleted && (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Submissions */}
                            {payment.paymentSubmissions && payment.paymentSubmissions.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment Submissions</CardTitle>
                                        <CardDescription>
                                            Payment proof submitted by team members
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {payment.paymentSubmissions.map((submission, index) => (
                                                <div key={index} className="border rounded-lg p-4 bg-white">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="space-y-1">
                                                            <p className="font-medium flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                {submission.submittedBy?.name || 'Unknown User'}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                                <span>Role: {submission.submittedBy?.role || submission.submittedByModel}</span>
                                                                <span>•</span>
                                                                <span>Date: {new Date(submission.submittedAt).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline">{submission.paymentMethod}</Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="font-medium text-sm text-muted-foreground mb-2">
                                                                Payment Screenshot
                                                            </p>
                                                            <div className="border rounded-lg p-3 bg-gray-50">
                                                                <Image
                                                                    src={submission.screenshot}
                                                                    alt="Payment Screenshot"
                                                                    width={300}
                                                                    height={200}
                                                                    className="rounded-md object-cover cursor-pointer w-full"
                                                                    onClick={() => window.open(submission.screenshot, '_blank')}
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-full mt-2"
                                                                    onClick={() => window.open(submission.screenshot, '_blank')}
                                                                >
                                                                    View Full Size
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {submission.transactionId && (
                                                                <div>
                                                                    <p className="font-medium text-sm text-muted-foreground">
                                                                        Transaction ID
                                                                    </p>
                                                                    <p className="text-sm font-mono bg-gray-100 p-2 rounded border">
                                                                        {submission.transactionId}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {submission.additionalNotes && (
                                                                <div>
                                                                    <p className="font-medium text-sm text-muted-foreground">
                                                                        Additional Notes
                                                                    </p>
                                                                    <p className="text-sm bg-gray-100 p-2 rounded border">
                                                                        {submission.additionalNotes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Payment Status Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Payment Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">Current Status</span>
                                            <Badge variant={getStatusBadgeVariant(payment.paymentStatus)}>
                                                {payment.paymentStatus}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">Work Status</span>
                                            <Badge variant="outline">{payment.workStatus}</Badge>
                                        </div>
                                        {payment.verifiedBy && (
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm font-medium">Verified By</span>
                                                <span className="text-sm">{payment.verifiedBy?.name}</span>
                                            </div>
                                        )}
                                        {payment.verifiedAt && (
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm font-medium">Verified At</span>
                                                <span className="text-sm">
                                                    {new Date(payment.verifiedAt).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* UPI Payment Methods - Only show for Pending status with no submissions */}
                            {showPaymentMethods && payment.paymentInfo?.upiIds && payment.paymentInfo.upiIds.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5" />
                                            Company Payment Methods
                                        </CardTitle>
                                        <CardDescription>
                                            Use these company-approved payment methods
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-sm font-medium text-blue-800 text-center">
                                                    💡 Only use company-approved payment methods
                                                </p>
                                            </div>
                                            {payment.paymentInfo.upiIds.map((upi, index) => (
                                                <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                                                    <p className="font-medium text-green-800 text-sm">{upi.provider}</p>
                                                    <p className="text-lg font-bold text-green-600 break-all my-2 text-center">
                                                        {upi.upiId}
                                                    </p>
                                                    {upi.qrCode && (
                                                        <div className="mt-3 text-center">
                                                            <p className="text-sm text-muted-foreground mb-2">Scan QR Code</p>
                                                            <Image
                                                                src={upi.qrCode}
                                                                alt="QR Code"
                                                                width={120}
                                                                height={120}
                                                                className="mx-auto border-2 border-green-300 rounded-lg"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Bank Details */}
                                            {payment.paymentInfo.bankDetails && (
                                                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                                    <p className="font-medium text-blue-800 mb-3 text-sm">Bank Transfer Details</p>
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Account Name:</span>
                                                            <span>{payment.paymentInfo.bankDetails.accountName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Account Number:</span>
                                                            <span>{payment.paymentInfo.bankDetails.accountNumber}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Bank:</span>
                                                            <span>{payment.paymentInfo.bankDetails.bankName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">IFSC:</span>
                                                            <span>{payment.paymentInfo.bankDetails.ifscCode}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Branch:</span>
                                                            <span>{payment.paymentInfo.bankDetails.branch}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment Verification Section - Show for Processing status */}
                            {showVerificationButtons && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Payment Verification
                                        </CardTitle>
                                        <CardDescription>
                                            Review the submitted payment proof
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <p className="text-sm font-medium text-yellow-800 text-center">
                                                    ⚠️ Payment proof submitted for verification
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => updatePaymentStatus("Completed")}
                                                    disabled={updatingStatus}
                                                    className="bg-green-600 hover:bg-green-700 flex-1"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => updatePaymentStatus("Cancelled")}
                                                    disabled={updatingStatus}
                                                    className="flex-1"
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Verification Notes */}
                            {payment.verificationNotes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Verification Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm bg-gray-50 p-3 rounded border">{payment.verificationNotes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Submission Form Component */}
                {showPaymentForm && (
                    <PaymentSubmissionForm
                        paymentId={params.paymentId}
                        onSuccess={handlePaymentSubmissionSuccess}
                        onClose={() => setShowPaymentForm(false)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}