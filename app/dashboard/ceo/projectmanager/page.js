import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import DepartmentView from "../../../../components/CeoComponent/DepartmentView"

export default function CeoProjectManagerPage() {
  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="projectmanager" />
      <main className="flex-1 overflow-auto">
        <DepartmentView department="projectmanager" />
      </main>
    </div>
  )
}
