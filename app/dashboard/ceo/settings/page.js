import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import CompanySettings from "../../../../components/CeoComponent/CompanySettings"

export default function CeoSettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="settings" />
      <main className="flex-1 overflow-auto">
        <CompanySettings />
      </main>
    </div>
  )
}
