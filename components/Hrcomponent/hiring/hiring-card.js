import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, BookOpen, Clock, Eye, Edit, Trash } from "lucide-react";

export default function HiringCard({ job, onEdit, onDelete, onView }) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if job is expired
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/${job._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (result.success) {
        onDelete(); // Refresh the list
        setDeleteDialogOpen(false);
      } else {
        console.error("Failed to delete job:", result.error);
        alert("Failed to delete job. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("An error occurred while deleting the job.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card
        className={`border-0 shadow-sm transition-all hover:shadow-md ${
          isExpired(job.expiryDate) ? "opacity-70" : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant={
                        isExpired(job.expiryDate) ? "destructive" : "outline"
                      }
                    >
                      {isExpired(job.expiryDate) ? "Expired" : "Active"}
                    </Badge>
                    <Badge variant="secondary">{job.employmentType}</Badge>
                    {job.department && (
                      <Badge variant="outline">{job.department}</Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons instead of Dropdown */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(job._id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 line-clamp-2">{job.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{job.openings} openings</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <BookOpen className="h-4 w-4" />
                  <span>{job.qualification}</span>
                </div>
                {job.experience && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>Exp: {job.experience}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {job.location && (
                  <div className="text-gray-500">Location: {job.location}</div>
                )}
                {job.salary && (
                  <div className="text-gray-500">Salary: {job.salary}</div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Deadline: {job.expiryDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Job Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {job.title}
              <Badge
                variant={isExpired(job.expiryDate) ? "destructive" : "outline"}
              >
                {isExpired(job.expiryDate) ? "Expired" : "Active"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Department
                </h4>
                <p>{job.department}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Employment Type
                </h4>
                <p>{job.employmentType}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Location
                </h4>
                <p>{job.location}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Openings
                </h4>
                <p>{job.openings}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Experience
                </h4>
                <p>{job.experience}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Salary</h4>
                <p>{job.salary || "Not specified"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Qualifications
                </h4>
                <p>{job.qualification}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Deadline
                </h4>
                <p>{job.expiryDate}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-500">
                Job Description
              </h4>
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the job posting for "{job.title}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
