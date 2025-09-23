import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit } from "lucide-react";

const JobDetailsPanel = ({ jobDetails, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ←
        </Button>
        <span className="text-sm text-gray-500">
          Job List / {jobDetails._id}
        </span>
        <div className="ml-auto text-xs text-gray-500">
          Last update: {formatDate(jobDetails.updatedAt)}
        </div>
        <Button variant="ghost" size="sm">
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

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Created at</div>
              <div className="font-medium">
                {formatDate(jobDetails.postedDate)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <Badge
                className={
                  jobDetails.status === "active"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {jobDetails.status === "active" ? "🔥 Hiring" : "❌ Closed"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Employment Type</div>
              <div className="font-medium">{jobDetails.employmentType}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                Required Experience
              </div>
              <div className="font-medium">{jobDetails.experience}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">Job Description</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {jobDetails.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-3">
              Working Shift
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-xs text-center text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[0, 1, 2, 4, 5, 6].map((i) => (
                <div key={i} className="h-2 bg-orange-400 rounded"></div>
              ))}
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Morning Shift (6/7 days)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPanel;
