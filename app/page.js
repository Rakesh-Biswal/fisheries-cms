"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  FileText,
  BarChart3,
  Calendar,
  Ship,
  Warehouse,
  DollarSign,
  Shield,
  Fish,
  ArrowRight,
  Building
} from "lucide-react"

export default function CMSHomePage() {
  const [credentials, setCredentials] = useState({
    employeeId: "",
    password: ""
  })

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Login logic would go here
    console.log("Login attempt with:", credentials)
  }

  const departmentFeatures = [
    {
      title: "HR Management",
      description: "Employee records, payroll, and HR operations",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Accounting",
      description: "Financial records, expenses, and revenue tracking",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Operations",
      description: "Fishing operations and logistics management",
      icon: Ship,
      color: "bg-purple-500"
    },
    {
      title: "Processing",
      description: "Quality control and processing unit management",
      icon: Warehouse,
      color: "bg-orange-500"
    },
    {
      title: "Compliance",
      description: "Regulatory compliance and documentation",
      icon: Shield,
      color: "bg-red-500"
    },
    {
      title: "Reports",
      description: "Analytics and performance reports",
      icon: BarChart3,
      color: "bg-teal-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Fisheries Platform</h1>
                <p className="text-sm text-slate-500">Company Management System</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/help">Help Center</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Fish className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Welcome to Fisheries Platform CMS
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Centralized management system for all fisheries operations.
            Access your department dashboard to manage daily operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Login Card */}
          <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
            <CardHeader className="text-center space-y-3">
              <div className="flex justify-center">
              </div>
              <CardTitle className="text-2xl font-semibold">
                Access Your Dashboard
              </CardTitle>
              <CardDescription className="text-gray-600">
                Securely log in to manage your work, tasks, and reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <Button asChild size="lg" className="w-full">
                <Link href="/signin">
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500 text-center">
                You’ll be redirected to the secure sign-in page.
              </p>
            </CardContent>
          </Card>


          {/* Features Card */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle>System Features</CardTitle>
              <CardDescription>
                Comprehensive tools for all departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departmentFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`${feature.color} p-2 rounded-md flex-shrink-0`}>
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Department Portals</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Access specialized tools and features designed for your specific role within the organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentFeatures.map((department, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`${department.color} p-2 rounded-md`}>
                    <department.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{department.title}</CardTitle>
                </div>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signin">Access Portal</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-blue-600 p-1 rounded">
                <Fish className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-900">
                Fisheries Platform CMS
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/security" className="text-sm text-slate-600 hover:text-slate-900">
                Security
              </Link>
              <span className="text-sm text-slate-600">
                © 2025 Fisheries Platform. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}