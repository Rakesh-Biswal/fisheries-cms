// components/PM_Component/recent-farmers-table.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Calendar, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecentFarmersTable({ data, onViewAll }) {
    const router = useRouter();
    const farmers = data || [];

    const handleViewFarmer = (farmerId) => {
        router.push(`/dashboard/project-manager/farmers/${farmerId}`);
    };

    const getStatusBadge = (farmer) => {
        if (farmer.hrApproved) return { label: "Approved", variant: "default" };
        if (farmer.teamLeaderApproved) return { label: "TL Approved", variant: "secondary" };
        if (farmer.salesEmployeeApproved) return { label: "SE Approved", variant: "outline" };
        return { label: "Pending", variant: "destructive" };
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Farmers</CardTitle>
                <Button variant="outline" onClick={onViewAll}>
                    <Users className="w-4 h-4 mr-2" />
                    View All Farmers
                </Button>
            </CardHeader>
            <CardContent>
                {farmers.length === 0 ? (
                    <div className="text-center py-6">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No farmers enrolled yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {farmers.map((farmer) => {
                            const status = getStatusBadge(farmer);
                            return (
                                <div key={farmer._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{farmer.name}</h4>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <div className="flex items-center space-x-1">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{farmer.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(farmer.createdAt).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewFarmer(farmer._id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}