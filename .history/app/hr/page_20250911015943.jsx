"use client";  // ✅ Make this a Client Component

import React, { useState, useEffect, useRef } from "react";

// ---------- Simple i18n object ----------
const LOCALES = {
  en: {
    hrPortal: "HR Portal",
    createDomain: "Create HR Domain",
    domainPlaceholder: "e.g. Sales HR, Field HR",
    addDomain: "Add Domain",
    edit: "Edit",
    delete: "Delete",
    recruit: "Recruit Employee",
    approval: "Approve / Create Profile",
    employeeId: "Employee ID",
    referId: "Refer ID",
    employeeName: "Employee Name",
    phone: "Phone",
    role: "Role",
    salary: "Salary",
    domain: "Domain",
    submit: "Submit",
    employees: "Employees",
    search: "Search",
    language: "Language",
    voiceHelper: "Voice booking helper",
    whatsapp: "WhatsApp",
    farmerBooking: "Book a Fish Project",
    salesInfo: "Sales Info",
    summary: "HR Summary",
    total: "Total",
    approved: "Approved",
    pending: "Pending",
  },
  // (hi and or translations omitted for brevity, but same as before + employeeId/referId)
};

// ---------- Mock data with Employee ID & Refer ID ----------
const initialDomains = ["Sales HR", "Field HR"];
const initialEmployees = [
  {
    id: 101,
    empId: "EMP101",
    referId: "REF5001",
    name: "Ramesh T",
    phone: "7000000001",
    role: "Sales Executive",
    domain: "Sales HR",
    salary: 15000,
    approved: true,
    notes: "Experienced in village outreach",
  },
  {
    id: 102,
    empId: "EMP102",
    referId: "REF5002",
    name: "Sita M",
    phone: "7000000002",
    role: "Field Agent",
    domain: "Field HR",
    salary: 12000,
    approved: false,
    notes: "Pending documents",
  },
];

