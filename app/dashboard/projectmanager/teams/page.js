"use client";

import { useState } from "react";
import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, MapPin } from "lucide-react";

import HireNewWorker from "@/components/PM_Component/HireNewWorker";

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
        <HireNewWorker/>
      </div>
    </DashboardLayout>
  );
}