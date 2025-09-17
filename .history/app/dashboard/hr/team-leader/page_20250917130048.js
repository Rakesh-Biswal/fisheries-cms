

import { useState } from 'react';
import Head from 'next/head';

export default function TeamLeaderDashboard() {
  const [language, setLanguage] = useState('English');
  
  // Dummy data
  const teamLeader = {
    name: 'Rajesh Mohanty',
    contact: '+91-9876543210',
    teamSize: 12,
    performance: 'Excellent',
    totalSales: '₹2,15,000',
    targetAchieved: 72,
    issues: '2 employees absent, price drop in market.'
  };

  const employees = [
    {
      id: 1,
      name: 'Suresh Das',
      position: 'Sales Executive',
      reportStatus: 'Submitted',
      salesAmount: '₹20,000',
      clientsVisited: 5,
      remarks: 'Good progress with new clients'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      position: 'Field Agent',
      reportStatus: 'Not Submitted',
      salesAmount: '-',
      clientsVisited: 0,
      remarks: 'Absent today'
    },
    {
      id: 3,
      name: 'Priyanka Patra',
      position: 'Sales Executive',
      reportStatus: 'Submitted',
      salesAmount: '₹32,500',
      clientsVisited: 7,
      remarks: 'Exceeded daily target'
    },
    {
      id: 4,
      name: 'Amit Sahoo',
      position: 'Field Agent',
      reportStatus: 'Submitted',
      salesAmount: '₹15,000',
      clientsVisited: 4,
      remarks: 'Average performance'
    }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Odia' : 'English');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>AgriHR - Team Leader Dashboard</title>
        <meta name="description" content="HR Dashboard for agricultural business" />
      </Head>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-green-600 to-blue-600 text-white h-screen fixed inset-y-0 left-0 z-50">
          <div className="p-5">
            <h1 className="text-xl font-bold">AgriHR</h1>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li className="nav-item active py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-home w-6 text-center"></i>
                <span className="ml-3">Home</span>
              </li>
              <li className="nav-item py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-users w-6 text-center"></i>
                <span className="ml-3">Employees</span>
              </li>
              <li className="nav-item py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-user-tie w-6 text-center"></i>
                <span className="ml-3">Team Leaders</span>
              </li>
              <li className="nav-item py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-chart-pie w-6 text-center"></i>
                <span className="ml-3">Reports</span>
              </li>
              <li className="nav-item py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-cog w-6 text-center"></i>
                <span className="ml-3">Settings</span>
              </li>
              <li className="nav-item py-3 px-4 rounded-lg flex items-center">
                <i className="fas fa-sign-out-alt w-6 text-center"></i>
                <span className="ml-3">Logout</span>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Team Leader Dashboard</h1>
              <p className="text-gray-600">Monitor and manage team leader performance</p>
            </div>
            
            <button 
              onClick={toggleLanguage}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <i className="fas fa-language mr-2"></i>
              {language}
            </button>
          </div>
          
          {/* Team Leader Info */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white col-span-2 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-user-tie mr-2 text-blue-500"></i>
                Team Leader Information
              </h2>
              
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-user text-blue-600 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{teamLeader.name}</h3>
                  <p className="text-gray-600">Team Leader - East Zone</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-phone text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold">{teamLeader.contact}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-users text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="font-semibold">{teamLeader.teamSize} Employees</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="fas fa-target text-purple-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Monthly Target</p>
                    <p className="font-semibold">₹5,00,000</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fas fa-trophy text-yellow-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Performance</p>
                    <p className="font-semibold">{teamLeader.performance}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-chart-line mr-2 text-green-500"></i>
                Performance Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Target Achievement</span>
                    <span className="text-sm font-medium">{teamLeader.targetAchieved}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${teamLeader.targetAchieved}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Team Engagement</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full" 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Report Submission</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full" 
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full" 
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Data Visualization Placeholder */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-chart-bar mr-2 text-blue-500"></i>
                Daily Sales Performance
              </h2>
              <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sales chart visualization would appear here</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-chart-pie mr-2 text-green-500"></i>
                Target vs Achieved
              </h2>
              <div className="h-64 bg-green-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Pie chart visualization would appear here</p>
              </div>
            </div>
          </section>
          
          {/* Sales Employee Table */}
          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <i className="fas fa-users mr-2 text-purple-500"></i>
                Sales Team Daily Report
              </h2>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Report Status</th>
                    <th className="p-3">Sales Amount</th>
                    <th className="p-3">Clients Visited</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i className="fas fa-user text-blue-600"></i>
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-gray-600">{employee.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employee.reportStatus === 'Submitted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.reportStatus}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{employee.salesAmount}</td>
                      <td className="p-3">{employee.clientsVisited}</td>
                      <td className="p-3">{employee.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Team Leader Summary */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-clipboard-list mr-2 text-blue-500"></i>
              Team Leader Daily Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-rupee-sign text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Team Sales</p>
                    <p className="text-xl font-bold">{teamLeader.totalSales}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-bullseye text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Target Achieved</p>
                    <p className="text-xl font-bold">{teamLeader.targetAchieved}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Issues Reported</p>
                    <p className="text-xl font-bold">2</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Issues & Remarks</h3>
              <p className="text-gray-700">{teamLeader.issues}</p>
            </div>
          </section>
        </main>
      </div>

      {/* Add Font Awesome for icons */}
      <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script>
    </div>
  );
}