export default function HrComponent() {
  const [locale, setLocale] = useState("en");
  const t = LOCALES[locale];

  const [domains, setDomains] = useState(initialDomains);
  const [employees, setEmployees] = useState(initialEmployees);

  const [newDomain, setNewDomain] = useState("");
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    salary: "",
    domain: domains[0] || "",
  });

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const Recog = window.webkitSpeechRecognition || window.SpeechRecognition;
      const r = new Recog();
      r.lang = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "or-IN";
      r.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setForm((prev) => ({ ...prev, name: prev.name ? prev.name + " " + text : text }));
        setListening(false);
      };
      recognitionRef.current = r;
    }
  }, [locale]);

  // ---------- Domain Management ----------
  function handleAddDomain() {
    const dn = newDomain.trim();
    if (!dn) return alert("Enter domain name");
    if (domains.includes(dn)) return alert("Domain already exists");
    setDomains((d) => [...d, dn]);
    setNewDomain("");
  }

  function handleEditDomain(oldDomain) {
    const newDn = prompt("Edit domain name:", oldDomain);
    if (!newDn) return;
    setDomains((d) => d.map((dom) => (dom === oldDomain ? newDn : dom)));
    setEmployees((emps) => emps.map((e) => (e.domain === oldDomain ? { ...e, domain: newDn } : e)));
  }

  function handleDeleteDomain(dn) {
    if (!confirm("Delete domain? Employees under this domain will remain.")) return;
    setDomains((d) => d.filter((dom) => dom !== dn));
  }

  // ---------- Employee Management ----------
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function saveEmployee(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("Please add name and phone");

    // generate empId and referId
    const empId = "EMP" + Date.now().toString().slice(-4);
    const referId = "REF" + Math.floor(Math.random() * 9000 + 1000);

    const emp = {
      id: Date.now(),
      empId,
      referId,
      ...form,
      salary: form.salary ? Number(form.salary) : 0,
      approved: false,
      notes: "",
    };

    setEmployees((emps) => [emp, ...emps]);
    setForm({ name: "", phone: "", role: "", salary: "", domain: domains[0] || "" });
  }

  function approveEmployee(id) {
    setEmployees((emps) => emps.map((e) => (e.id === id ? { ...e, approved: true } : e)));
  }

  function deleteEmployee(id) {
    if (!confirm("Delete employee?")) return;
    setEmployees((emps) => emps.filter((e) => e.id !== id));
  }

  function editSalary(id) {
    const newSal = prompt("Enter new salary:");
    if (!newSal || isNaN(newSal)) return;
    setEmployees((emps) => emps.map((e) => (e.id === id ? { ...e, salary: Number(newSal) } : e)));
  }

  function toggleListen() {
    if (!recognitionRef.current) return alert("Speech recognition not supported");
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  // ---------- Derived Data ----------
  const visibleEmployees = employees.filter((e) => {
    const q = filter.toLowerCase();
    return !q || e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.domain.toLowerCase().includes(q);
  });

  const totalApproved = employees.filter((e) => e.approved).length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">{t.hrPortal}</h1>
        <button className="bg-blue-600 p-2 rounded">{t.createDomain}</button>
        <button className="bg-blue-600 p-2 rounded">{t.recruit}</button>
        <button className="bg-blue-600 p-2 rounded">{t.approval}</button>
        <button className="bg-blue-600 p-2 rounded">{t.employees}</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-b from-blue-50 to-green-50">
        {/* HR Summary */}
        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">{t.summary}</h2>
          <div className="flex gap-6 text-sm">
            <div>{t.total}: {employees.length}</div>
            <div>{t.approved}: {totalApproved}</div>
            <div>{t.pending}: {employees.length - totalApproved}</div>
          </div>
        </section>

        {/* Recruit Form */}
        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">{t.recruit}</h2>
          <form onSubmit={saveEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleFormChange} placeholder={t.employeeName} className="p-3 rounded-lg border" />
            <input name="phone" value={form.phone} onChange={handleFormChange} placeholder={t.phone} className="p-3 rounded-lg border" />
            <input name="role" value={form.role} onChange={handleFormChange} placeholder={t.role} className="p-3 rounded-lg border" />
            <input name="salary" value={form.salary} onChange={handleFormChange} placeholder={t.salary} className="p-3 rounded-lg border" />
            <select name="domain" value={form.domain} onChange={handleFormChange} className="p-3 rounded-lg border">
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 p-3 rounded-lg bg-green-600 text-white">{t.submit}</button>
              <button type="button" onClick={toggleListen} className="p-3 rounded-lg bg-yellow-500 text-white">
                {listening ? "Stop" : t.voiceHelper}
              </button>
            </div>
          </form>
        </section>

        {/* Employees list */}
        <section className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t.employees} ({employees.length})</h2>
            <input placeholder={t.search} value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded-lg border" />
          </div>
          <ul className="space-y-3">
            {visibleEmployees.map((emp) => (
              <li key={emp.id} className="p-3 rounded-lg border flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold">{emp.name}</div>
                  <div className="text-sm">{t.employeeId}: {emp.empId}</div>
                  <div className="text-sm">{t.referId}: {emp.referId}</div>
                  <div className="text-sm">{emp.role} • {emp.domain}</div>
                  <div className="text-sm">{emp.phone}</div>
                  <div className="text-sm">💰 {t.salary}: ₹{emp.salary}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded text-sm ${emp.approved ? "bg-green-100" : "bg-yellow-100"}`}>
                    {emp.approved ? "Approved" : "Pending"}
                  </div>
                  <div className="flex gap-2">
                    {!emp.approved && <button onClick={() => approveEmployee(emp.id)} className="px-2 py-1 rounded bg-green-600 text-white text-sm">Approve</button>}
                    <button onClick={() => editSalary(emp.id)} className="px-2 py-1 rounded bg-blue-600 text-white text-sm">{t.edit} {t.salary}</button>
                    <button onClick={() => deleteEmployee(emp.id)} className="px-2 py-1 rounded bg-red-600 text-white text-sm">{t.delete}</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
