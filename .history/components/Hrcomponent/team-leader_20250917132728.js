"use client";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">HR Dashboard</h2>
        <nav className="space-y-4">
          <a href="/dashboard/hr" className="block hover:text-blue-300">Overview</a>
          <a href="/dashboard/hr/team-leader" className="block hover:text-blue-300">Team Leader</a>
          <a href="/dashboard/hr/reports" className="block hover:text-blue-300">Reports</a>
          <a href="/dashboard/hr/settings" className="block hover:text-blue-300">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
