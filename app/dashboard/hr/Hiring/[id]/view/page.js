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
  Trash2,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function JobDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [jobDetails, setJobDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [advancingStatus, setAdvancingStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [updating, setUpdating] = useState(false);
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
          toast.error("Failed to load job details");
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
          toast.error("Failed to load candidates");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
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

 const getNextStatus = (currentStatus) => {
   const statusFlow = {
     pending: "reviewed",
     reviewed: "interview",
     interview: "hired",
   };

   return statusFlow[currentStatus] || currentStatus;
 };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "pending":
        return "Applied";
      case "reviewed":
        return "Shortlisted";
      case "interview":
        return "Interview";
      case "hired":
        return "Hired";
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

  const handleAdvanceStatus = async () => {
    if (!selectedCandidate) return;

    try {
      setUpdating(true);
      const nextStatus = getNextStatus(selectedCandidate.status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/advance-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            stageNote: `Advanced from ${selectedCandidate.status} to ${nextStatus}`,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the candidate in the local state
        const updatedCandidates = candidates.map((candidate) =>
          candidate._id === selectedCandidate._id
            ? {
                ...candidate,
                status: nextStatus,
                stageHistory: result.data.stageHistory,
              }
            : candidate
        );

        setCandidates(updatedCandidates);

        // Update the selected candidate
        setSelectedCandidate({
          ...selectedCandidate,
          status: nextStatus,
          stageHistory: result.data.stageHistory,
        });

        setShowAdvanceDialog(false);
        toast.success(
          `Candidate advanced to ${getStatusDisplayName(nextStatus)}`
        );

        // If hired, redirect to sales employee page
        if (nextStatus === "hired") {
          setTimeout(() => {
            router.push("/dashboard/hr/salesemployee");
          }, 1500);
        }
      } else {
        console.error("Failed to advance status:", result.error);
        toast.error("Failed to advance candidate status");
      }
    } catch (error) {
      console.error("Error advancing status:", error);
      toast.error("Error advancing candidate status");
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectCandidate = async () => {
    if (!selectedCandidate || !rejectionReason.trim()) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the candidate in the local state
        const updatedCandidates = candidates.map((candidate) =>
          candidate._id === selectedCandidate._id
            ? {
                ...candidate,
                status: "rejected",
                stageHistory: result.data.stageHistory,
              }
            : candidate
        );

        setCandidates(updatedCandidates);

        // Update the selected candidate
        setSelectedCandidate({
          ...selectedCandidate,
          status: "rejected",
          stageHistory: result.data.stageHistory,
        });

        setShowRejectDialog(false);
        setRejectionReason("");
        toast.success("Candidate rejected successfully");
      } else {
        console.error("Failed to reject candidate:", result.error);
        toast.error("Failed to reject candidate");
      }
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      toast.error("Error rejecting candidate");
    } finally {
      setUpdating(false);
    }
  };

  const openAdvanceDialog = () => {
    if (!selectedCandidate) return;

    const nextStatus = getNextStatus(selectedCandidate.status);

    // Check if candidate can be advanced further
    if (nextStatus === selectedCandidate.status) {
      toast.info("Candidate has reached the final stage");
      return;
    }

    setAdvancingStatus(nextStatus);
    setShowAdvanceDialog(true);
  };

  const openRejectDialog = () => {
    if (!selectedCandidate) return;
    setShowRejectDialog(true);
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
      month: "short",
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

  // Calculate total experience
  const calculateTotalExperience = (workExperiences) => {
    if (!workExperiences || workExperiences.length === 0)
      return "No experience";

    let totalMonths = 0;

    workExperiences.forEach((exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.currentJob ? new Date() : new Date(exp.endDate);
      const months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      totalMonths += Math.max(0, months);
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
    if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
  };

  // Calculate expected salary based on experience and market rate
  const calculateExpectedSalary = (workExperiences, jobDetails) => {
    if (!workExperiences) workExperiences = [];

    const baseRate = 200; // THB per hour base rate
    const experienceBonus = workExperiences.length * 15; // 15 THB per year of experience
    const positionMultiplier = jobDetails?.title
      ?.toLowerCase()
      .includes("senior")
      ? 1.5
      : jobDetails?.title?.toLowerCase().includes("manager")
        ? 2
        : 1;

    const hourlyRate = Math.min(
      (baseRate + experienceBonus) * positionMultiplier,
      600
    );
    return `THB ${Math.round(hourlyRate)}/hour`;
  };

  // Calculate rating based on experience and qualifications
  const calculateRating = (candidate) => {
    let rating = 3.5; // Base rating

    // Add points for experience
    if (candidate.workExperiences) {
      rating += Math.min(candidate.workExperiences.length * 0.3, 1);
    }

    // Add points for education
    if (candidate.educations && candidate.educations.length > 0) {
      rating += 0.5;
    }

    // Add points for skills
    if (candidate.skills && candidate.skills.length > 3) {
      rating += 0.5;
    }

    return Math.min(rating, 5).toFixed(1);
  };

  // Get stage history for display
  const getStageHistory = (candidate) => {
    if (!candidate.stageHistory || candidate.stageHistory.length === 0) {
      return [
        {
          stage: "pending",
          date: candidate.appliedDate || candidate.createdAt,
          note: "Applied for the position",
        },
      ];
    }
    return candidate.stageHistory.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
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
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Job Details */}
        <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Talent List
            </h2>

            <div className="flex items-center gap-1 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
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
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
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
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
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
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "interview"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Interview{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("interview")}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("hired")}
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
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
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "rejected"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Rejected{" "}
                <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  {getStatusCount("rejected")}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 w-64"
                />
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
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={candidate.avatar || "/placeholder-avatar.jpg"}
                            alt={`${candidate.firstName} ${candidate.lastName}`}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
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
                        {calculateExpectedSalary(
                          candidate.workExperiences,
                          jobDetails
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        {calculateTotalExperience(candidate.workExperiences)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {calculateRating(candidate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Badge className={getStatusColor(candidate.status)}>
                          {getStatusDisplayText(candidate.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(candidate);
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No candidates found for this filter.
                  </div>
                )}
              </div>

              {filteredCandidates.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Details Dialog */}
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
                  {selectedCandidate.status !== "rejected" &&
                    selectedCandidate.status !== "hired" && (
                      <button
                        onClick={openAdvanceDialog}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Advance to Next step
                      </button>
                    )}
                  {selectedCandidate.status !== "rejected" &&
                    selectedCandidate.status !== "hired" && (
                      <button
                        onClick={openRejectDialog}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject Candidate
                      </button>
                    )}
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={
                        selectedCandidate.avatar || "/placeholder-avatar.jpg"
                      }
                      alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                    />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
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
                      {selectedCandidate.workExperiences &&
                        selectedCandidate.workExperiences.length > 3 && (
                          <Badge className="bg-green-100 text-green-800 font-medium">
                            🏆 TOP TALENT
                          </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                      <span>
                        {selectedCandidate.gender === "male" ? "♂" : "♀"}{" "}
                        {selectedCandidate.gender || "Not specified"}
                      </span>
                      <span>
                        👤 {calculateAge(selectedCandidate.dateOfBirth)}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {
                            calculateExpectedSalary(
                              selectedCandidate.workExperiences,
                              jobDetails
                            ).split(" ")[1]
                          }
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Expected Salary
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {calculateRating(selectedCandidate)}
                        </div>
                        <div className="flex justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i <
                                Math.floor(
                                  parseFloat(calculateRating(selectedCandidate))
                                )
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
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
                          {selectedCandidate.workExperiences
                            ? selectedCandidate.workExperiences.filter(
                                (exp) => exp.currentJob
                              ).length
                            : 0}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Current Jobs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Stages Section */}
                  <div className="text-right min-w-[200px] max-h-64 overflow-y-auto">
                    <div className="text-sm font-medium text-gray-900 mb-3 sticky top-0 bg-white pb-2">
                      Stages
                    </div>
                    <div className="space-y-3 pr-2">
                      {getStageHistory(selectedCandidate).map(
                        (stage, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div
                              className={`w-3 h-3 flex-shrink-0 ${
                                stage.stage === "pending"
                                  ? "bg-blue-500"
                                  : stage.stage === "reviewed"
                                    ? "bg-green-500"
                                    : stage.stage === "interview"
                                      ? "bg-orange-500"
                                      : stage.stage === "hired"
                                        ? "bg-purple-500"
                                        : stage.stage === "rejected"
                                          ? "bg-red-500"
                                          : "bg-gray-300"
                              } rounded-full`}
                            ></div>
                            <div className="text-left flex-1 min-w-0">
                              <div className="font-medium capitalize truncate">
                                {getStatusDisplayName(stage.stage)}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {formatDate(stage.date)}
                              </div>
                              {stage.note && (
                                <div className="text-xs text-gray-400 truncate">
                                  {stage.note}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
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
                        "
                        {selectedCandidate.references[0].relationship ||
                          "Excellent candidate with strong skills and work ethic."}
                        "
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
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
                          {formatDate(
                            selectedCandidate.references[0].date || new Date()
                          )}
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
                              "
                              {ref.relationship ||
                                "Excellent candidate with strong skills and work ethic."}
                              "
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
                                  {ref.relationship || "Reference"}
                                </div>
                              </div>
                              <div className="ml-auto text-xs text-gray-500">
                                {formatDate(ref.date || new Date())}
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
                  {selectedCandidate.status !== "rejected" &&
                    selectedCandidate.status !== "hired" && (
                      <Button
                        onClick={openAdvanceDialog}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        📅{" "}
                        {selectedCandidate.status === "interview"
                          ? "Hire Candidate"
                          : "Schedule Interview"}{" "}
                        ▼
                      </Button>
                    )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Advance Status Confirmation Dialog */}
      <Dialog open={showAdvanceDialog} onOpenChange={setShowAdvanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Advance Candidate Status</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-700 mb-2">
              The candidate is currently in{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplayName(selectedCandidate?.status)}
              </span>{" "}
              status.
            </p>
            <p>
              Do you want to advance them to{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplayName(advancingStatus)}
              </span>
              ?
            </p>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAdvanceDialog(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAdvanceStatus}
              disabled={updating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updating ? "Processing..." : "Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Candidate Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Candidate</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to reject{" "}
              <span className="font-semibold">
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows="3"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRejectCandidate}
              disabled={updating || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {updating ? "Processing..." : "Reject Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
