import CeoSidebar from "../../../../components/CeoComponent/CeoSidebar"
import TasksMeetings from "../../../../components/CeoComponent/TasksMeetings"

export default function TM() {
  return (
    <div className="flex h-screen bg-background">
      <CeoSidebar activeSection="settings" />
      <main className="flex-1 overflow-auto">
        <TasksMeetings />
      </main>
    </div>
  )
}
