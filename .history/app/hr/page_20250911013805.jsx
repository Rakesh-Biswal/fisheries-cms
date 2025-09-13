"use client";

import React, { useState } from "react";

export default function HRDashboard() {
  const [domains, setDomains] = useState(["Sales", "Marketing", "Tech"]);
  const [employees, setEmployees] = useState([
    { id: 1, name: "Amit Kumar", domain: "Sales", salary: 25000 },
    { id: 2, name: "Sita Rani", domain: "Tech", salary: 30000 },
  ]);

  const [newDomain, setNewDomain] = useState("");
  const [newEmployee, setNewEmployee] = useState({ name: "", domain: "", salary: "" });

  // --- Domain Functions ---
  const addDomain = () => {
    if (newDomain.trim() !== "" && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
    }
  };

  const deleteDomain = (domain) => {
    setDomains(domains.filter((d) => d !== domain));
    setEmployees(employees.filter((e) => e.domain !== domain));
  };

  // --- Employee Functions ---
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.domain && newEmployee.salary) {
      setEmployees([
        ...employees,
        { id: Date.now(), ...newEmployee, salary: parseInt(newEmployee.salary, 10) },
      ]);
      setNewEmployee({ name: "", domain: "", salary: "" });
    }
  };

  const updateSalary = (id, newSalary) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, salary: parseInt(newSalary, 10) } : emp
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // --- Stats ---
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = totalEmployees ? Math.round(totalSalary / totalEmployees) : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">HR Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-xl font-bold">{totalEmployees}</h2>
          <p>Total Employees</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-xl font-bold">₹{totalSalary}</h2>
          <p>Total Payroll</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-xl font-bold">₹{avgSalary}</h2>
          <p>Average Salary</p>
        </div>
      </div>

      {/* Domain Management */}
      <div className="bg-white shadow p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Domains</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="New Domain"
            className="border p-2 rounded w-full"
          />
          <button onClick={addDomain} className="bg-green-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {domains.map((d, i) => (
            <li key={i} className="flex justify-between items-center border p-2 rounded">
              <span>{d}</span>
              <button
                onClick={() => deleteDomain(d)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Management */}
      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Manage Employees</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <input
            type="text"
            placeholder="Employee Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={newEmployee.domain}
            onChange={(e) => setNewEmployee({ ...newEmployee, domain: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Domain</option>
            {domains.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button onClick={addEmployee} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          Add Employee
        </button>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Domain</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.domain}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={emp.salary}
                    onChange={(e) => updateSalary(emp.id, e.target.value)}
                    className="border p-1 rounded w-24"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
