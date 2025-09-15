"use client"

import { useState } from "react"
import HrSidebar from "../../../components/Hrcomponent/HrSidebar"
import HrNavbar from "../../../components/Hrcomponent/HrNavbar"
import HrDashboard from "../../../components/Hrcomponent/HrDashboard"
import HrTimesheet from "../../../components/Hrcomponent/HrTimesheet"
import HrDataManagement from "../../../components/Hrcomponent/HrDataManagement"
import HrApproval from "../../../components/Hrcomponent/HrApproval"
import HrEmployees from "../../../components/Hrcomponent/HrEmployees"
import HrPayroll from "../../../components/Hrcomponent/HrPayroll"
import HrReports from "../../../components/Hrcomponent/HrReports"
import HrRecruitment from "../../../components/Hrcomponent/HrRecruitment"
import HrReimbursement from "../../../components/Hrcomponent/HrReimbursement"
import HrSettings from "../../../components/Hrcomponent/HrSettings"
import HrSecurity from "../../../components/Hrcomponent/HrSecurity"
import HrHelp from "../../../components/Hrcomponent/HrHelp"

export default function HrPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <HrDashboard />
      case "timesheet":
        return <HrTimesheet />
      case "data-management":
        return <HrDataManagement />
      case "approval":
        return <HrApproval />
      case "employees":
        return <HrEmployees />
      case "payroll":
        return <HrPayroll />
      case "reports":
        return <HrReports />
      case "recruitment":
        return <HrRecruitment />
      case "reimbursement":
        return <HrReimbursement />
      case "settings":
        return <HrSettings />
      case "security":
        return <HrSecurity />
      case "help":
        return <HrHelp />
      default:
        return <HrDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <HrSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <HrNavbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
