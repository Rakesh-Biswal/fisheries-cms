"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  MoreHorizontal,
  Edit,
  ArrowRight,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useParams } from "next/navigation";

export default function JobDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [jobDetails, setJobDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  // Fetch job details and candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch job details
        const jobResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/${jobId}`
        );
        const jobResult = await jobResponse.json();

        if (jobResult.success) {
          setJobDetails(jobResult.data);
        } else {
          console.error("Failed to fetch job details:", jobResult.error);
        }

        // Fetch candidates for this job
        const candidatesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/job/${jobId}`
        );
        const candidatesResult = await candidatesResponse.json();

        if (candidatesResult.success) {
          setCandidates(candidatesResult.data);
        } else {
          console.error("Failed to fetch candidates:", candidatesResult.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "Shortlisted":
      case "reviewed":
        return "bg-blue-500 text-white";
      case "Interviewed":
      case "interview":
        return "bg-orange-100 text-orange-800";
      case "Hired":
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "pending":
        return "Applied";
      case "reviewed":
        return "Shortlisted";
      case "interview":
        return "Interviewed";
      case "hired":
        return "Hired";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusCount = (status) => {
    if (status === "all") return candidates.length;
    return candidates.filter(
      (c) => c.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const filteredCandidates =
    activeTab === "all"
      ? candidates
      : candidates.filter(
          (c) => c.status.toLowerCase() === activeTab.toLowerCase()
        );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return `${age} Years Old`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <Button onClick={() => router.push("/dashboard/hr/Hiring")}>
            Back to Job Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content - now full width */}
      <div className="flex-1 flex">
        {/* Job Details */}
        <div className="w-96 bg-white border-r border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => router.push("/dashboard/hr/Hiring")}
            >
              <span>←</span>
            </Button>
            <span className="text-sm text-gray-500">
              Job List / {jobDetails._id}
            </span>
            <div className="ml-auto text-xs text-gray-500">
              Last update at {formatDate(jobDetails.updatedAt)}
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <div className="text-white text-2xl">❄</div>
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Royal Thai Retreats • {jobDetails._id}
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {jobDetails.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{jobDetails.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏠</span>
                <span>{jobDetails.department}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">Rate Amount</div>
                <div className="font-medium">
                  {jobDetails.salary || "Not specified"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Deadline</div>
                <div className="font-medium">
                  {formatDate(jobDetails.expiryDate)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">Created at</div>
                <div className="font-medium">
                  {formatDate(jobDetails.postedDate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  🔥 {jobDetails.status === "active" ? "Hiring" : "Closed"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">Job Period</div>
                <div className="font-medium">
                  {formatDate(jobDetails.postedDate)} -{" "}
                  {formatDate(jobDetails.expiryDate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Number of Opening
                </div>
                <div className="font-medium">{jobDetails.openings}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Employment Type
                </div>
                <div className="font-medium">{jobDetails.employmentType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Required Experience
                </div>
                <div className="font-medium">{jobDetails.experience}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2">Job Description</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {jobDetails.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  Skills / Qualifications
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {jobDetails.qualification.split(",").map((qual, index) => (
                    <li key={index}>• {qual.trim()}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  Additional Notes
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {/* These are hardcoded as they're not in the backend schema */}
                  <li>• Uniform provided</li>
                  <li>• Employee discounts on hotel services</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-900 mb-3">
                Working Shift
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="text-xs text-center text-gray-500 py-1">
                  Mon
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Tue
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Wed
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Thu
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Fri
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Sat
                </div>
                <div className="text-xs text-center text-gray-500 py-1">
                  Sun
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                <div className="h-2 bg-orange-400 rounded"></div>
                <div className="h-2 bg-orange-400 rounded"></div>
                <div className="h-2 bg-orange-400 rounded"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-orange-400 rounded"></div>
                <div className="h-2 bg-orange-400 rounded"></div>
                <div className="h-2 bg-orange-400 rounded"></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Morning</div>
            </div>
          </div>
        </div>

        {/* Talent List */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Talent List
            </h2>

            <div className="flex items-center gap-1 mb-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "all"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                All{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("all")}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "pending"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Applied{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("pending")}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("reviewed")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "reviewed"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Shortlisted{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("reviewed")}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "interview"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Invited to Interview{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("interview")}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("hired")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "hired"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Hired{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("hired")}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search" className="pl-10 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Experience <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  Expected Salary <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Name</div>
                <div>Expected salary</div>
                <div>Experience</div>
                <div>Rating</div>
                <div>Status</div>
                <div></div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={candidate.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {candidate.firstName?.[0]}
                          {candidate.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {candidate.gender || "Not specified"} •{" "}
                          {calculateAge(candidate.dateOfBirth)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-900">
                      {/* Expected salary is not in the backend schema, using placeholder */}
                      THB {Math.floor(Math.random() * 400) + 200}
                    </div>
                    <div className="flex items-center text-sm text-gray-900">
                      {/* Experience calculation based on work history */}
                      {candidate.workExperiences &&
                      candidate.workExperiences.length > 0
                        ? `${candidate.workExperiences.length} Years`
                        : "No experience"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {/* Rating not in backend, using placeholder */}
                        {(Math.random() * 1 + 4).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(candidate.status)}>
                        {getStatusDisplayText(candidate.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {filteredCandidates.length} of {candidates.length}{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-500 text-white border-orange-500"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    ...
                  </Button>
                  <Button variant="outline" size="sm">
                    12
                  </Button>
                  <Button variant="outline" size="sm">
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent className="min-w-6xl max-h-[95vh] overflow-y-auto p-0">
          {selectedCandidate && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    Talent Details
                  </DialogTitle>
                  <div className="text-sm text-gray-500">
                    ID #{selectedCandidate._id}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCandidate(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={selectedCandidate.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xl">
                      {selectedCandidate.firstName?.[0]}
                      {selectedCandidate.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold">
                        {selectedCandidate.firstName}{" "}
                        {selectedCandidate.lastName}
                      </h3>
                      {/* TOP TALENT badge logic - using placeholder condition */}
                      {selectedCandidate.workExperiences &&
                        selectedCandidate.workExperiences.length > 3 && (
                          <Badge className="bg-green-100 text-green-800 font-medium">
                            🏆 TOP TALENT
                          </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                      <span>
                        ♂ {selectedCandidate.gender || "Not specified"}
                      </span>
                      <span>
                        👤 {calculateAge(selectedCandidate.dateOfBirth)}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {/* Expected salary placeholder */}
                          THB {Math.floor(Math.random() * 400) + 200}/hour
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Expected Salary
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {/* Rating placeholder */}
                          {(Math.random() * 1 + 4).toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(Math.random() * 1 + 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          Average Rating
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {selectedCandidate.workExperiences
                            ? selectedCandidate.workExperiences.length
                            : 0}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">Years</div>
                        <div className="text-xs text-gray-500">
                          Work Experience
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {/* Gigs done placeholder */}
                          {Math.floor(Math.random() * 200) + 50}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Gigs Done
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right min-w-[200px]">
                    <div className="text-sm font-medium text-gray-900 mb-3">
                      Stages
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="text-left">
                          <div className="font-medium">Job applied</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(selectedCandidate.appliedDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="text-left">
                          <div className="font-medium">Job Posted</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(jobDetails.postedDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View CV/Resume Button */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-0 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 text-sm">📄</span>
                      </div>
                      <span className="font-medium">View CV/Resume</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                {/* Testimonials Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Testimonials
                    </h4>
                    <Button
                      variant="link"
                      className="text-orange-600 p-0 h-auto"
                    >
                      View All
                    </Button>
                  </div>
                  {selectedCandidate.references &&
                  selectedCandidate.references.length > 0 ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        "Excellent candidate with strong skills and work ethic."
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/diverse-team-manager.png" />
                          <AvatarFallback>
                            {selectedCandidate.references[0].name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {selectedCandidate.references[0].name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedCandidate.references[0].company ||
                              "Previous employer"}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {/* Reference date placeholder */}
                          {formatDate(new Date())}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      No testimonials available
                    </div>
                  )}
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="contact" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                    <TabsTrigger
                      value="contact"
                      className="flex items-center gap-2"
                    >
                      <span>📞</span> Contact Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="flex items-center gap-2"
                    >
                      <span>📋</span> Work History
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferences"
                      className="flex items-center gap-2"
                    >
                      <span>⚙️</span> Shift Preferences
                    </TabsTrigger>
                    <TabsTrigger
                      value="testimonials"
                      className="flex items-center gap-2"
                    >
                      <span>💬</span> Testimonials
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Email
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedCandidate.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Phone Number
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedCandidate.phone}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Location
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedCandidate.city}, {selectedCandidate.state}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Birthdate
                        </label>
                        <div className="text-sm text-gray-900">
                          {formatDate(selectedCandidate.dateOfBirth)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Nationality
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedCandidate.nationality || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Address
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedCandidate.address}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4 mt-6">
                    {selectedCandidate.workExperiences &&
                    selectedCandidate.workExperiences.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCandidate.workExperiences.map((exp, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold">
                              {exp.position} at {exp.company}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(exp.startDate)} -{" "}
                              {exp.currentJob
                                ? "Present"
                                : formatDate(exp.endDate)}
                            </p>
                            <p className="text-sm mt-2">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-4">📋</div>
                        <div>Work history information not available</div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-4 mt-6">
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">⚙️</div>
                      <div>Shift preferences not available</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="testimonials" className="space-y-4 mt-6">
                    {selectedCandidate.references &&
                    selectedCandidate.references.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCandidate.references.map((ref, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="text-sm text-gray-700 mb-3">
                              "Excellent candidate with strong skills and work
                              ethic."
                            </p>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {ref.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {ref.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {ref.company || "Previous employer"} •{" "}
                                  {ref.relationship}
                                </div>
                              </div>
                              <div className="ml-auto text-xs text-gray-500">
                                {/* Reference date placeholder */}
                                {formatDate(new Date())}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-4">💬</div>
                        <div>No testimonials available</div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    📋 Save
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    💬 Send Message
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                    📅 Schedule Interview ▼
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
