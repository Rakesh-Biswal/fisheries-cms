// components/PM_Component/pending-actions.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, FileCheck, IndianRupee, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingActions({ data }) {
    const router = useRouter();
    const pendingActions = data || [];

    const getActionIcon = (type) => {
        switch (type) {
            case 'approval': return <FileCheck className="w-4 h-4" />;
            case 'payment': return <IndianRupee className="w-4 h-4" />;
            case 'verification': return <Clock className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getActionColor = (type) => {
        switch (type) {
            case 'approval': return 'text-blue-600 bg-blue-100';
            case 'payment': return 'text-green-600 bg-green-100';
            case 'verification': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleActionClick = (action) => {
        if (action.farmerId) {
            router.push(`/dashboard/project-manager/farmers/${action.farmerId}`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pendingActions.length === 0 ? (
                        <div className="text-center py-6">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                            <p className="text-muted-foreground">No pending actions</p>
                            <p className="text-sm text-muted-foreground">All tasks are up to date</p>
                        </div>
                    ) : (
                        pendingActions.map((action, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleActionClick(action)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-full ${getActionColor(action.type)}`}>
                                        {getActionIcon(action.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{action.title}</p>
                                        <p className="text-sm text-muted-foreground">{action.description}</p>
                                    </div>
                                </div>
                                <Badge className={getPriorityColor(action.priority)}>
                                    {action.priority}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}