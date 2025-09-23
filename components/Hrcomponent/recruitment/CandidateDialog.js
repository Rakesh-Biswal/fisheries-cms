import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ArrowRight, Calendar, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const CandidateDialog = ({
  candidate,
  isOpen,
  onClose,
  onAction,
  onCompleteFieldWork,
  statusConfig,
  getStatusDisplay,
  getStatusBadge,
}) => {
  if (!candidate) return null;

  const [showAllStages, setShowAllStages] = useState(false);
  const [fieldWorkProgress, setFieldWorkProgress] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    return `${age} Years Old`;
  };

  // Fix progress calculation
  const getFieldWorkProgress = () => {
    if (!candidate.postHireInfo?.fieldWorkDays) return null;

    const fieldWorkDays = candidate.postHireInfo.fieldWorkDays || [];
    const completedDays = fieldWorkDays.filter((day) => day.completed).length;
    const totalDays = fieldWorkDays.length;
    const progress = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    return { completed: completedDays, total: totalDays, progress };
  };

  // Update progress when candidate changes
  useEffect(() => {
    setFieldWorkProgress(getFieldWorkProgress());
  }, [candidate]);

  // Fix stage history display
  const getStageHistory = (candidate) => {
    if (!candidate.stageHistory || candidate.stageHistory.length === 0) {
      return [
        {
          stage: "pending",
          date: candidate.appliedDate,
          note: "Applied for the position",
        },
      ];
    }
    return candidate.stageHistory.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  // Fix action buttons logic
  const getProperNextActions = (currentStatus) => {
    const baseActions = statusConfig[currentStatus]?.next || [];

    return baseActions.filter((action) => {
      if (currentStatus !== "suspended" && currentStatus !== "rejected") {
        return (
          action === "rejected" ||
          (action !== "revoke" && action !== "suspended")
        );
      }
      if (currentStatus === "suspended") {
        return action === "revoke";
      }
      return false;
    });
  };

  const stageHistory = getStageHistory(candidate);
  const displayedStages = showAllStages
    ? stageHistory
    : stageHistory.slice(0, 3);
  const statusBadge = getStatusBadge(candidate);
  const nextActions = getProperNextActions(candidate.status);
  const isHired = candidate.status === "hired";
  const hasFieldWorkScheduled = !!candidate.postHireInfo?.fieldWorkStartDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-6xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Talent Details
            </DialogTitle>
            <div className="text-sm text-gray-500">ID #{candidate._id}</div>
          </div>
          <div className="flex items-center gap-2">
            {nextActions.map((action) => (
              <Button
                key={action}
                variant={
                  action === "rejected" || action === "suspended"
                    ? "outline"
                    : "default"
                }
                onClick={() => {
                  if (action === "revoke") {
                    onAction("revoke", candidate);
                  } else if (action === "rejected") {
                    onAction("reject", candidate);
                  } else if (action === "suspended") {
                    onAction("suspend", candidate);
                  } else {
                    onAction("advance", candidate);
                  }
                }}
                className={
                  action === "rejected"
                    ? "text-red-600 border-red-200 hover:bg-red-50"
                    : action === "suspended"
                      ? "text-red-600 border-red-200 hover:bg-red-50"
                      : action === "revoke"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                }
              >
                {action === "rejected"
                  ? "Reject"
                  : action === "suspended"
                    ? "Suspend"
                    : action === "revoke"
                      ? "Revoke Suspension"
                      : `Advance to ${getStatusDisplay(action)}`}
              </Button>
            ))}
            {isHired && !hasFieldWorkScheduled && (
              <Button onClick={() => onAction("schedule", candidate)}>
                📅 Schedule Field Work
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-xl">
                {candidate.firstName?.[0]}
                {candidate.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-semibold">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <Badge className={statusConfig[candidate.status]?.color}>
                  {getStatusDisplay(candidate.status)}
                </Badge>
                {statusBadge && (
                  <Badge className={statusBadge.color}>
                    {statusBadge.text}
                  </Badge>
                )}
                {candidate.workExperiences?.length > 3 && (
                  <Badge className="bg-green-100 text-green-800 font-medium">
                    🏆 TOP TALENT
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <span>♂ {candidate.gender || "Not specified"}</span>
                <span>👤 {calculateAge(candidate.dateOfBirth)}</span>
              </div>

              {/* Field Work Progress for Hired Candidates */}
              {isHired && hasFieldWorkScheduled && fieldWorkProgress && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">
                      7-Day Field Work Progress
                    </h4>
                    <span className="text-sm text-blue-700">
                      {fieldWorkProgress.completed}/{fieldWorkProgress.total}{" "}
                      days completed
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${fieldWorkProgress.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-blue-600 mt-1">
                    <span>
                      Start:{" "}
                      {formatDate(candidate.postHireInfo.fieldWorkStartDate)}
                    </span>
                    <span>
                      End: {formatDate(candidate.postHireInfo.fieldWorkEndDate)}
                    </span>
                  </div>

                  {fieldWorkProgress.completed === fieldWorkProgress.total && (
                    <Button
                      onClick={onCompleteFieldWork}
                      className="mt-3 bg-green-600 hover:bg-green-700"
                    >
                      ✅ Complete Field Work & Start 6-Month Temp Employment
                    </Button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {candidate.expectedSalary || "Not specified"}
                  </div>
                  <div className="text-xs text-gray-500">Expected Salary</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    4.8
                  </div>
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {candidate.workExperiences?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.floor(Math.random() * 200) + 50}
                  </div>
                  <div className="text-xs text-gray-500">Gigs Done</div>
                </div>
              </div>
            </div>

            {/* Stage History */}
            <div className="text-right min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-900">
                  Application Stages
                </div>
                {stageHistory.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllStages(!showAllStages)}
                    className="text-xs text-orange-600 hover:text-orange-700"
                  >
                    {showAllStages
                      ? "Show Less"
                      : `Show All (${stageHistory.length})`}
                  </Button>
                )}
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {displayedStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        stage.stage === "pending"
                          ? "bg-blue-500"
                          : stage.stage === "reviewed"
                            ? "bg-purple-500"
                            : stage.stage === "phone_screen"
                              ? "bg-indigo-500"
                              : stage.stage === "technical_test"
                                ? "bg-cyan-500"
                                : stage.stage === "interview"
                                  ? "bg-orange-500"
                                  : stage.stage === "final_interview"
                                    ? "bg-amber-500"
                                    : stage.stage === "offer"
                                      ? "bg-lime-500"
                                      : stage.stage === "hired"
                                        ? "bg-green-500"
                                        : stage.stage === "suspended"
                                          ? "bg-red-500"
                                          : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium capitalize truncate">
                        {getStatusDisplay(stage.stage)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {formatDate(stage.date)}
                      </div>
                      {stage.note && (
                        <div
                          className="text-xs text-gray-400 truncate"
                          title={stage.note}
                        >
                          {stage.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Field Work Days Grid for Hired Candidates */}
          {isHired && hasFieldWorkScheduled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">
                7-Day Field Work Schedule
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {candidate.postHireInfo.fieldWorkDays.map((day) => (
                  <div
                    key={day.day}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      day.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      onAction("field-work-day", candidate, day.day)
                    }
                  >
                    <div className="font-semibold text-lg">Day {day.day}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex justify-center">
                      {day.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    {day.rating > 0 && (
                      <div className="flex justify-center mt-1">
                        {[...Array(day.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Section */}
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

          {/* Enhanced Tabs Section with Post-Hire Info */}
          <Tabs
            defaultValue={isHired ? "post-hire" : "contact"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger value="post-hire">📊 Post-Hire</TabsTrigger>
              <TabsTrigger value="contact">📞 Contact</TabsTrigger>
              <TabsTrigger value="history">📋 Work History</TabsTrigger>
              <TabsTrigger value="education">🎓 Education</TabsTrigger>
              <TabsTrigger value="documents">📎 Documents</TabsTrigger>
            </TabsList>

            {/* Post-Hire Tab */}
            <TabsContent value="post-hire" className="space-y-4 mt-6">
              {isHired ? (
                <div className="space-y-6">
                  {hasFieldWorkScheduled ? (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">
                            Training Period
                          </h5>
                          <p className="text-sm">
                            <strong>Start:</strong>{" "}
                            {formatDate(
                              candidate.postHireInfo.trainingStartDate
                            )}
                            <br />
                            <strong>End:</strong>{" "}
                            {formatDate(candidate.postHireInfo.trainingEndDate)}
                            <br />
                            <strong>Duration:</strong> 2 days
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-900 mb-2">
                            Field Work Period
                          </h5>
                          <p className="text-sm">
                            <strong>Start:</strong>{" "}
                            {formatDate(
                              candidate.postHireInfo.fieldWorkStartDate
                            )}
                            <br />
                            <strong>End:</strong>{" "}
                            {formatDate(
                              candidate.postHireInfo.fieldWorkEndDate
                            )}
                            <br />
                            <strong>Duration:</strong> 7 days
                          </p>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">
                          Temp Employment
                        </h5>
                        <p className="text-sm">
                          <strong>Start:</strong>{" "}
                          {formatDate(
                            candidate.postHireInfo.tempEmploymentStartDate
                          )}
                          <br />
                          <strong>End:</strong>{" "}
                          {formatDate(
                            candidate.postHireInfo.tempEmploymentEndDate
                          )}
                          <br />
                          <strong>Duration:</strong> 6 months
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Field work not scheduled yet.</p>
                      <Button
                        onClick={() => onAction("schedule", candidate)}
                        className="mt-4"
                      >
                        📅 Schedule Field Work
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Post-hire information will be available after candidate is
                  hired.
                </div>
              )}
            </TabsContent>

            {/* Other tabs remain the same */}
            <TabsContent value="contact" className="space-y-4 mt-6">
              {/* ... existing contact content ... */}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {/* ... existing work history content ... */}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-6">
              {/* ... existing education content ... */}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-6">
              {/* ... existing documents content ... */}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {getProperNextActions(candidate.status, candidate).map((action) => (
              <Button
                key={action}
                variant={
                  action === "rejected" || action === "suspended"
                    ? "outline"
                    : "default"
                }
                onClick={() => {
                  if (action === "revoke") {
                    onAction("revoke", candidate);
                  } else if (action === "rejected") {
                    onAction("reject", candidate);
                  } else if (action === "suspended") {
                    onAction("suspend", candidate);
                  } else {
                    onAction("advance", candidate);
                  }
                }}
                className={
                  action === "rejected"
                    ? "text-red-600 border-red-200 hover:bg-red-50"
                    : action === "suspended"
                      ? "text-red-600 border-red-200 hover:bg-red-50"
                      : action === "revoke"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                }
              >
                {action === "rejected"
                  ? "Reject"
                  : action === "suspended"
                    ? "Suspend"
                    : action === "revoke"
                      ? "Revoke Suspension"
                      : `Advance to ${getStatusDisplay(action)}`}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDialog;
