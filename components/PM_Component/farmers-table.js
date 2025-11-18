// components/PM_Component/farmers-table.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, AlertCircle, Users } from "lucide-react";

export default function FarmersTable({ farmers, loading, error, onRefresh }) {
    const router = useRouter();

    const handleViewFarmer = (farmerId) => {
        router.push(`/dashboard/project-manager/farmers/${farmerId}`);
    };

    const getStatusBadge = (farmer) => {
        if (farmer.hrApproved) return { label: "Approved", variant: "default" };
        if (farmer.teamLeaderApproved) return { label: "TL Approved", variant: "secondary" };
        if (farmer.salesEmployeeApproved) return { label: "SE Approved", variant: "outline" };
        return { label: "Pending", variant: "destructive" };
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-muted-foreground">Loading farmers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load farmers</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        );
    }

    if (farmers.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No farmers found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-semibold">Farmer Name</th>
                        <th className="text-left p-4 font-semibold">Contact</th>
                        <th className="text-left p-4 font-semibold">Farm Details</th>
                        <th className="text-left p-4 font-semibold">Preferred Fish</th>
                        <th className="text-left p-4 font-semibold">Enrollment Date</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {farmers.map((farmer) => {
                        const status = getStatusBadge(farmer);
                        return (
                            <tr key={farmer._id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium">{farmer.name}</td>
                                <td className="p-4">
                                    <div>
                                        <p className="font-medium">{farmer.phone}</p>
                                        <p className="text-sm text-muted-foreground">{farmer.email || "No email"}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div>
                                        <p>{farmer.farmSize}</p>
                                        <p className="text-sm text-muted-foreground">{farmer.farmType}</p>
                                    </div>
                                </td>
                                <td className="p-4">{farmer.preferredFishType}</td>
                                <td className="p-4">
                                    {new Date(farmer.createdAt).toLocaleDateString('en-IN')}
                                </td>
                                <td className="p-4">
                                    <Badge variant={status.variant}>
                                        {status.label}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewFarmer(farmer._id)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}