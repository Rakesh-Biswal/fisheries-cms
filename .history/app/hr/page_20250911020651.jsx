"use client";

import React, { useState, useEffect, useRef } from "react";

// ---------- Enhanced i18n object ----------
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
    employeeId: "Employee ID",
    referId: "Refer ID",
    generateId: "Generate ID",
    notes: "Notes",
    approve: "Approve",
    editSalary: "Edit Salary",
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
    employeeId: "कर्मचारी आईडी",
    referId: "रेफरल आईडी",
    generateId: "आईडी जनरेट करें",
    notes: "नोट्स",
    approve: "अनुमोदित करें",
    editSalary: "वेतन संपादित करें",
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
    employeeId: "କର୍ମଚାରୀ ଆଇଡି",
    referId: "ରେଫରାଲ୍ ଆଇଡି",
    generateId: "ଆଇଡି ଜେନେରେଟ୍ କରନ୍ତୁ",
    notes: "ଟିପ୍ପଣୀ",
    approve: "ଅନୁମୋଦନ କରନ୍ତୁ",
    editSalary: "ଦରମା ସଂପାଦନ କରନ୍ତୁ",
  },
};

// ---------- Mock data ----------
const initialDomains = ["Sales HR", "Field HR"];
const initialEmployees = [
  {
    id: 1,
    empId: "EMP001",
    referId: "REF001",
    name: "Ramesh T",
    phone: "7000000001",
    role: "Sales Executive",
    domain: "Sales HR",
    salary: 15000,
    approved: true,
    notes: "Experienced in village outreach",
  },
  {
    id: 2,
    empId: "EMP002",
    referId: "REF002",
    name: "Sita M",
    phone: "7000000002",
    role: "Field Agent",
    domain: "Field HR",
    salary: 12000,
    approved: false,
    notes: "Pending documents",
  },
];

