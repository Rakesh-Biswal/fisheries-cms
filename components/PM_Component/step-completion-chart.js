// components/PM_Component/step-completion-chart.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function StepCompletionChart({ data }) {
    const stepData = data || [
        { step: 'Step 1', completed: 85, pending: 15 },
        { step: 'Step 2', completed: 65, pending: 35 },
        { step: 'Payment Ready', completed: 45, pending: 55 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verification Step Completion</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stepData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="step" width={80} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#10b981" name="Completed" stackId="a" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="pending" fill="#f59e0b" name="Pending" stackId="a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}