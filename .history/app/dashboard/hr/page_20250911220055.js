"use client"

import { useState, useEffect, useRef } from "react"

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
}

// ---------- Mock data ----------
const initialDomains = ["Sales HR", "Field HR"]
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
]

// Generate unique IDs
function generateEmpId() {
  return `EMP${Math.floor(1000 + Math.random() * 9000)}`
}

function generateRefId() {
  return `REF${Math.floor(1000 + Math.random() * 9000)}`
}

export default function HRPortal() {
   const router = useRouter();
  const [locale, setLocale] = useState("en")
  const t = LOCALES[locale]

  const [domains, setDomains] = useState(initialDomains)
  const [employees, setEmployees] = useState(initialEmployees)

  const [newDomain, setNewDomain] = useState("")
  const [filter, setFilter] = useState("")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    salary: "",
    domain: domains[0] || "",
    empId: generateEmpId(),
    referId: generateRefId(),
  })

  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "or-IN"
      recognition.continuous = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setForm((prev) => ({ ...prev, name: transcript }))
        setListening(false)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setListening(false)
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [locale])

  // ---------- Domain Management ----------
  function handleAddDomain() {
    const dn = newDomain.trim()
    if (!dn) return alert("Enter domain name")
    if (domains.includes(dn)) return alert("Domain already exists")
    setDomains((d) => [...d, dn])
    setNewDomain("")
  }

  function handleEditDomain(oldDomain) {
    const newDn = prompt("Edit domain name:", oldDomain)
    if (!newDn || newDn.trim() === "") return
    setDomains((d) => d.map((dom) => (dom === oldDomain ? newDn : dom)))
    setEmployees((emps) => emps.map((e) => (e.domain === oldDomain ? { ...e, domain: newDn } : e)))
  }

  function handleDeleteDomain(dn) {
    if (!confirm("Delete domain? Employees under this domain will remain.")) return
    setDomains((d) => d.filter((dom) => dom !== dn))
  }

  // ---------- Employee Management ----------
  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function generateNewIds() {
    setForm((f) => ({
      ...f,
      empId: generateEmpId(),
      referId: generateRefId(),
    }))
  }

  function saveEmployee(e) {
    e.preventDefault()
    if (!form.name || !form.phone) return alert("Please add name and phone")

    const emp = {
      id: Date.now(),
      ...form,
      salary: form.salary ? Number(form.salary) : 0,
      approved: false,
      notes: "",
    }

    setEmployees((emps) => [emp, ...emps])
    setForm({
      name: "",
      phone: "",
      role: "",
      salary: "",
      domain: domains[0] || "",
      empId: generateEmpId(),
      referId: generateRefId(),
    })
  }

  function approveEmployee(id) {
    setEmployees((emps) => emps.map((e) => (e.id === id ? { ...e, approved: true } : e)))
  }

  function deleteEmployee(id) {
    if (!confirm("Delete employee?")) return
    setEmployees((emps) => emps.filter((e) => e.id !== id))
  }

  function editSalary(id) {
    const emp = employees.find((e) => e.id === id)
    const newSal = prompt("Enter new salary:", emp.salary)
    if (!newSal || isNaN(newSal)) return
    setEmployees((emps) => emps.map((e) => (e.id === id ? { ...e, salary: Number(newSal) } : e)))
  }

  function toggleListen() {
    if (!recognitionRef.current) return alert("Speech recognition not supported")

    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setListening(true)
      } catch (error) {
        console.error("Speech recognition start failed:", error)
      }
    }
  }

  // ---------- Derived Data ----------
  const visibleEmployees = employees.filter((e) => {
    const q = filter.toLowerCase()
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      e.domain.toLowerCase().includes(q) ||
      e.empId.toLowerCase().includes(q) ||
      e.referId.toLowerCase().includes(q)
    )
  })

  const totalApproved = employees.filter((e) => e.approved).length

   const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      router.push("/dashboard");  // This should now work
    }
  };
  const handleSettings = () => {
    alert("Settings page - Coming soon!")
  }

  const handleProfile = () => {
    alert("Profile page - Coming soon!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white p-4 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t.hrPortal}</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h12" />
            </svg>
          </button>
        </div>

        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors text-sm">
          {t.createDomain}
        </button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors text-sm">{t.recruit}</button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors text-sm">{t.approval}</button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors text-sm">{t.employees}</button>

        <div className="mt-auto">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full p-2 rounded bg-blue-800 text-white text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡ଼ିଆ</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 lg:hidden">{t.hrPortal}</h1>
          </div>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">HR Manager</div>
                <div className="text-xs text-gray-500">admin@company.com</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                HR
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">HR Manager</div>
                  <div className="text-xs text-gray-500">admin@company.com</div>
                </div>

                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>

                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>

                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Help & Support
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* HR Summary */}
          <section className="bg-white p-4 lg:p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4 text-lg">{t.summary}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">{t.total}</div>
                <div className="text-2xl font-bold text-blue-800">{employees.length}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 font-medium">{t.approved}</div>
                <div className="text-2xl font-bold text-green-800">{totalApproved}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-yellow-600 font-medium">{t.pending}</div>
                <div className="text-2xl font-bold text-yellow-800">{employees.length - totalApproved}</div>
              </div>
            </div>
          </section>

          {/* Domain Management */}
          <section className="bg-white p-4 lg:p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4 text-lg">{t.createDomain}</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder={t.domainPlaceholder}
                className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddDomain}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {t.addDomain}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {domains.map((d) => (
                <div key={d} className="px-3 py-2 bg-blue-100 rounded-full flex items-center gap-2 text-sm">
                  <span>{d}</span>
                  <button onClick={() => handleEditDomain(d)} className="text-blue-600 hover:text-blue-800 text-xs">
                    {t.edit}
                  </button>
                  <button onClick={() => handleDeleteDomain(d)} className="text-red-600 hover:text-red-800 text-xs">
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-4 lg:p-6 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4 text-lg">{t.recruit}</h2>
            <form onSubmit={saveEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder={t.employeeName}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                placeholder={t.phone}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="role"
                value={form.role}
                onChange={handleFormChange}
                placeholder={t.role}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="salary"
                value={form.salary}
                onChange={handleFormChange}
                placeholder={t.salary}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                name="domain"
                value={form.domain}
                onChange={handleFormChange}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="empId"
                    value={form.empId}
                    readOnly
                    className="p-3 rounded-lg border bg-gray-100"
                    placeholder={t.employeeId}
                  />
                  <input
                    name="referId"
                    value={form.referId}
                    readOnly
                    className="p-3 rounded-lg border bg-gray-100"
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

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  {t.submit}
                </button>
                <button
                  type="button"
                  onClick={toggleListen}
                  className={`px-6 py-3 rounded-lg text-white transition-colors ${
                    listening ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {listening ? "🔴 Stop" : "🎤 " + t.voiceHelper}
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h2 className="font-semibold text-lg">
                {t.employees} ({employees.length})
              </h2>
              <input
                placeholder={t.search}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-xs"
              />
            </div>

            <div className="space-y-4">
              {visibleEmployees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {emp.name[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg mb-2">{emp.name}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          {t.employeeId}: {emp.empId}
                        </div>
                        <div>
                          {t.referId}: {emp.referId}
                        </div>
                        <div>📞 {emp.phone}</div>
                        <div>💼 {emp.role}</div>
                        <div>🏢 {emp.domain}</div>
                        <div>💰 ₹{emp.salary}</div>
                      </div>
                      {emp.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {t.notes}: {emp.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          emp.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {emp.approved ? t.approved : t.pending}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!emp.approved && (
                          <button
                            onClick={() => approveEmployee(emp.id)}
                            className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                          >
                            ✓ {t.approve}
                          </button>
                        )}
                        <button
                          onClick={() => editSalary(emp.id)}
                          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                        >
                          ✏️ {t.editSalary}
                        </button>
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                        >
                          🗑️ {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
