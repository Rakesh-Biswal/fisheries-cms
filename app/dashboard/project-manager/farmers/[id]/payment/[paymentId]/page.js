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
    ChevronDown,
    ChevronUp,
    AlertTriangle
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

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
    const hasSubmissions = payment.paymentSubmissions && payment.paymentSubmissions.length > 0;

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
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{payment.paymentTitle}</h1>
                                <p className="text-muted-foreground">Payment ID: {payment._id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant={getStatusBadgeVariant(payment.paymentStatus)} className="flex items-center gap-1 text-sm px-3 py-1">
                                {getStatusIcon(payment.paymentStatus)}
                                {payment.paymentStatus}
                            </Badge>

                            {/* Show Submit Payment button for Pending status */}
                            {payment.paymentStatus === "Pending" && (
                                <Button
                                    onClick={() => setShowPaymentForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Upload className="w-4 h-4 mr-1" />
                                    Submit Payment
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Alert for pending verification */}
                    {showVerificationButtons && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-yellow-800">Payment Verification Required</h4>
                                        <p className="text-yellow-700 text-sm">
                                            Payment proof has been submitted and is awaiting your verification.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => updatePaymentStatus("Completed")}
                                            disabled={updatingStatus}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updatePaymentStatus("Cancelled")}
                                            disabled={updatingStatus}
                                            className="border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Details Card - Minimized by default */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Payment Details
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {showPaymentDetails ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                            {showPaymentDetails ? "Hide" : "Show"} Details
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                    {/* Expandable Details */}
                                    {showPaymentDetails && (
                                        <div className="space-y-4 pt-4 border-t border-gray-200">
                                            <div>
                                                <p className="font-medium text-sm text-muted-foreground mb-2">Description</p>
                                                <p className="text-sm bg-gray-50 p-3 rounded-lg border text-gray-700">
                                                    {payment.description}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-sm text-muted-foreground mb-2">Reason for Payment</p>
                                                <p className="text-sm bg-gray-50 p-3 rounded-lg border text-gray-700">
                                                    {payment.reasonForPayment}
                                                </p>
                                            </div>

                                            {payment.requirements && payment.requirements.length > 0 && (
                                                <div>
                                                    <p className="font-medium text-sm text-muted-foreground mb-3">Requirements</p>
                                                    <div className="space-y-2">
                                                        {payment.requirements.map((req, index) => (
                                                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                                                                <div className={`w-2 h-2 rounded-full ${req.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                                <span className="text-sm text-gray-700 flex-1">{req.description}</span>
                                                                {req.isCompleted && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Submissions - Compact Design */}
                            {hasSubmissions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="w-5 h-5 text-green-600" />
                                            Submitted Payment Documents
                                            <Badge variant="secondary" className="ml-2">
                                                {payment.paymentSubmissions.length}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Review the submitted payment proofs for verification
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {payment.paymentSubmissions.map((submission, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                                <p className="font-medium text-gray-900">
                                                                    {submission.submittedBy?.name || 'Unknown User'}
                                                                </p>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {submission.paymentMethod}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                                <span>Submitted: {new Date(submission.submittedAt).toLocaleString('en-IN')}</span>
                                                                {submission.transactionId && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>Transaction ID: {submission.transactionId}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="md:col-span-1">
                                                            <p className="font-medium text-sm text-muted-foreground mb-2">
                                                                Payment Screenshot
                                                            </p>
                                                            <div className="border rounded-lg p-2 bg-gray-50">
                                                                <img
                                                                    src={submission.screenshot}
                                                                    alt="Payment Screenshot"
                                                                    className="rounded-md object-cover w-full h-32 cursor-pointer hover:opacity-90 transition-opacity"
                                                                    onClick={() => window.open(submission.screenshot, '_blank')}
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-full mt-2 text-xs"
                                                                    onClick={() => window.open(submission.screenshot, '_blank')}
                                                                >
                                                                    View Full Size
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2 space-y-2">
                                                            {submission.additionalNotes && (
                                                                <div>
                                                                    <p className="font-medium text-sm text-muted-foreground">
                                                                        Additional Notes
                                                                    </p>
                                                                    <p className="text-sm bg-gray-100 p-2 rounded border text-gray-700">
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
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">Payment Status</span>
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

                            {/* Single Payment Method */}
                            {showPaymentMethods && payment.paymentInfo?.upiIds && payment.paymentInfo.upiIds.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5" />
                                            Company Payment Method
                                        </CardTitle>
                                        <CardDescription>
                                            Use this company-approved payment method
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-sm font-medium text-blue-800 text-center">
                                                    💡 Use only company-approved payment method
                                                </p>
                                            </div>
                                            
                                            {/* Show only the first payment method */}
                                            {payment.paymentInfo.upiIds.slice(0, 1).map((upi, index) => (
                                                <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50 text-center">
                                                    <p className="font-medium text-green-800 text-sm mb-2">{upi.provider}</p>
                                                    <p className="text-lg font-bold text-green-600 break-all my-2">
                                                        {upi.upiId}
                                                    </p>
                                                    {upi.qrCode && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-muted-foreground mb-2">Scan QR Code</p>
                                                            <img
                                                                src={upi.qrCode}
                                                                alt="QR Code"
                                                                className="mx-auto border-2 border-green-300 rounded-lg w-32 h-32 object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Status Management */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Status Management</CardTitle>
                                    <CardDescription>
                                        Update payment status as needed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => updatePaymentStatus("Completed")}
                                            disabled={updatingStatus}
                                            className="w-full justify-start text-green-700 border-green-200 hover:bg-green-50"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark as Completed
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updatePaymentStatus("Processing")}
                                            disabled={updatingStatus}
                                            className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Mark as Processing
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updatePaymentStatus("Pending")}
                                            disabled={updatingStatus}
                                            className="w-full justify-start text-gray-700 border-gray-200 hover:bg-gray-50"
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Mark as Pending
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updatePaymentStatus("Failed")}
                                            disabled={updatingStatus}
                                            className="w-full justify-start text-red-700 border-red-200 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Mark as Failed
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Verification Notes */}
                            {payment.verificationNotes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Verification Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm bg-gray-50 p-3 rounded border text-gray-700">
                                            {payment.verificationNotes}
                                        </p>
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