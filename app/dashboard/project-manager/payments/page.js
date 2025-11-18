// app/dashboard/project-manager/payments/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, RefreshCw, Search, Filter, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);

            // This would typically fetch all payments across farmers
            // For now, we'll show a placeholder
            setPayments([]);

        } catch (err) {
            console.error("Error fetching payments:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout title="Payments Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Payments Management</h1>
                        <p className="text-muted-foreground">Manage all farmer payments and transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="default" className="bg-blue-500">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {payments.length} Payments
                        </Badge>
                        <Button variant="outline" onClick={fetchPayments}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <CardTitle>All Payments</CardTitle>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search payments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full sm:w-64"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                                <p className="text-muted-foreground">Loading payments...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchPayments}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-12">
                                <IndianRupee className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No payments found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Payments will appear here when created for farmers
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <div key={payment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-lg">{payment.paymentTitle}</h4>
                                                    <Badge className={getStatusColor(payment.paymentStatus)}>
                                                        {payment.paymentStatus}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground mb-2">{payment.description}</p>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <span className="font-medium">Amount: ₹{payment.amount?.toLocaleString('en-IN')}</span>
                                                    <span className="text-muted-foreground">
                                                        Farmer: {payment.farmerName}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        Created: {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}