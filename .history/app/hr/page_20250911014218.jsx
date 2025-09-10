"use client";  // ✅ Make this a Client Component

/*
Next.js - HR Portal + Farmer-facing site components (single-file demo)
Place this file inside a Next.js project (e.g. /components/HRPortalDemo.jsx)
and import it into a page (e.g. app/hr/page.jsx).

This file demonstrates:
- HR dynamic domain creation (Recruitment domains)
- Recruit / approve employees (Sales employee profile creation)
- Salary editing
- Domain editing/removal
- Multilingual UI (English, Hindi, Odia)
- Responsive layout (Tailwind CSS)
- Farmer-friendly booking + WhatsApp CTA
*/

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
  hi: {
    hrPortal: "एचआर पोर्टल",
    createDomain: "एचआर डोमेन बनाएं",
    domainPlaceholder: "जैसे: सेल्स एचआर, फील्ड एचआर",
    addDomain: "डोमेन जोड़ें",
    edit: "संपादित करें",
    delete: "हटाएं",
    recruit: "कर्मचारी भर्ती",
    approval: "स्वीकृत / प्रोफ़ाइल बनाएं",
    employeeName: "कर्मचारी का नाम",
    phone: "फोन",
    role: "भूमिका",
    salary: "वेतन",
    domain: "डोमेन",
    submit: "जमा करें",
    employees: "कर्मचारी",
    search: "खोजें",
    language: "भाषा",
    voiceHelper: "वॉइस बुकिंग हेल्पर",
    whatsapp: "व्हाट्सएप",
    farmerBooking: "मछली परियोजना बुक करें",
    salesInfo: "बिक्री जानकारी",
    summary: "एचआर सारांश",
    total: "कुल",
    approved: "स्वीकृत",
    pending: "लंबित",
  },
  or: {
    hrPortal: "HR ପୋର୍ଟାଲ୍",
    createDomain: "HR ଡୋମେନ୍ ବନାନ୍ତୁ",
    domainPlaceholder: "ଉଦାହରଣ: Sales HR, Field HR",
    addDomain: "ଡୋମେନ୍ ଯୋଗ କରନ୍ତୁ",
    edit: "ସମ୍ପାଦନ କରନ୍ତୁ",
    delete: "ମିଟାନ୍ତୁ",
    recruit: "କର୍ମଚାରୀ ନିଯୁକ୍ତି",
    approval: "ଅନୁମୋଦନ / ପ୍ରୋଫାଇଲ୍ ସୃଷ୍ଟି",
    employeeName: "କର୍ମଚାରୀଙ୍କ ନାମ",
    phone: "ଫୋନ୍",
    role: "ଭୂମିକା",
    salary: "ଦରମା",
    domain: "ଡୋମେନ୍",
    submit: "ଦାଖଲ କରନ୍ତୁ",
    employees: "କର୍ମଚାରୀମାନେ",
    search: "ଖୋଜନ୍ତୁ",
    language: "ଭାଷା",
    voiceHelper: "ଭଉସ୍ ବୁକିଂ ସାହାଯ୍ୟ",
    whatsapp: "WhatsApp",
    farmerBooking: "ମାଛ ପ୍ରକଳ୍ପ ବୁକ୍ କରନ୍ତୁ",
    salesInfo: "ବିକ୍ରୟ ସୂଚନା",
    summary: "HR ସାରାଂଶ",
    total: "ମୋଟ",
    approved: "ଅନୁମୋଦିତ",
    pending: "ବିଚାରାଧୀନ",
  },
};

// ---------- Mock data ----------
const initialDomains = ["Sales HR", "Field HR"];
const initialEmployees = [
  { id: 1, name: "Ramesh T", phone: "7000000001", role: "Sales Executive", domain: "Sales HR", salary: 15000, approved: true, notes: "Experienced in village outreach" },
  { id: 2, name: "Sita M", phone: "7000000002", role: "Field Agent", domain: "Field HR", salary: 12000, approved: false, notes: "Pending documents" },
];

export default function HRPortalDemo() {
  const [locale, setLocale] = useState("en");
  const t = LOCALES[locale];

  const [domains, setDomains] = useState(initialDomains);
  const [employees, setEmployees] = useState(initialEmployees);

  const [newDomain, setNewDomain] = useState("");
  const [editingDomain, setEditingDomain] = useState(null);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", role: "", salary: "", domain: domains[0] || "" });

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // setup speech recognition
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
    const id = Date.now();
    const emp = { id, ...form, salary: form.salary ? Number(form.salary) : 0, approved: false, notes: "" };
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-8">
      <header className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.hrPortal}</h1>
        <div className="flex gap-2 items-center">
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="p-2 rounded-lg border">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡ଼ିଆ</option>
          </select>
          <a href={`https://wa.me/91${employees[0]?.phone || "7000000000"}`} className="p-2 rounded-full bg-green-600 text-white text-sm">
            {t.whatsapp}
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6 grid grid-cols-1 gap-6">
        {/* HR Summary */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">{t.summary}</h2>
          <div className="flex gap-6 text-sm">
            <div>{t.total}: {employees.length}</div>
            <div>{t.approved}: {totalApproved}</div>
            <div>{t.pending}: {employees.length - totalApproved}</div>
          </div>
        </section>

        {/* Domain create */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">{t.createDomain}</h2>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder={t.domainPlaceholder} className="flex-1 p-3 rounded-lg border" />
            <button onClick={handleAddDomain} className="p-3 rounded-lg bg-blue-600 text-white">{t.addDomain}</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="px-3 py-1 bg-blue-100 rounded-full text-sm flex items-center gap-2">
                {d}
                <button onClick={() => handleEditDomain(d)} className="text-xs text-blue-600">{t.edit}</button>
                <button onClick={() => handleDeleteDomain(d)} className="text-xs text-red-600">{t.delete}</button>
              </span>
            ))}
          </div>
        </section>

        {/* Recruit employee */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
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
              <button type="button" onClick={toggleListen} className="p-3 rounded-lg border">
                {listening ? "Stop" : t.voiceHelper}
              </button>
            </div>
          </form>
        </section>

        {/* Employees list */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t.employees} ({employees.length})</h2>
            <input placeholder={t.search} value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded-lg border" />
          </div>
          <ul className="space-y-3">
            {visibleEmployees.map((emp) => (
              <li key={emp.id} className="p-3 rounded-lg border flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg">{emp.name[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{emp.name}</div>
                      <div className="text-sm">{emp.role} • {emp.domain}</div>
                      <div className="text-sm">{emp.phone}</div>
                      <div className="text-sm">💰 {t.salary}: ₹{emp.salary}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-2 py-1 rounded text-sm ${emp.approved ? "bg-green-100" : "bg-yellow-100"}`}>{emp.approved ? "Approved" : "Pending"}</div>
                      <div className="flex gap-2">
                        {!emp.approved && <button onClick={() => approveEmployee(emp.id)} className="px-2 py-1 rounded border text-sm">Approve</button>}
                        <button onClick={() => editSalary(emp.id)} className="px-2 py-1 rounded border text-sm">{t.edit} {t.salary}</button>
                        <button onClick={() => deleteEmployee(emp.id)} className="px-2 py-1 rounded border text-sm">{t.delete}</button>
                      </div>
                    </div>
                  </div>
                  {emp.notes && <div className="mt-2 text-sm text-gray-600">Notes: {emp.notes}</div>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
