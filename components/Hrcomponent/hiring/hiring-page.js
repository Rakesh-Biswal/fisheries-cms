"use client";

import { useState, useEffect } from "react";
import HiringForm from "./hiring-form";
import HiringStats from "./hiring-stats";
import HiringList from "./hiring-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HiringPage() {
  const [activeTab, setActiveTab] = useState("postings");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hr/hiring/fetch`
      );
      const result = await response.json();

      if (result.success) {
        setJobPosts(result.data);
      } else {
        console.error("Failed to fetch jobs:", result.error);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobCreated = () => {
    fetchJobs(); // Refresh the list
    setActiveTab("postings"); // Switch to listings tab
  };

  const handleJobUpdated = () => {
    fetchJobs(); // Refresh the list
    setEditingJob(null); // Clear editing state
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hiring Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage job postings for your company
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                className="pl-10 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="postings">Job Postings</TabsTrigger>
            <TabsTrigger value="create">
              {editingJob ? "Edit Job" : "Create New Job"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 pt-4">
            <HiringForm
              editingJob={editingJob}
              onJobCreated={handleJobCreated}
              onJobUpdated={handleJobUpdated}
              onCancelEdit={() => setEditingJob(null)}
            />
          </TabsContent>

          <TabsContent value="postings" className="space-y-4 pt-4">
            <HiringStats jobPosts={jobPosts} />

            <HiringList
              jobPosts={jobPosts}
              searchTerm={searchTerm}
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              onEditJob={handleEditJob}
              onJobDeleted={fetchJobs}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
