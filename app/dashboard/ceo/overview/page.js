import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import CeoOverview from "../../../../components/CeoComponent/CeoOverview"

export default function CeoOverviewPage() {
  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="overview" />
      <main className="flex-1 overflow-auto">
        <CeoOverview />
      </main>
    </div>
  )
}
