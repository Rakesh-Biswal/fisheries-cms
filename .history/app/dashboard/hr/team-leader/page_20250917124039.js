import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"

export default function TeamLeaderPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Team Leader Dashboard</h1>
        
        {/* Team Leader Info */}
        <section className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Team Leader Information</h2>
          <p><b>Name:</b> Ramesh Sahu</p>
          <p><b>Contact:</b> +91-9876543210</p>
          <p><b>Team Size:</b> 12</p>
        </section>

        {/* Sales Employee Table */}
        <section className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Sales Employees Daily Report</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Report Submitted</th>
                <th className="p-2 border">Sales Amount</th>
                <th className="p-2 border">Clients Visited</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Suresh Das</td>
                <td className="p-2 border">✅ Yes</td>
                <td className="p-2 border">₹20,000</td>
                <td className="p-2 border">3</td>
                <td className="p-2 border">Good</td>
              </tr>
              <tr>
                <td className="p-2 border">Rajesh Kumar</td>
                <td className="p-2 border">❌ No</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">Not Submitted</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Team Leader Summary */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Team Leader Summary</h2>
          <p><b>Total Sales:</b> ₹2,15,000</p>
          <p><b>Target Achieved:</b> 72%</p>
          <p><b>Issues:</b> 2 employees absent, price drop in market.</p>
        </section>
      </div>
    </DashboardLayout>
  )
}
