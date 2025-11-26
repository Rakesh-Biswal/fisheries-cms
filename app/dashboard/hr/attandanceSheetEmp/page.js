// app/attendanceSheetEmp/page.js
import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import AttendanceDashboard from "@/components/Hrcomponent/attendance-dashboard"

export default function Attendance() {
    return (
        <DashboardLayout>
            <AttendanceDashboard />
        </DashboardLayout>
    )
}