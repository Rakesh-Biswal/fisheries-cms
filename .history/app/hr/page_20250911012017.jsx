/*
Next.js - HR Portal + Farmer-facing site components (single-file demo)
Place this file inside a Next.js project (e.g. /components/HRPortal.jsx) and import it into a page (e.g. pages/hr.js).

This file is a self-contained, readable React component that demonstrates:
- HR dynamic domain creation (Recruitment domains)
- Recruit / approve employees (Sales employee profile creation)
- Multilingual UI (English, Hindi, Odia) via a small i18n object
- Mobile-first responsive layout using Tailwind-like utility class names (Tailwind recommended)
- Farmer-friendly elements: large buttons, voice booking helper, WhatsApp shortcuts
- Mock API placeholders for where to integrate backend/DB (Next.js API routes or external APIs)
- Accessibility considerations and comments

Notes to integrate:
1) Ensure Tailwind CSS is installed or replace classNames with your CSS. The component uses utility classes for brevity.
2) Replace mock functions (e.g. saveEmployee, fetchEmployees) with real API calls.
3) For multi-language support in production, replace the simple i18n with next-i18next or similar.
*/

import React, { useState, useEffect, useRef } from 'react';

// ---------- Simple i18n object (expandable) ----------
const LOCALES = {
  en: {
    hrPortal: 'HR Portal',
    createDomain: 'Create HR Domain',
    domainPlaceholder: 'e.g. Sales HR, Field HR',
    addDomain: 'Add Domain',
    recruit: 'Recruit Employee',
    approval: 'Approve / Create Profile',
    employeeName: 'Employee Name',
    phone: 'Phone',
    role: 'Role',
    domain: 'Domain',
    submit: 'Submit',
    employees: 'Employees',
    search: 'Search',
    language: 'Language',
    voiceHelper: 'Voice booking helper',
    whatsapp: 'WhatsApp',
    farmerBooking: 'Book a Fish Project',
    salesInfo: 'Sales Info',
  },
  hi: {
    hrPortal: 'एचआर पोर्टल',
    createDomain: 'एचआर डोमेन बनाएं',
    domainPlaceholder: 'जैसे: सेल्स एचआर, फील्ड एचआर',
    addDomain: 'डोमेन जोड़ें',
    recruit: 'कर्मचारी भर्ती',
    approval: 'स्वीकृत / प्रोफ़ाइल बनाएं',
    employeeName: 'कर्मचारी का नाम',
    phone: 'फोन',
    role: 'भूमिका',
    domain: 'डोमेन',
    submit: 'जमा करें',
    employees: 'कर्मचारी',
    search: 'खोजें',
    language: 'भाषा',
    voiceHelper: 'वॉइस बुकिंग हेल्पर',
    whatsapp: 'व्हाट्सएप',
    farmerBooking: 'मछली परियोजना बुक करें',
    salesInfo: 'बिक्री जानकारी',
  },
  or: {
    hrPortal: 'HR ପୋର୍ଟାଲ୍',
    createDomain: 'HR ଡୋମେନ୍ ବନାନ୍ତୁ',
    domainPlaceholder: 'ଉଦାହରଣ: Sales HR, Field HR',
    addDomain: 'ଡୋମେନ୍ ଯୋଗ କରନ୍ତୁ',
    recruit: 'କର୍ମଚାରୀ ନିଯୁକ୍ତି',
    approval: 'ଅନୁମୋଦନ / ପ୍ରୋଫାଇଲ୍ ସୃଷ୍ଟି',
    employeeName: 'କର୍ମଚାରୀଙ୍କ ନାମ',
    phone: 'ଫୋନ୍',
    role: 'ଭୂମିକା',
    domain: 'ଡୋମେନ୍',
    submit: 'ଦାଖଲ କରନ୍ତୁ',
    employees: 'କର୍ମଚାରୀମାନେ',
    search: 'ଖୋଜନ୍ତୁ',
    language: 'ଭାଷା',
    voiceHelper: 'ଭଉସ୍ ଆଧାରିତ ବୁକିଂ ସାହାଯ୍ୟ',
    whatsapp: 'WhatsApp',
    farmerBooking: 'ମାଛ ପ୍ରକଳ୍ପ ବୁକ୍ କରନ୍ତୁ',
    salesInfo: 'ବିକ୍ରୟ ସୂଚନା',
  },
};