// Generate unique IDs
function generateEmpId() {
  return `EMP${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateRefId() {
  return `REF${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function HRPortal() {
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
    empId: generateEmpId(),
    referId: generateRefId(),
  });

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "or-IN";
      recognition.continuous = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setForm((prev) => ({ ...prev, name: transcript }));
        setListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
      };
      
      recognition.onend = () => {
        setListening(false);
      };
      
      recognitionRef.current = recognition;
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
    if (!newDn || newDn.trim() === "") return;
    setDomains((d) => d.map((dom) => (dom === oldDomain ? newDn : dom)));
    setEmployees((emps) => 
      emps.map((e) => (e.domain === oldDomain ? { ...e, domain: newDn } : e))
    );
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

  function generateNewIds() {
    setForm((f) => ({ 
      ...f, 
      empId: generateEmpId(), 
      referId: generateRefId() 
    }));
  }

  function saveEmployee(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("Please add name and phone");
    
    const emp = {
      id: Date.now(),
      ...form,
      salary: form.salary ? Number(form.salary) : 0,
      approved: false,
      notes: "",
    };

    setEmployees((emps) => [emp, ...emps]);
    setForm({ 
      name: "", 
      phone: "", 
      role: "", 
      salary: "", 
      domain: domains[0] || "",
      empId: generateEmpId(),
      referId: generateRefId()
    });
  }

  function approveEmployee(id) {
    setEmployees((emps) => emps.map((e) => 
      (e.id === id ? { ...e, approved: true } : e))
    );
  }

  function deleteEmployee(id) {
    if (!confirm("Delete employee?")) return;
    setEmployees((emps) => emps.filter((e) => e.id !== id));
  }

  function editSalary(id) {
    const emp = employees.find(e => e.id === id);
    const newSal = prompt("Enter new salary:", emp.salary);
    if (!newSal || isNaN(newSal)) return;
    setEmployees((emps) => emps.map((e) => 
      (e.id === id ? { ...e, salary: Number(newSal) } : e))
    );
  }

  function toggleListen() {
    if (!recognitionRef.current) return alert("Speech recognition not supported");
    
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error("Speech recognition start failed:", error);
      }
    }
  }

  // ---------- Derived Data ----------
  const visibleEmployees = employees.filter((e) => {
    const q = filter.toLowerCase();
    return (
      !q || 
      e.name.toLowerCase().includes(q) || 
      e.phone.includes(q) || 
      e.domain.toLowerCase().includes(q) ||
      e.empId.toLowerCase().includes(q) ||
      e.referId.toLowerCase().includes(q)
    );
  });

  const totalApproved = employees.filter((e) => e.approved).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">{t.hrPortal}</h1>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
          {t.createDomain}
        </button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
          {t.recruit}
        </button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
          {t.approval}
        </button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
          {t.employees}
        </button>
        
        <div className="mt-auto">
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value)} 
            className="w-full p-2 rounded bg-blue-800 text-white"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡ଼ିଆ</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* HR Summary */}
        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">{t.summary}</h2>
          <div className="flex gap-6 text-sm">
            <div>{t.total}: {employees.length}</div>
            <div>{t.approved}: {totalApproved}</div>
            <div>{t.pending}: {employees.length - totalApproved}</div>
          </div>
        </section>

        {/* Domain Management */}
        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">{t.createDomain}</h2>
          <div className="flex gap-2 mb-3">
            <input 
              value={newDomain} 
              onChange={(e) => setNewDomain(e.target.value)} 
              placeholder={t.domainPlaceholder} 
              className="flex-1 p-2 rounded-lg border" 
            />
            <button 
              onClick={handleAddDomain} 
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {t.addDomain}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <div key={d} className="px-3 py-1 bg-blue-100 rounded-full flex items-center gap-2">
                <span>{d}</span>
                <button 
                  onClick={() => handleEditDomain(d)} 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {t.edit}
                </button>
                <button 
                  onClick={() => handleDeleteDomain(d)} 
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t.delete}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recruit Form */}
        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">{t.recruit}</h2>
          <form onSubmit={saveEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              name="name" 
              value={form.name} 
              onChange={handleFormChange} 
              placeholder={t.employeeName} 
              className="p-3 rounded-lg border" 
            />
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleFormChange} 
              placeholder={t.phone} 
              className="p-3 rounded-lg border" 
            />
            <input 
              name="role" 
              value={form.role} 
              onChange={handleFormChange} 
              placeholder={t.role} 
              className="p-3 rounded-lg border" 
            />
            <input 
              name="salary" 
              value={form.salary} 
              onChange={handleFormChange} 
              placeholder={t.salary} 
              className="p-3 rounded-lg border" 
            />
            <select 
              name="domain" 
              value={form.domain} 
              onChange={handleFormChange} 
              className="p-3 rounded-lg border"
            >
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input 
                  name="empId" 
                  value={form.empId} 
                  readOnly 
                  className="p-3 rounded-lg border bg-gray-100 flex-1" 
                  placeholder={t.employeeId} 
                />
                <input 
                  name="referId" 
                  value={form.referId} 
                  readOnly 
                  className="p-3 rounded-lg border bg-gray-100 flex-1" 
                  placeholder={t.referId} 
                />
              </div>
              <button 
                type="button" 
                onClick={generateNewIds} 
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-sm"
              >
                {t.generateId}
              </button>
            </div>
            
            <div className="sm:col-span-2 flex gap-2">
              <button 
                type="submit" 
                className="flex-1 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                {t.submit}
              </button>
              <button 
                type="button" 
                onClick={toggleListen} 
                className="p-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              >
                {listening ? "Stop" : t.voiceHelper}
              </button>
            </div>
          </form>
        </section>

        {/* Employees list */}
        <section className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t.employees} ({employees.length})</h2>
            <input 
              placeholder={t.search} 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="p-2 rounded-lg border" 
            />
          </div>
          
          <ul className="space-y-3">
            {visibleEmployees.map((emp) => (
              <li key={emp.id} className="p-3 rounded-lg border flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold flex-shrink-0">
                  {emp.name[0]}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold">{emp.name}</div>
                  <div className="text-sm text-gray-600">
                    {t.employeeId}: {emp.empId} • {t.referId}: {emp.referId}
                  </div>
                  <div className="text-sm">{emp.role} • {emp.domain}</div>
                  <div className="text-sm">{emp.phone}</div>
                  <div className="text-sm">💰 {t.salary}: ₹{emp.salary}</div>
                  {emp.notes && (
                    <div className="text-sm text-gray-600 mt-1">
                      {t.notes}: {emp.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded text-sm ${
                    emp.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {emp.approved ? t.approved : t.pending}
                  </div>
                  
                  <div className="flex gap-2">
                    {!emp.approved && (
                      <button 
                        onClick={() => approveEmployee(emp.id)} 
                        className="px-2 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                      >
                        {t.approve}
                      </button>
                    )}
                    <button 
                      onClick={() => editSalary(emp.id)} 
                      className="px-2 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                    >
                      {t.editSalary}
                    </button>
                    <button 
                      onClick={() => deleteEmployee(emp.id)} 
                      className="px-2 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                    >
                      {t.delete}
                    </button>
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