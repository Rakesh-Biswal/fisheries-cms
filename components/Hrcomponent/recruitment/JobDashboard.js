"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import JobDetailsPanel from "./JobDetailsPanel";
import TalentListPanel from "./TalentListPanel";
import CandidateDialog from "./CandidateDialog";
import AdvanceStatusDialog from "./AdvanceStatusDialog";
import RejectCandidateDialog from "./RejectCandidateDialog";
import ScheduleFieldWorkDialog from "./ScheduleFieldWorkDialog";
import FieldWorkDayDialog from "./FieldWorkDayDialog";
import SuspendCandidateDialog from "./SuspendCandidateDialog";
import RevokeSuspensionDialog from "./RevokeSuspensionDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function JobDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [jobDetails, setJobDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showFieldWorkDialog, setShowFieldWorkDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

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

  const handleRevokeSuspension = async (newStatus, revokeReason) => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/revoke-suspension`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStatus, revokeReason }),
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
        setShowRevokeDialog(false);
      }
    } catch (error) {
      console.error("Error revoking suspension:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // In JobDashboard.js - update the statusConfig
  const statusConfig = {
    pending: {
      display: "Applied",
      next: ["reviewed", "rejected"], // Only show relevant next steps
      color: "bg-blue-100 text-blue-800",
      badge: null,
    },
    reviewed: {
      display: "Shortlisted",
      next: ["technical_test", "rejected"],
      color: "bg-purple-100 text-purple-800",
      badge: null,
    },
    phone_screen: {
      display: "Phone Screen",
      next: ["technical_test", "rejected"],
      color: "bg-indigo-100 text-indigo-800",
      badge: null,
    },
    technical_test: {
      display: "Technical Test",
      next: ["interview", "rejected"],
      color: "bg-cyan-100 text-cyan-800",
      badge: null,
    },
    interview: {
      display: "Interview",
      next: ["final_interview", "rejected"],
      color: "bg-orange-100 text-orange-800",
      badge: null,
    },
    final_interview: {
      display: "Final Interview",
      next: ["offer", "rejected"],
      color: "bg-amber-100 text-amber-800",
      badge: null,
    },
    offer: {
      display: "Offer",
      next: ["hired", "rejected"],
      color: "bg-lime-100 text-lime-800",
      badge: null,
    },
    hired: {
      display: "Hired",
      next: ["suspended"], // Only suspend, no advance or reject
      color: "bg-green-100 text-green-800",
      badge: (candidate) => {
        if (!candidate.postHireInfo) return null;
        const today = new Date();
        const trainingStart = new Date(
          candidate.postHireInfo.trainingStartDate
        );
        const trainingEnd = new Date(candidate.postHireInfo.trainingEndDate);
        const fieldWorkStart = new Date(
          candidate.postHireInfo.fieldWorkStartDate
        );
        const fieldWorkEnd = new Date(candidate.postHireInfo.fieldWorkEndDate);

        if (today < trainingStart) return null;
        if (today >= trainingStart && today <= trainingEnd)
          return { text: "🏋️ Training", color: "bg-blue-500 text-white" };
        if (today >= fieldWorkStart && today <= fieldWorkEnd)
          return { text: "🌱 Field Work", color: "bg-green-500 text-white" };
        if (today > fieldWorkEnd && candidate.postHireInfo.fieldWorkCompleted)
          return {
            text: "✅ Temp Employee",
            color: "bg-purple-500 text-white",
          };
        return null;
      },
    },
    suspended: {
      display: "Suspended",
      next: ["revoke"], // Only revoke option
      color: "bg-red-100 text-red-800",
      badge: null,
    },
    rejected: {
      display: "Rejected",
      next: [], // No actions for rejected candidates
      color: "bg-red-100 text-red-800",
      badge: null,
    },
  };

  const getStatusDisplay = (status) => statusConfig[status]?.display || status;
  const getStatusColor = (status) =>
    statusConfig[status]?.color || "bg-gray-100 text-gray-800";
  const getStatusBadge = (candidate) =>
    statusConfig[candidate.status]?.badge?.(candidate);
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

  const getProperNextActions = (currentStatus, candidate) => {
    const baseActions = statusConfig[currentStatus]?.next || [];

    // Filter out invalid actions based on context
    return baseActions.filter((action) => {
      // For non-suspended statuses, only show advance and reject
      if (currentStatus !== "suspended" && currentStatus !== "rejected") {
        return (
          action === "rejected" ||
          (action !== "revoke" && action !== "suspended")
        );
      }
      // For suspended, only show revoke
      if (currentStatus === "suspended") {
        return action === "revoke";
      }
      // For rejected, no actions
      if (currentStatus === "rejected") {
        return false;
      }
      return true;
    });
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

  const handleScheduleFieldWork = async (fieldWorkStartDate) => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/schedule-field-work`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fieldWorkStartDate }),
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
        setShowScheduleDialog(false);
      }
    } catch (error) {
      console.error("Error scheduling field work:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateFieldWorkDay = async (dayNumber, updates) => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/field-work-day/${dayNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
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
        setShowFieldWorkDialog(false);
        setSelectedDay(null);
      }
    } catch (error) {
      console.error("Error updating field work day:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendCandidate = async (suspensionReason) => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/suspend`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suspensionReason }),
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
        setShowSuspendDialog(false);
      }
    } catch (error) {
      console.error("Error suspending candidate:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteFieldWork = async () => {
    if (!selectedCandidate) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/job-applications/${selectedCandidate._id}/complete-field-work`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
      }
    } catch (error) {
      console.error("Error completing field work:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (action, candidate, day = null) => {
    setSelectedCandidate(candidate);
    if (action === "advance") setShowAdvanceDialog(true);
    if (action === "reject") setShowRejectDialog(true);
    if (action === "schedule") setShowScheduleDialog(true);
    if (action === "field-work-day") {
      setSelectedDay(day);
      setShowFieldWorkDialog(true);
    }
    if (action === "suspend") setShowSuspendDialog(true);
    if (action === "revoke") setShowRevokeDialog(true);
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
          getStatusBadge={getStatusBadge}
          getNextActions={getNextActions}
        />
      </div>

      <CandidateDialog
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAction={openActionDialog}
        onCompleteFieldWork={handleCompleteFieldWork}
        statusConfig={statusConfig}
        getStatusDisplay={getStatusDisplay}
        getStatusBadge={getStatusBadge}
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

      <ScheduleFieldWorkDialog
        isOpen={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        candidate={selectedCandidate}
        onSchedule={handleScheduleFieldWork}
        loading={actionLoading}
      />

      <FieldWorkDayDialog
        isOpen={showFieldWorkDialog}
        onClose={() => {
          setShowFieldWorkDialog(false);
          setSelectedDay(null);
        }}
        candidate={selectedCandidate}
        day={selectedDay}
        onUpdate={handleUpdateFieldWorkDay}
        loading={actionLoading}
      />

      <SuspendCandidateDialog
        isOpen={showSuspendDialog}
        onClose={() => setShowSuspendDialog(false)}
        candidate={selectedCandidate}
        onSuspend={handleSuspendCandidate}
        loading={actionLoading}
        getStatusDisplay={getStatusDisplay}
      />
      <RevokeSuspensionDialog
        isOpen={showRevokeDialog}
        onClose={() => setShowRevokeDialog(false)}
        candidate={selectedCandidate}
        onRevoke={handleRevokeSuspension}
        loading={actionLoading}
        getStatusDisplay={getStatusDisplay}
      />
    </div>
  );
}
