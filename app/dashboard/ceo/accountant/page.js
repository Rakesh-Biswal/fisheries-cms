"use client"

import DashboardLayout from "@/components/CeoComponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, TrendingUp, TrendingDown, Calculator, CreditCard, AlertTriangle, CheckCircle, Users, Target, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function CeoAccountantPage() {
  const financialMetrics = {
    totalRevenue: 2450000,
    monthlyRevenue: 245000,
    totalExpenses: 1890000,
    monthlyExpenses: 189000,
    netProfit: 560000,
    profitMargin: 22.9,
    cashFlow: 125000,
    outstandingInvoices: 89000,
    budgetVariance: -5.2,
  }

  const monthlyFinancials = [
    { month: "Jul", revenue: 220000, expenses: 175000, profit: 45000 },
    { month: "Aug", revenue: 235000, expenses: 180000, profit: 55000 },
    { month: "Sep", revenue: 210000, expenses: 185000, profit: 25000 },
    { month: "Oct", revenue: 260000, expenses: 190000, profit: 70000 },
    { month: "Nov", revenue: 245000, expenses: 189000, profit: 56000 },
    { month: "Dec", revenue: 280000, expenses: 195000, profit: 85000 },
  ]

  const expenseBreakdown = [
    { category: "Salaries", amount: 120000, color: "#3b82f6" },
    { category: "Operations", amount: 45000, color: "#10b981" },
    { category: "Marketing", amount: 25000, color: "#f59e0b" },
    { category: "Technology", amount: 18000, color: "#ef4444" },
    { category: "Office", amount: 12000, color: "#8b5cf6" },
  ]

  const cashFlowData = [
    { week: "W1", inflow: 65000, outflow: 45000 },
    { week: "W2", inflow: 58000, outflow: 52000 },
    { week: "W3", inflow: 72000, outflow: 48000 },
    { week: "W4", inflow: 69000, outflow: 51000 },
  ]

  const accountingTeam = [
    { name: "David Wilson", role: "Chief Accountant", efficiency: 98, tasks: 15, status: "active" },
    { name: "Emma Davis", role: "Financial Analyst", efficiency: 94, tasks: 12, status: "active" },
    { name: "John Smith", role: "Bookkeeper", efficiency: 91, tasks: 18, status: "busy" },
    { name: "Sarah Lee", role: "Tax Specialist", efficiency: 96, tasks: 8, status: "active" },
  ]

  const pendingTasks = [
    { task: "Q4 Financial Report", priority: "high", deadline: "2024-01-10", progress: 85 },
    { task: "Tax Filing Preparation", priority: "high", deadline: "2024-01-15", progress: 60 },
    { task: "Budget Review 2024", priority: "medium", deadline: "2024-01-25", progress: 40 },
    { task: "Expense Audit", priority: "low", deadline: "2024-02-01", progress: 20 },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Finance & Accounting</h1>
              <p className="text-muted-foreground">Monitor financial health and accounting operations</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-100 text-green-800">
            <DollarSign className="w-4 h-4 mr-1" />
            ${financialMetrics.netProfit.toLocaleString()} Net Profit
          </Badge>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${financialMetrics.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${financialMetrics.monthlyExpenses.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <TrendingUp className="w-3 h-3" />
                +3.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-500" />
                Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{financialMetrics.profitMargin}%</div>
              <div className="text-xs text-blue-600">Above target (20%)</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${financialMetrics.cashFlow.toLocaleString()}</div>
              <div className="text-xs text-purple-600">Positive trend</div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue vs Expenses
              </CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Profit Trend
              </CardTitle>
              <CardDescription>Monthly profit over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Expense Breakdown & Cash Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Expense Breakdown
              </CardTitle>
              <CardDescription>Current month expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ category, amount }) => `${category}: $${amount.toLocaleString()}`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Weekly Cash Flow
              </CardTitle>
              <CardDescription>Inflow vs outflow this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="inflow" fill="#10b981" name="Inflow" />
                  <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounting Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Accounting Team
              </CardTitle>
              <CardDescription>Team performance and workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountingTeam.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                        <div className="text-xs text-blue-600">{member.tasks} tasks</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          member.status === "active" ? "default" : 
                          member.status === "busy" ? "secondary" : "outline"
                        }
                      >
                        {member.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">{member.efficiency}% efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Pending Financial Tasks
              </CardTitle>
              <CardDescription>Critical accounting deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{task.task}</div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.progress}%</Badge>
                      </div>
                    </div>
                    <Progress value={task.progress} className="mb-2" />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due: {task.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Financial Alerts
            </CardTitle>
            <CardDescription>Important financial notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <div className="font-medium text-red-800">Outstanding Invoices</div>
                  <div className="text-sm text-red-600">
                    ${financialMetrics.outstandingInvoices.toLocaleString()} in overdue payments
                  </div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <div className="font-medium text-yellow-800">Budget Variance</div>
                  <div className="text-sm text-yellow-600">
                    {Math.abs(financialMetrics.budgetVariance)}% over budget this month
                  </div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium text-green-800">Tax Compliance</div>
                  <div className="text-sm text-green-600">All tax filings up to date</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}