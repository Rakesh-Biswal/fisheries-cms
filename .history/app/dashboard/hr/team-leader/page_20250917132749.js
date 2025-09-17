"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout";

export default function TeamLeaderPage() {
  const [teamLeader] = useState({
    name: "John Doe",
    contact: "john.doe@example.com",
    teamSize: 12,
    performance: "Good",
  });

  const [employees] = useState([
    { id: 1, name: "Suresh Das", sales: 10, report: "Submitted", remarks: "Good progress" },
    { id: 2, name: "Ramesh Nayak", sales: 7, report: "Submitted", remarks: "On track" },
    { id: 3, name: "Prakash Behera", sales: 4, report: "Not Submitted", remarks: "Pending" },
  ]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Team Leader Dashboard</h1>

      {/* Team Leader Info */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Team Leader Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {teamLeader.name}</p>
          <p><strong>Contact:</strong> {teamLeader.contact}</p>
          <p><strong>Team Size:</strong> {teamLeader.teamSize}</p>
          <p><strong>Performance:</strong> {teamLeader.performance}</p>
        </div>
      </section>

      {/* Employee Reports */}
      <section className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Team Members</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Employee Name</th>
              <th className="border p-2">Sales</th>
              <th className="border p-2">Report Status</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2 text-center">{emp.sales}</td>
                <td
                  className={`border p-2 text-center ${
                    emp.report === "Submitted"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }`}
                >
                  {emp.report}
                </td>
                <td className="border p-2">{emp.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
