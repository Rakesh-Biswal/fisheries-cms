import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import HiringCard from "./hiring-card";

export default function HiringList({
  jobPosts,
  searchTerm,
  filterDepartment,
  setFilterDepartment,
  onEditJob,
  onJobDeleted,
  loading,
}) {
  // Get unique departments for filter
  const departments = [
    ...new Set(jobPosts.map((job) => job.department).filter(Boolean)),
  ];

  // Filter jobs based on search term and department
  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || job.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Current Job Openings</h2>

      {/* Department Filter */}
      {departments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filterDepartment === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterDepartment("all")}
          >
            All Departments
          </Button>
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={filterDepartment === dept ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDepartment(dept)}
            >
              {dept}
            </Button>
          ))}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No job openings
            </h3>
            <p className="text-gray-500">
              {jobPosts.length === 0
                ? "Get started by creating your first job posting."
                : "No jobs match your search criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <HiringCard
              key={job._id || job.id}
              job={job}
              onEdit={() => onEditJob(job)}
              onDelete={onJobDeleted}
              onView={(id) =>
                (window.location.href = `/dashboard/hr/Hiring/${id}/view`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
