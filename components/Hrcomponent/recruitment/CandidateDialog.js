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
import { Star, ArrowRight, MoreHorizontal } from "lucide-react";

const CandidateDialog = ({
  candidate,
  isOpen,
  onClose,
  onAction,
  statusConfig,
  getStatusDisplay,
}) => {
  if (!candidate) return null;

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

  const getNextActions = (status) => statusConfig[status]?.next || [];

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
            {getNextActions(candidate.status).map((action) => (
              <Button
                key={action}
                variant={action === "rejected" ? "outline" : "default"}
                onClick={() =>
                  onAction(
                    action === "rejected" ? "reject" : "advance",
                    candidate
                  )
                }
                className={
                  action === "rejected" ? "text-red-600 border-red-200" : ""
                }
              >
                {action === "rejected"
                  ? "Reject"
                  : `Advance to ${getStatusDisplay(action)}`}
              </Button>
            ))}
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
              <div className="text-sm font-medium text-gray-900 mb-3">
                Application Stages
              </div>
              <div className="space-y-3">
                {getStageHistory(candidate).map((stage, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-3 h-3 rounded-full ${
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
                                        : "bg-red-500"
                      }`}
                    ></div>
                    <div className="text-left">
                      <div className="font-medium capitalize">
                        {getStatusDisplay(stage.stage)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(stage.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

          {/* Tabs Section */}
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="contact">📞 Contact Details</TabsTrigger>
              <TabsTrigger value="history">📋 Work History</TabsTrigger>
              <TabsTrigger value="education">🎓 Education</TabsTrigger>
              <TabsTrigger value="documents">📎 Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Email
                  </label>
                  <div className="text-sm text-gray-900">{candidate.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Phone
                  </label>
                  <div className="text-sm text-gray-900">{candidate.phone}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location
                  </label>
                  <div className="text-sm text-gray-900">
                    {candidate.city}, {candidate.state}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Birthdate
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(candidate.dateOfBirth)}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {candidate.workExperiences?.length > 0 ? (
                candidate.workExperiences.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold">
                      {exp.position} at {exp.company}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.currentJob ? "Present" : formatDate(exp.endDate)}
                    </p>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No work history available
                </div>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-6">
              {candidate.educations?.length > 0 ? (
                candidate.educations.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm">
                      Graduated: {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No education information available
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-6">
              <div className="text-center py-12 text-gray-500">
                No documents uploaded
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              📋 Save Candidate
            </Button>
            <Button variant="outline" className="flex-1">
              💬 Send Message
            </Button>
            <Button variant="outline" className="flex-1">
              📅 Schedule Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDialog;
