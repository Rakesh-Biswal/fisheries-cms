"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import JobDetailsPanel from "./JobDetailsPanel";
import TalentListPanel from "./TalentListPanel";
import CandidateDialog from "./CandidateDialog";
import AdvanceStatusDialog from "./AdvanceStatusDialog";
import RejectCandidateDialog from "./RejectCandidateDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function JobDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [jobDetails, setJobDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  // Fetch job details and candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobResponse, candidatesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/${jobId}`),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/job/${jobId}`
          ),
        ]);

        const [jobResult, candidatesResult] = await Promise.all([
          jobResponse.json(),
          candidatesResponse.json(),
        ]);

        if (jobResult.success) setJobDetails(jobResult.data);
        if (candidatesResult.success) setCandidates(candidatesResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchData();
  }, [jobId]);

  // Update the statusConfig to remove phone_screen
  const statusConfig = {
    pending: {
      display: "Applied",
      next: ["reviewed", "rejected"],
      color: "bg-blue-100 text-blue-800",
    },
    reviewed: {
      display: "Shortlisted",
      next: ["technical_test", "rejected"],
      color: "bg-purple-100 text-purple-800",
    },
    technical_test: {
      display: "Technical Test",
      next: ["interview", "rejected"],
      color: "bg-cyan-100 text-cyan-800",
    },
    interview: {
      display: "Interview",
      next: ["final_interview", "rejected"],
      color: "bg-orange-100 text-orange-800",
    },
    final_interview: {
      display: "Final Interview",
      next: ["offer", "rejected"],
      color: "bg-amber-100 text-amber-800",
    },
    offer: {
      display: "Offer",
      next: ["hired", "rejected"],
      color: "bg-lime-100 text-lime-800",
    },
    hired: {
      display: "Hired",
      next: ["suspended"],
      color: "bg-green-100 text-green-800",
    },
    rejected: {
      display: "Rejected",
      next: [],
      color: "bg-red-100 text-red-800",
    },
    suspended: {
      display: "Suspended",
      next: ["hired"],
      color: "bg-gray-100 text-gray-800",
    },
  };

  const getStatusDisplay = (status) => statusConfig[status]?.display || status;
  const getStatusColor = (status) =>
    statusConfig[status]?.color || "bg-gray-100 text-gray-800";
  const getNextActions = (status) => statusConfig[status]?.next || [];

  const getStatusCount = (status) => {
    if (status === "all") return candidates.length;
    return candidates.filter((c) => c.status === status).length;
  };

  const handleAdvanceStatus = async (newStatus, note = "") => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/advance-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, stageNote: note }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setCandidates(
          candidates.map((candidate) =>
            candidate._id === selectedCandidate._id ? result.data : candidate
          )
        );
        setSelectedCandidate(result.data);
        setShowAdvanceDialog(false);
      }
    } catch (error) {
      console.error("Error advancing status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCandidate = async (rejectionReason) => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rejectionReason }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setCandidates(
          candidates.map((candidate) =>
            candidate._id === selectedCandidate._id ? result.data : candidate
          )
        );
        setSelectedCandidate(result.data);
        setShowRejectDialog(false);
      }
    } catch (error) {
      console.error("Error rejecting candidate:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (action, candidate) => {
    setSelectedCandidate(candidate);
    if (action === "advance") setShowAdvanceDialog(true);
    if (action === "reject") setShowRejectDialog(true);
  };

  if (loading) return <LoadingSpinner />;
  if (!jobDetails) return <div>Job not found</div>;

  const filteredCandidates =
    activeTab === "all"
      ? candidates
      : candidates.filter((c) => c.status === activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex">
        <JobDetailsPanel
          jobDetails={jobDetails}
          onBack={() => router.push("/dashboard/hr/Hiring")}
        />

        <TalentListPanel
          candidates={filteredCandidates}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCandidateSelect={setSelectedCandidate}
          onCandidateAction={openActionDialog}
          statusConfig={statusConfig}
          getStatusCount={getStatusCount}
          getStatusDisplay={getStatusDisplay}
          getStatusColor={getStatusColor}
          getNextActions={getNextActions}
        />
      </div>

      <CandidateDialog
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAction={openActionDialog}
        statusConfig={statusConfig}
        getStatusDisplay={getStatusDisplay}
      />

      <AdvanceStatusDialog
        isOpen={showAdvanceDialog}
        onClose={() => setShowAdvanceDialog(false)}
        candidate={selectedCandidate}
        onAdvance={handleAdvanceStatus}
        loading={actionLoading}
        statusConfig={statusConfig}
        getStatusDisplay={getStatusDisplay}
        getNextActions={getNextActions}
      />

      <RejectCandidateDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        candidate={selectedCandidate}
        onReject={handleRejectCandidate}
        loading={actionLoading}
        getStatusDisplay={getStatusDisplay}
      />
    </div>
  );
}