// ---------- Mock storage for demo (replace with API/db) ----------
const initialDomains = ['Sales HR', 'Field HR'];
const initialEmployees = [
  { id: 1, name: 'Ramesh T', phone: '7000000001', role: 'Sales Executive', domain: 'Sales HR', approved: true, notes: 'Experienced in village outreach' },
  { id: 2, name: 'Sita M', phone: '7000000002', role: 'Field Agent', domain: 'Field HR', approved: false, notes: 'Pending documents' },
];

export default function HRPortalDemo() {
  // UI locale
  const [locale, setLocale] = useState('en');
  const t = LOCALES[locale];

  // Domains & employees
  const [domains, setDomains] = useState(initialDomains);
  const [employees, setEmployees] = useState(initialEmployees);

  // Form state
  const [newDomain, setNewDomain] = useState('');
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', role: '', domain: domains[0] || '' });

  // Voice recognition
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // initialize speech recognition if available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const Recog = window.webkitSpeechRecognition || window.SpeechRecognition;
      const r = new Recog();
      r.continuous = false;
      r.interimResults = false;
      r.lang = locale === 'en' ? 'en-IN' : locale === 'hi' ? 'hi-IN' : 'or-IN';
      r.onresult = (e) => {
        const text = e.results[0][0].transcript;
        // Simple parsing: fill the name field if empty else notes
        setForm((prev) => ({ ...prev, name: prev.name ? prev.name + ' ' + text : text }));
        setListening(false);
      };
      recognitionRef.current = r;
    }
  }, [locale]);

  // ---------- Domain handlers ----------
  function handleAddDomain() {
    const dn = newDomain.trim();
    if (!dn) return alert('Enter domain name');
    if (domains.includes(dn)) return alert('Domain already exists');
    setDomains((d) => [...d, dn]);
    setNewDomain('');
    // TODO: call API to persist domain
  }

  // ---------- Employee handlers ----------
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function saveEmployee(e) {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.phone) return alert('Please add name and phone');
    const id = Date.now();
    const emp = { id, ...form, approved: false, notes: '' };
    setEmployees((emps) => [emp, ...emps]);
    setForm({ name: '', phone: '', role: '', domain: domains[0] || '' });
    // TODO: POST to /api/employees to save server-side
  }

  function approveEmployee(id) {
    setEmployees((emps) => emps.map((e) => (e.id === id ? { ...e, approved: true } : e)));
    // TODO: PATCH /api/employees/:id
  }

  function deleteEmployee(id) {
    if (!confirm('Delete employee?')) return;
    setEmployees((emps) => emps.filter((e) => e.id !== id));
    // TODO: DELETE /api/employees/:id
  }

  // ---------- Search / Filter ----------
  const visibleEmployees = employees.filter((e) => {
    const q = filter.toLowerCase();
    if (!q) return true;
    return (e.name || '').toLowerCase().includes(q) || (e.phone || '').includes(q) || (e.domain || '').toLowerCase().includes(q);
  });

  // ---------- Voice control ----------
  function toggleListen() {
    if (!recognitionRef.current) return alert('Speech recognition not supported in this browser');
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.lang = locale === 'en' ? 'en-IN' : locale === 'hi' ? 'hi-IN' : 'or-IN';
      recognitionRef.current.start();
      setListening(true);
    }
  }

  // ---------- Simple export / mock CSV download ----------
  function exportEmployeesCSV() {
    const header = ['id', 'name', 'phone', 'role', 'domain', 'approved'];
    const rows = employees.map((r) => [r.id, r.name, r.phone, r.role, r.domain, r.approved]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Simple Sales Profile creator for selected employees ----------
  function createSalesProfile(emp) {
    // In real app, this would open a wizard and collect targets, territories, incentives
    const profile = { territory: 'Nearby villages', monthlyTarget: 200, incentives: '5%' };
    alert(`Sales profile created for ${emp.name}: ${JSON.stringify(profile)}`);
    // TODO: POST /api/sales-profiles
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-8">
      <header className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.hrPortal}</h1>
        <div className="flex gap-2 items-center">
          <select
            aria-label={t.language}
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="p-2 rounded-lg border"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡ଼ିଆ</option>
          </select>
          <a href={`https://wa.me/91${employees[0]?.phone || '7000000000'}`} aria-label="WhatsApp" className="p-2 rounded-full bg-green-600 text-white text-sm">
            {t.whatsapp}
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6 grid grid-cols-1 gap-6">
        {/* Domains card */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">{t.createDomain}</h2>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              aria-label={t.domainPlaceholder}
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder={t.domainPlaceholder}
              className="flex-1 p-3 rounded-lg border"
            />
            <button onClick={handleAddDomain} className="p-3 rounded-lg bg-blue-600 text-white">
              {t.addDomain}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="px-3 py-1 bg-blue-100 rounded-full text-sm">
                {d}
              </span>
            ))}
          </div>
        </section>

        {/* Recruit Form and Voice helper */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">{t.recruit}</h2>
          <form onSubmit={saveEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleFormChange} placeholder={t.employeeName} className="p-3 rounded-lg border" />
            <input name="phone" value={form.phone} onChange={handleFormChange} placeholder={t.phone} className="p-3 rounded-lg border" />

            <input name="role" value={form.role} onChange={handleFormChange} placeholder={t.role} className="p-3 rounded-lg border" />

            <select name="domain" value={form.domain} onChange={handleFormChange} className="p-3 rounded-lg border">
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 p-3 rounded-lg bg-green-600 text-white">{t.submit}</button>
              <button type="button" onClick={toggleListen} className="p-3 rounded-lg border">
                {listening ? 'Stop' : t.voiceHelper}
              </button>
            </div>
          </form>
        </section>

        {/* Employee list + actions */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t.employees} ({employees.length})</h2>
            <div className="flex gap-2">
              <input placeholder={t.search} value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded-lg border" />
              <button onClick={exportEmployeesCSV} className="p-2 rounded-lg border">Export</button>
            </div>
          </div>

          <ul className="space-y-3">
            {visibleEmployees.map((emp) => (
              <li key={emp.id} className="p-3 rounded-lg border flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg">{(emp.name || 'U')[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{emp.name}</div>
                      <div className="text-sm">{emp.role} • {emp.domain}</div>
                      <div className="text-sm">{emp.phone}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-2 py-1 rounded text-sm ${emp.approved ? 'bg-green-100' : 'bg-yellow-100'}`}>{emp.approved ? 'Approved' : 'Pending'}</div>
                      <div className="flex gap-2">
                        {!emp.approved && (
                          <button onClick={() => approveEmployee(emp.id)} className="px-2 py-1 rounded border text-sm">Approve</button>
                        )}
                        <button onClick={() => createSalesProfile(emp)} className="px-2 py-1 rounded border text-sm">{t.salesInfo}</button>
                        <button onClick={() => deleteEmployee(emp.id)} className="px-2 py-1 rounded border text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                  {emp.notes && <div className="mt-2 text-sm text-gray-600">Notes: {emp.notes}</div>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick farmer booking CTA and success stories */}
        <section className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Farmer Booking</h3>
            <p className="text-sm">Simple booking call-to-action for field agents to help farmers book projects fast.</p>
            <a href="#" className="p-3 rounded-lg bg-blue-600 text-white text-center">{t.farmerBooking}</a>
            <a className="p-3 rounded-lg border text-center" href={`https://wa.me/91${employees[0]?.phone || '7000000000'}`}>{t.whatsapp}</a>
          </div>

          <div>
            <h3 className="font-semibold">Success Stories</h3>
            <blockquote className="mt-2 p-3 bg-green-50 rounded">"With help from the platform our pond yield increased 3x — Ram, 2024"</blockquote>
            <blockquote className="mt-2 p-3 bg-blue-50 rounded">"Government subsidy made construction affordable — Sita, 2023"</blockquote>
          </div>
        </section>

        {/* Footer - simple */}
        <footer className="text-center p-4 text-sm text-gray-600">© {new Date().getFullYear()} Fisheries Project — HR & Field Management</footer>
      </main>
    </div>
  );
}
