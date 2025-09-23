import { useState } from "react";
import { Search, MoreHorizontal, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TalentListPanel = ({
  candidates,
  activeTab,
  onTabChange,
  onCandidateSelect,
  onCandidateAction,
  statusConfig,
  getStatusCount,
  getStatusDisplay,
  getStatusColor,
  getStatusBadge,
  getNextActions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = candidates.filter(
    (candidate) =>
      `${candidate.firstName} ${candidate.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fix the work status badge function in TalentListPanel.js:
  const getWorkStatusBadge = (candidate) => {
    if (candidate.status !== "hired" || !candidate.postHireInfo) return null;

    const today = new Date();
    const trainingStart = candidate.postHireInfo.trainingStartDate
      ? new Date(candidate.postHireInfo.trainingStartDate)
      : null;
    const trainingEnd = candidate.postHireInfo.trainingEndDate
      ? new Date(candidate.postHireInfo.trainingEndDate)
      : null;
    const fieldWorkStart = candidate.postHireInfo.fieldWorkStartDate
      ? new Date(candidate.postHireInfo.fieldWorkStartDate)
      : null;
    const fieldWorkEnd = candidate.postHireInfo.fieldWorkEndDate
      ? new Date(candidate.postHireInfo.fieldWorkEndDate)
      : null;

    // Check if dates are valid
    if (
      trainingStart &&
      trainingEnd &&
      today >= trainingStart &&
      today <= trainingEnd
    ) {
      return { text: "🏋️ Training", color: "bg-blue-500 text-white" };
    }
    if (
      fieldWorkStart &&
      fieldWorkEnd &&
      today >= fieldWorkStart &&
      today <= fieldWorkEnd
    ) {
      return { text: "🌱 Field Work", color: "bg-green-500 text-white" };
    }
    if (
      fieldWorkEnd &&
      today > fieldWorkEnd &&
      candidate.postHireInfo.fieldWorkCompleted
    ) {
      return { text: "✅ Temp Employee", color: "bg-purple-500 text-white" };
    }

    return null;
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    return `${age} Years Old`;
  };

  const getExperienceYears = (experiences) => {
    if (!experiences || experiences.length === 0) return "No experience";
    const totalMonths = experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.currentJob ? new Date() : new Date(exp.endDate);
      return (
        total +
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
      );
    }, 0);
    return `${Math.floor(totalMonths / 12)} Years`;
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Talent List
        </h2>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 mb-6 flex-wrap">
          {["all", ...Object.keys(statusConfig)].map((status) => (
            <button
              key={status}
              onClick={() => onTabChange(status)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === status
                  ? "text-orange-600 border-orange-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {status === "all" ? "All" : getStatusDisplay(status)}{" "}
              <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                {getStatusCount(status)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Candidates Table - Updated to 7 columns */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Name</div>
            <div>Expected Salary</div>
            <div>Experience</div>
            <div>Rating</div>
            <div>Status</div>
            <div>Work Status</div> {/* NEW COLUMN */}
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => {
              const statusBadge = getStatusBadge
                ? getStatusBadge(candidate)
                : null;
              const workStatusBadge = getWorkStatusBadge(candidate); // NEW

              return (
                <div
                  key={candidate._id}
                  className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onCandidateSelect(candidate)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={candidate.avatar} />
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
                    {candidate.expectedSalary || "Not specified"}
                  </div>

                  <div className="flex items-center text-sm text-gray-900">
                    {getExperienceYears(candidate.workExperiences)}
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>

                  {/* Status Column */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(candidate.status)}>
                      {getStatusDisplay(candidate.status)}
                    </Badge>
                    {statusBadge && (
                      <Badge className={statusBadge.color}>
                        {statusBadge.text}
                      </Badge>
                    )}
                  </div>

                  {/* NEW: Work Status Column */}
                  <div className="flex items-center">
                    {workStatusBadge ? (
                      <Badge className={workStatusBadge.color}>
                        {workStatusBadge.text}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {getNextActions(candidate.status).map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (action === "revoke") {
                            onCandidateAction("revoke", candidate);
                          } else if (action === "rejected") {
                            onCandidateAction("reject", candidate);
                          } else if (action === "suspended") {
                            onCandidateAction("suspend", candidate);
                          } else {
                            onCandidateAction("advance", candidate);
                          }
                        }}
                        className={
                          action === "rejected" || action === "suspended"
                            ? "text-red-600 border-red-200"
                            : action === "revoke"
                              ? "text-green-600 border-green-200"
                              : ""
                        }
                      >
                        {action === "rejected"
                          ? "Reject"
                          : action === "suspended"
                            ? "Suspend"
                            : action === "revoke"
                              ? "Revoke"
                              : "Advance"}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredCandidates.length} of {candidates.length} results
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
  );
};

export default TalentListPanel;
