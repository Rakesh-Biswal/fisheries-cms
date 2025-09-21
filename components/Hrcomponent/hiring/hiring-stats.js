import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Users, Filter } from "lucide-react";

export default function HiringStats({ jobPosts }) {
  // Check if job is expired
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const totalJobs = jobPosts.length;
  const activeJobs = jobPosts.filter(
    (job) => !isExpired(job.expiryDate)
  ).length;
  const totalOpenings = jobPosts.reduce(
    (sum, job) => sum + parseInt(job.openings || 0),
    0
  );
  const departmentsCount = new Set(jobPosts.map((job) => job.department)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="shadow-sm border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold mt-1">{totalJobs}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Jobs</p>
            <p className="text-2xl font-bold mt-1">{activeJobs}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Openings</p>
            <p className="text-2xl font-bold mt-1">{totalOpenings}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Departments</p>
            <p className="text-2xl font-bold mt-1">{departmentsCount}</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Filter className="h-6 w-6 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
