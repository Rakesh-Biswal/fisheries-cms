import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Calendar } from "lucide-react";

export default function HiringForm({
  editingJob,
  onJobCreated,
  onJobUpdated,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    openings: "",
    expiryDate: "",
    qualification: "",
    department: "",
    experience: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || "",
        description: editingJob.description || "",
        openings: editingJob.openings || "",
        expiryDate: editingJob.expiryDate || "",
        qualification: editingJob.qualification || "",
        department: editingJob.department || "",
        experience: editingJob.experience || "",
        location: editingJob.location || "",
        salary: editingJob.salary || "",
        employmentType: editingJob.employmentType || "Full-time",
      });
    }
  }, [editingJob]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingJob
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/${editingJob._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/create`;

      const method = editingJob ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        if (editingJob) {
          onJobUpdated();
        } else {
          onJobCreated();
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          openings: "",
          expiryDate: "",
          qualification: "",
          department: "",
          experience: "",
          location: "",
          salary: "",
          employmentType: "Full-time",
        });
      } else {
        console.error("Failed to save job:", result.error);
        alert("Failed to save job. Please try again.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("An error occurred while saving the job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
        </CardTitle>
        <CardDescription className="text-blue-100">
          Fill in the details below to {editingJob ? "edit" : "create a new"}{" "}
          job posting
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Engineering, Marketing, HR"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY or Remote"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Openings */}
            <div className="space-y-2">
              <Label htmlFor="openings">Number of Openings *</Label>
              <Input
                id="openings"
                name="openings"
                type="number"
                min="1"
                value={formData.openings}
                onChange={handleChange}
                placeholder="e.g. 5"
                required
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level *</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 3-5 years"
                required
              />
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>
          </div>

          {/* Qualification */}
          <div className="space-y-2">
            <Label htmlFor="qualification">Required Qualifications *</Label>
            <Input
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. B.Tech in Computer Science, MBA in Marketing"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed job description, responsibilities, and requirements..."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Application Deadline *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="px-6" disabled={submitting}>
              {submitting
                ? "Processing..."
                : editingJob
                  ? "Update Job Posting"
                  : "Create Job Posting"}
            </Button>
            {editingJob && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={submitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
