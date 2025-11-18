// components/PM_Component/farmer-enrollment-chart.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function FarmerEnrollmentChart({ data }) {
    const chartData = data || [
        { month: 'Jan', enrolled: 12, approved: 8 },
        { month: 'Feb', enrolled: 18, approved: 14 },
        { month: 'Mar', enrolled: 15, approved: 12 },
        { month: 'Apr', enrolled: 22, approved: 18 },
        { month: 'May', enrolled: 19, approved: 15 },
        { month: 'Jun', enrolled: 25, approved: 20 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Farmer Enrollment Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled Farmers" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="approved" fill="#10b981" name="Approved Farmers" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}