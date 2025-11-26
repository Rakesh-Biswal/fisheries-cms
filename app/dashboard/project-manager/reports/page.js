// app/dashboard/project-manager/farmers/page.js
"use client";

import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    FileText, 
    Calendar, 
    Download, 
    BarChart3, 
    TrendingUp, 
    Users,
    Clock,
    Wrench,
    Construction
} from "lucide-react";

export default function GenerateReportPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generate Reports</h1>
                        <p className="text-muted-foreground">Comprehensive analytics and insights for your farming operations</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Last 30 Days
                        </Button>
                    </div>
                </div>

                {/* Under Construction Banner */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Construction className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                    Page Under Construction
                                </h3>
                                <p className="text-yellow-700 mb-3">
                                    We're working hard to bring you comprehensive reporting features. 
                                    This section will soon provide detailed analytics, export capabilities, 
                                    and insightful data visualizations for your farming operations.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-yellow-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Expected launch: Coming Soon</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features Preview */}
                

                {/* Contact Support */}
                

                {/* Progress Indicator */}
                
            </div>
        </DashboardLayout>
    );
}