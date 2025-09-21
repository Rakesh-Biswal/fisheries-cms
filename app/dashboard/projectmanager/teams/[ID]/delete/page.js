"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";

export default function EmployeeDeletePage() {
  const params = useParams();
  const router = useRouter();

  // Sample employee data - in real app, fetch based on params.id
  const employee = {
    id: params.id,
    name: "Panji Dwi",
    department: "Marketing Team",
    avatar: "/professional-woman.png",
    position: "Project Manager",
    employeeId: "#HY907",
  };

  const handleDelete = () => {
    // In real app, delete from backend
    console.log("Deleting employee:", employee.id);
    // Show success message and redirect
    router.push("/dashboard/teamleader/teams");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DashboardLayout title="Delete Employee">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Delete Confirmation */}
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-900">
              Delete Employee Record
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={employee.avatar || "/placeholder.svg"}
                  alt={employee.name}
                />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-600">{employee.department}</p>
                <p className="text-sm text-gray-500">
                  ID: {employee.employeeId}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">
                ⚠️ This action cannot be undone
              </h4>
              <p className="text-sm text-red-700 mb-3">
                Deleting this employee record will permanently remove:
              </p>
              <ul className="text-sm text-red-700 space-y-1 ml-4">
                <li>• All personal and contact information</li>
                <li>• Contract and employment history</li>
                <li>• Time-off requests and approvals</li>
                <li>• Payroll and compensation records</li>
                <li>• Performance reviews and documents</li>
                <li>• Asset assignments and training records</li>
              </ul>
            </div>

            {/* Alternative Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Consider these alternatives:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1 ml-4">
                <li>• Mark employee as "Inactive" instead of deleting</li>
                <li>• Archive the record for future reference</li>
                <li>• Transfer to a different department</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Employee
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
