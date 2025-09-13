"use client";

import { useState } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeamsPage() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      contact: "+91 98765 43210",
      email: "rajesh@email.com",
      property: "Farm Plot A-1",
      rent: "₹15,000",
      status: "Active",
      dueDate: "2024-04-01",
    },
    {
      id: 2,
      name: "Priya Sharma",
      contact: "+91 87654 32109",
      email: "priya@email.com",
      property: "Farm Plot B-2",
      rent: "₹12,000",
      status: "Active",
      dueDate: "2024-04-05",
    },
    {
      id: 3,
      name: "Amit Singh",
      contact: "+91 76543 21098",
      email: "amit@email.com",
      property: "Farm Plot C-3",
      rent: "₹18,000",
      status: "Overdue",
      dueDate: "2024-03-25",
    },
    {
      id: 4,
      name: "Sunita Devi",
      contact: "+91 65432 10987",
      email: "sunita@email.com",
      property: "Farm Plot D-4",
      rent: "₹14,000",
      status: "Active",
      dueDate: "2024-04-10",
    },
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    contact: "",
    email: "",
    property: "",
    rent: "",
    status: "Active",
    dueDate: "",
  });

  const addMember = () => {
    if (!newMember.name || !newMember.email) return;
    setTeams([...teams, { id: Date.now(), ...newMember }]);
    setNewMember({
      name: "",
      contact: "",
      email: "",
      property: "",
      rent: "",
      status: "Active",
      dueDate: "",
    });
  };

  const deleteMember = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  return (
    <DashboardLayout title="Teams">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
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
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold">
                    {teams.filter((t) => t.status === "Active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold">
                    {teams.filter((t) => t.status === "Overdue").length}
                  </p>
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
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹
                    {teams
                      .map((t) => parseInt(t.rent.replace(/₹|,/g, "")) || 0)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Member</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={newMember.email}
                        onChange={(e) =>
                          setNewMember({ ...newMember, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <Input
                        value={newMember.contact}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Property</Label>
                      <Input
                        value={newMember.property}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            property: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Rent</Label>
                      <Input
                        value={newMember.rent}
                        onChange={(e) =>
                          setNewMember({ ...newMember, rent: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newMember.dueDate}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={addMember}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Team Name</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Property</th>
                    <th className="text-left p-4">Monthly Rent</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Due Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {team.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {team.contact}
                      </td>
                      <td className="p-4 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {team.property}
                      </td>
                      <td className="p-4 font-medium">{team.rent}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            team.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {team.status}
                        </Badge>
                      </td>
                      <td className="p-4">{team.dueDate}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMember(team.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}