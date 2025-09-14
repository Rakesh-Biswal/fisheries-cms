"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  UserPlus,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Download,
  Filter,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react"

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹12-18 LPA",
    applicants: 45,
    status: "Active",
    postedDate: "2024-01-10",
    urgency: "High",
  },
  {
    id: 2,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Delhi, India",
    type: "Full-time",
    experience: "5-7 years",
    salary: "₹15-22 LPA",
    applicants: 32,
    status: "Active",
    postedDate: "2024-01-08",
    urgency: "Medium",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹8-12 LPA",
    applicants: 28,
    status: "Active",
    postedDate: "2024-01-12",
    urgency: "Low",
  },
  {
    id: 4,
    title: "Data Analyst",
    department: "Analytics",
    location: "Pune, India",
    type: "Full-time",
    experience: "1-3 years",
    salary: "₹6-10 LPA",
    applicants: 67,
    status: "Paused",
    postedDate: "2024-01-05",
    urgency: "Medium",
  },
]

const candidates = [
  {
    id: 1,
    name: "Arjun Sharma",
    avatar: "/professional-man.png",
    position: "Senior Frontend Developer",
    experience: "4 years",
    location: "Mumbai, India",
    education: "B.Tech Computer Science",
    skills: ["React", "TypeScript", "Node.js"],
    status: "Interview Scheduled",
    rating: 4.5,
    appliedDate: "2024-01-14",
    stage: "Technical Round",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "/professional-woman-diverse.png",
    position: "Marketing Manager",
    experience: "6 years",
    location: "Delhi, India",
    education: "MBA Marketing",
    skills: ["Digital Marketing", "SEO", "Analytics"],
    status: "Under Review",
    rating: 4.2,
    appliedDate: "2024-01-13",
    stage: "HR Round",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    avatar: "/professional-man.png",
    position: "UX Designer",
    experience: "3 years",
    location: "Bangalore, India",
    education: "B.Des Visual Communication",
    skills: ["Figma", "Sketch", "Prototyping"],
    status: "Shortlisted",
    rating: 4.0,
    appliedDate: "2024-01-12",
    stage: "Portfolio Review",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    avatar: "/professional-woman-diverse.png",
    position: "Data Analyst",
    experience: "2 years",
    location: "Pune, India",
    education: "M.Sc Statistics",
    skills: ["Python", "SQL", "Tableau"],
    status: "Rejected",
    rating: 3.5,
    appliedDate: "2024-01-11",
    stage: "Initial Screening",
  },
]

const recruitmentMetrics = [
  { month: "Aug", applications: 245, hires: 12, interviews: 48 },
  { month: "Sep", applications: 289, hires: 15, interviews: 52 },
  { month: "Oct", applications: 312, hires: 18, interviews: 58 },
  { month: "Nov", applications: 298, hires: 14, interviews: 55 },
  { month: "Dec", applications: 356, hires: 22, interviews: 68 },
  { month: "Jan", applications: 378, hires: 16, interviews: 62 },
]

const hiringFunnel = [
  { stage: "Applications", count: 378, percentage: 100 },
  { stage: "Screening", count: 189, percentage: 50 },
  { stage: "Phone Interview", count: 95, percentage: 25 },
  { stage: "Technical Round", count: 62, percentage: 16.4 },
  { stage: "Final Interview", count: 32, percentage: 8.5 },
  { stage: "Offers", count: 16, percentage: 4.2 },
]

const recruitmentStats = {
  totalApplications: 378,
  activeJobs: 12,
  scheduledInterviews: 24,
  pendingOffers: 8,
  averageTimeToHire: 18,
  offerAcceptanceRate: 85,
}

export default function RecruitmentPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedTab, setSelectedTab] = useState("jobs")

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "Interview Scheduled":
      case "Shortlisted":
        return "bg-green-100 text-green-800"
      case "Under Review":
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
      case "Interview Scheduled":
      case "Shortlisted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Under Review":
      case "Paused":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Rejected":
      case "Closed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Management</h1>
          <p className="text-gray-600">Manage job openings, candidates, and hiring processes</p>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("All")}>All Positions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Paused")}>Paused</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Closed")}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{recruitmentStats.totalApplications}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">{recruitmentStats.activeJobs}</p>
                <p className="text-sm text-green-600">Open positions</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-3xl font-bold text-purple-600">{recruitmentStats.scheduledInterviews}</p>
                <p className="text-sm text-purple-600">Scheduled this week</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time to Hire</p>
                <p className="text-3xl font-bold text-orange-600">{recruitmentStats.averageTimeToHire}</p>
                <p className="text-sm text-orange-600">Days average</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recruitment Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recruitmentMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" name="Applications" strokeWidth={2} />
                <Line type="monotone" dataKey="interviews" stroke="#10B981" name="Interviews" strokeWidth={2} />
                <Line type="monotone" dataKey="hires" stroke="#F59E0B" name="Hires" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hiringFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-gray-500">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab("jobs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === "jobs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Job Openings ({jobOpenings.length})
          </button>
          <button
            onClick={() => setSelectedTab("candidates")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === "candidates"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Candidates ({candidates.length})
          </button>
        </nav>
      </div>

      {/* Job Openings Tab */}
      {selectedTab === "jobs" && (
        <Card>
          <CardHeader>
            <CardTitle>Active Job Openings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobOpenings.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            Posted {new Date(job.postedDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell className="font-medium text-green-600">{job.salary}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{job.applicants}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getUrgencyColor(job.urgency)}>
                          {job.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              View Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Job</DropdownMenuItem>
                            <DropdownMenuItem>Pause Hiring</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Tab */}
      {selectedTab === "candidates" && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <div className="flex items-center space-x-1">{renderStars(candidate.rating)}</div>
                        <span className="text-sm text-gray-500">({candidate.rating})</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Applied for: {candidate.position}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{candidate.experience} experience</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3" />
                          <span>{candidate.education}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{candidate.stage}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(candidate.status)}
                        <Badge variant="outline" className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied: {new Date(candidate.appliedDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Move to Next Stage
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
