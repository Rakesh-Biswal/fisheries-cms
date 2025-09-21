"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Calculator, Building, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout";
import HireAccountantForm from "@/components/Hrcomponent/HireAccountantForm";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AccountantsPage() {
  const router = useRouter();
  const [accountants, setAccountants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireForm, setShowHireForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccountants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/hr/accountants/fetch-data`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Accountants:", data);
        setAccountants(data.data);
      } else {
        throw new Error("Failed to fetch accountants");
      }
    } catch (err) {
      console.error("Error fetching accountants:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, []);

  const handleHireSuccess = (newAccountant) => {
    // Refresh data and close takeover view
    fetchAccountants();
    setShowHireForm(false);
  };

  const handleViewDetails = (managerId) => {
    router.push(`/dashboard/hr/accountant/profile?id=${managerId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showHireForm ? (
        <div className="bg-white p-2 w-full">
          <div className="rounded-lg">
            <HireAccountantForm
              onClose={() => setShowHireForm(false)}
              onSuccess={handleHireSuccess}
            />
          </div>
        </div>
      ) : (
        // Original page content
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Accountants</h1>
              <p className="text-muted-foreground">
                Manage accounting staff and their responsibilities
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="default" className="bg-green-500 w-fit">
                <Users className="w-4 h-4 mr-1" />
                {accountants.length} Accountants
              </Badge>
              <Button onClick={() => setShowHireForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hire New Accountant
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchAccountants}>Try Again</Button>
              </CardContent>
            </Card>
          ) : accountants.length === 0 ? (
            <Card className="text-center p-8">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Accountants Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by hiring your first accountant to manage financial
                operations.
              </p>
              <Button onClick={() => setShowHireForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Hire First Accountant
              </Button>
            </Card>
          ) : (
            <>
              {/* Accountants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accountants.map((accountant) => (
                  <Card
                    key={accountant._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={accountant.photo || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {accountant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {accountant.name}
                          </CardTitle>
                          <CardDescription>
                            {accountant.businessData?.designation}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Department:
                        </span>
                        <span className="font-medium flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {accountant.businessData?.department || "Finance"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Experience:
                        </span>
                        <span className="font-medium">
                          {accountant.experience || 0} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Qualification:
                        </span>
                        <span className="font-medium">
                          {accountant.qualification || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            accountant.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {accountant.status}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => handleViewDetails(accountant._id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Accountants Overview
                  </CardTitle>
                  <CardDescription>
                    Summary of all accountants and their information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {accountants.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Accountants
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          accountants.filter((a) => a.status === "active")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Accountants
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {accountants.reduce(
                          (sum, accountant) =>
                            sum + (accountant.experience || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Experience (Years)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹
                        {accountants
                          .reduce(
                            (sum, accountant) =>
                              sum + (accountant.businessData?.salary || 0),
                            0
                          )
                          .toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Monthly Salary
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
