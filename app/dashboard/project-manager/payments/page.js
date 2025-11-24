// app/dashboard/project-manager/payments/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, RefreshCw, Search, Eye, Calendar, User, MapPin, FileText } from "lucide-react";
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

            const response = await fetch(`${API_URL}/api/project-manager/payments`, {
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
                setPayments(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch payments");
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500 text-white';
            case 'Pending': return 'bg-amber-500 text-white';
            case 'Processing': return 'bg-blue-500 text-white';
            case 'Failed': return 'bg-red-500 text-white';
            case 'Cancelled': return 'bg-gray-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    const handleViewDetails = (payment) => {
        router.push(`/dashboard/project-manager/farmers/${payment.farmerLeadId._id}/payment/${payment._id}`);
    };

    const filteredPayments = payments.filter(payment => 
        payment.paymentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.farmerLeadId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Payments Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payments Management</h1>
                        <p className="text-gray-600">Monitor and manage all farmer payment transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="default" className="bg-slate-700 text-white">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {payments.length} Payments
                        </Badge>
                        <Button variant="outline" onClick={fetchPayments} disabled={loading} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search Section */}
                <Card className=" border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Payment Records</h3>
                                <p className="text-sm text-gray-600">All payment transactions across farmers</p>
                            </div>
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search payments, farmers, or status..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white border-slate-300 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments List */}
                <Card className=" border-slate-200 shadow-sm">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                                <p className="text-gray-600">Loading payment records...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchPayments} className="bg-blue-600 hover:bg-blue-700">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                                <p className="text-gray-600 font-medium">
                                    {searchTerm ? 'No payments match your search criteria' : 'No payment records found'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Payments will appear here once created for farmers
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 p-6">
                                {filteredPayments.map((payment) => (
                                    <div key={payment._id} className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-white hover:shadow-md transition-all duration-200">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            {/* Left Section - Payment Info */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div className="space-y-2">
                                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                            <FileText className="w-5 h-5 text-blue-600" />
                                                            {payment.paymentTitle}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge className={`${getStatusColor(payment.paymentStatus)} px-3 py-1`}>
                                                                {payment.paymentStatus}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-white text-gray-700 border-slate-300">
                                                                {payment.workStatus}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                                                        <IndianRupee className="w-5 h-5 text-emerald-600" />
                                                        <span className="text-xl font-bold text-emerald-600">
                                                            ₹{payment.amount?.toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Farmer Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <User className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{payment.farmerLeadId.name}</p>
                                                                <p className="text-sm text-gray-600">{payment.farmerLeadId.phone}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {payment.farmerLeadId.address && (
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-red-100 rounded-lg mt-1">
                                                                    <MapPin className="w-4 h-4 text-red-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700">Address</p>
                                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                                        {payment.farmerLeadId.address}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <Calendar className="w-4 h-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">Created Date</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                                <FileText className="w-4 h-4 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">Submissions</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {payment.paymentSubmissions?.length || 0} document(s)
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Payment Description</p>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {payment.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Section - Action Button */}
                                            <div className="lg:w-48 flex lg:justify-center items-start">
                                                <Button 
                                                    onClick={() => handleViewDetails(payment)}
                                                    className="w-full bg-slate-700 hover:bg-slate-800 text-white lg:px-6"
                                                    size="lg"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
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