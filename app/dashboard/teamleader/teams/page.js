// app/dashboard/teamleader/teams/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Building,
  Mail,
  Phone,
  Badge,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TeamsPage() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/tl/teams/my-team`, {
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
        setTeamData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch team data");
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      setUpdatingStatus(true);

      const response = await fetch(`${API_URL}/api/tl/teams/employee/${employeeId}/status`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh team data
        fetchTeamData();
      } else {
        throw new Error(result.message || "Failed to update employee status");
      }
    } catch (err) {
      console.error("Error updating employee status:", err);
      alert("Failed to update employee status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleView = (employeeId) => {
    router.push(`/dashboard/teamleader/teams/view/${employeeId}`);
  };

  const handleEdit = (employeeId) => {
    router.push(`/dashboard/teamleader/teams/${employeeId}/edit`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <UserCheck className="w-4 h-4" /> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
            <UserX className="w-4 h-4" /> Inactive
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            <XCircle className="w-4 h-4" /> Suspended
          </span>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Team">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !teamData) {
    return (
      <DashboardLayout title="My Team">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load team data</h3>
            <p className="text-muted-foreground mb-4">{error || "No team data available"}</p>
            <Button onClick={fetchTeamData}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { team, workers, statistics } = teamData;

  return (
    <DashboardLayout title="My Team">
      <div className="space-y-6">
        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statistics.totalWorkers}</p>
                <p className="text-sm text-gray-600">Total Team Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statistics.activeWorkers}</p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <UserX className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statistics.inactiveWorkers}</p>
                <p className="text-sm text-gray-600">Inactive Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{team.performanceScore || 'N/A'}</p>
                <p className="text-sm text-gray-600">Team Performance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Information */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Information</h3>
                <div className="space-y-2">
                  <p><strong>Team Name:</strong> {team.name}</p>
                  <p><strong>Description:</strong> {team.description || 'No description'}</p>
                  <p><strong>Region:</strong> {team.region || 'Not specified'}</p>
                  <p><strong>Project:</strong> {team.project || 'Not assigned'}</p>
                  <p><strong>Created By:</strong> {team.createdBy?.name || 'HR'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Leader</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={team.leader?.photo} alt={team.leader?.name} />
                    <AvatarFallback>
                      {team.leader?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{team.leader?.name}</p>
                    <p className="text-sm text-gray-600">{team.leader?.companyEmail}</p>
                    <p className="text-sm text-gray-600">{team.leader?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Team Members Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Employee Details
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Contact Information
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Qualifications
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No sales employees assigned to your team yet.</p>
                    </td>
                  </tr>
                ) : (
                  workers.map((employee) => (
                    <tr key={employee._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={employee.photo} alt={employee.name} />
                            <AvatarFallback>
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Badge className="w-4 h-4" />
                              {employee.empCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {employee.companyEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {employee.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            {employee.qualification || 'Not specified'}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            {employee.experience || 0} years experience
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(employee.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(employee._id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          {employee.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEmployeeStatus(employee._id, 'inactive')}
                              disabled={updatingStatus}
                              className="flex items-center gap-1"
                            >
                              <UserX className="w-4 h-4" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEmployeeStatus(employee._id, 'active')}
                              disabled={updatingStatus}
                              className="flex items-center gap-1"
                            >
                              <UserCheck className="w-4 h-4" />
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}