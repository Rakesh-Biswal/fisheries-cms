"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  ExternalLink,
} from "lucide-react"

const faqCategories = [
  {
    title: "Getting Started",
    icon: Book,
    color: "bg-blue-500",
    questions: [
      {
        question: "How do I add a new employee to the system?",
        answer: "Navigate to Employees > Add Employee, fill in the required information, and click Save.",
      },
      {
        question: "How do I set up payroll for the first time?",
        answer:
          "Go to Payroll > Settings, configure your company's payroll policies, tax settings, and employee salary structures.",
      },
      {
        question: "How do I generate attendance reports?",
        answer: "Visit Attendance > Reports, select your date range and filters, then click Generate Report.",
      },
    ],
  },
  {
    title: "Employee Management",
    icon: MessageSquare,
    color: "bg-green-500",
    questions: [
      {
        question: "How do I update employee information?",
        answer: "Go to Employees, find the employee, click Edit, make your changes, and save.",
      },
      {
        question: "How do I handle employee leave requests?",
        answer: "Leave requests appear in the Approval Center. Review the request and approve or reject as needed.",
      },
      {
        question: "How do I track employee performance?",
        answer: "Use the Performance module to set goals, conduct reviews, and track employee progress.",
      },
    ],
  },
  {
    title: "Payroll & Finance",
    icon: Video,
    color: "bg-purple-500",
    questions: [
      {
        question: "How do I process monthly payroll?",
        answer: "Go to Payroll > Process Payroll, review employee data, make adjustments if needed, and run payroll.",
      },
      {
        question: "How do I handle tax deductions?",
        answer:
          "Tax deductions are automatically calculated based on your configured tax settings and employee information.",
      },
      {
        question: "How do I generate payslips?",
        answer: "After processing payroll, go to Payroll > Payslips to generate and distribute payslips to employees.",
      },
    ],
  },
  {
    title: "Technical Support",
    icon: FileText,
    color: "bg-orange-500",
    questions: [
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset instructions.",
      },
      {
        question: "How do I enable two-factor authentication?",
        answer: "Go to Settings > Security, enable 2FA, and follow the setup instructions with your authenticator app.",
      },
      {
        question: "How do I export data from the system?",
        answer: "Most pages have an Export button. Click it, select your format (CSV, PDF, Excel), and download.",
      },
    ],
  },
]

const supportTickets = [
  {
    id: "TK-001",
    title: "Unable to process payroll for December",
    status: "Open",
    priority: "High",
    created: "2024-01-14",
    lastUpdate: "2024-01-15",
    assignee: "Support Team",
  },
  {
    id: "TK-002",
    title: "Employee attendance not syncing",
    status: "In Progress",
    priority: "Medium",
    created: "2024-01-12",
    lastUpdate: "2024-01-14",
    assignee: "Technical Team",
  },
  {
    id: "TK-003",
    title: "Request for new feature: Bulk employee import",
    status: "Resolved",
    priority: "Low",
    created: "2024-01-10",
    lastUpdate: "2024-01-13",
    assignee: "Product Team",
  },
]

const resources = [
  {
    title: "User Manual",
    description: "Complete guide to using Neutrack HR Dashboard",
    type: "PDF",
    size: "2.4 MB",
    icon: FileText,
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides for common tasks",
    type: "Video",
    duration: "45 min",
    icon: Video,
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    type: "Web",
    pages: "120 pages",
    icon: Book,
  },
  {
    title: "Best Practices Guide",
    description: "HR best practices and recommendations",
    type: "PDF",
    size: "1.8 MB",
    icon: Star,
  },
]

const contactOptions = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    contact: "support@neutrack.com",
    icon: Mail,
    color: "bg-blue-500",
    responseTime: "24 hours",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our support team",
    contact: "+91 1800-123-4567",
    icon: Phone,
    color: "bg-green-500",
    responseTime: "Immediate",
  },
  {
    title: "Live Chat",
    description: "Chat with support agents in real-time",
    contact: "Available 9 AM - 6 PM IST",
    icon: MessageSquare,
    color: "bg-purple-500",
    responseTime: "< 5 minutes",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600">Find answers to your questions and get support</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, guides, or common questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 ${option.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{option.description}</p>
                    <p className="text-sm font-medium text-blue-600">{option.contact}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{option.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`h-10 w-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="border-l-2 border-gray-200 pl-4">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Questions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <div key={resource.title} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <p className="text-sm text-gray-500">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{resource.type}</Badge>
                      <span className="text-xs text-gray-500">
                        {resource.size || resource.duration || resource.pages}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3 text-gray-400" />
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Support Tickets</CardTitle>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{ticket.id}</Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {ticket.created}</span>
                      <span>Updated: {ticket.lastUpdate}</span>
                      <span>Assignee: {ticket.assignee}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">All Systems Operational</p>
                  <p className="text-sm text-green-700">All services are running normally</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>HR Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Payroll System</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>API Services</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
