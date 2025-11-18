// app/dashboard/project-manager/farmers/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import FarmersTable from "@/components/PM_Component/farmers-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, RefreshCw, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FarmersPage() {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/project-manager/farmers`, {
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
                setFarmers(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch farmers");
            }
        } catch (err) {
            console.error("Error fetching farmers:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter farmers based on search and status
    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch = farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.phone?.includes(searchTerm) ||
            farmer.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "approved" && farmer.hrApproved) ||
            (filterStatus === "pending" && !farmer.hrApproved);

        return matchesSearch && matchesStatus;
    });

    const getStatusCounts = () => {
        const approved = farmers.filter(f => f.hrApproved).length;
        const pending = farmers.filter(f => !f.hrApproved).length;
        return { approved, pending, total: farmers.length };
    };

    const statusCounts = getStatusCounts();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Farmers Management</h1>
                        <p className="text-muted-foreground">Manage all enrolled farmers and their progress</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="default" className="bg-blue-500">
                            <Users className="w-4 h-4 mr-1" />
                            {farmers.length} Farmers
                        </Badge>
                        <Button variant="outline" onClick={fetchFarmers}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Farmers</p>
                                    <p className="text-2xl font-bold">{statusCounts.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold">{statusCounts.approved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Users className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold">{statusCounts.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <CardTitle>All Farmers</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search farmers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full sm:w-64"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FarmersTable
                            farmers={filteredFarmers}
                            loading={loading}
                            error={error}
                            onRefresh={fetchFarmers}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}