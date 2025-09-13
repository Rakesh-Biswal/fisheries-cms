import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import DepartmentView from "../../../../components/CeoComponent/DepartmentView"

export default function CeoTelecallerPage() {
  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="telecaller" />
      <main className="flex-1 overflow-auto">
        <DepartmentView department="telecaller" />
      </main>
    </div>
  )
}
