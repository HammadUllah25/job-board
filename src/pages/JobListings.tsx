import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Building2, DollarSign, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/components/AuthProvider";

const fetchJobs = async (userId?: string) => {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  // If userId is provided, filter for only that user's jobs
  if (userId) {
    query = query.eq('posted_by', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const JobListings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const locationQuery = searchParams.get("l")?.toLowerCase() || "";
  const [showMyJobs, setShowMyJobs] = useState(false);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', showMyJobs ? user?.id : 'all'],
    queryFn: () => fetchJobs(showMyJobs ? user?.id : undefined),
  });

  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    salary: "",
  });

  // Filter jobs based on selected criteria, search query, and location
  const filteredJobs = jobs?.filter(job => {
    // Filter by job type if selected
    if (filters.jobType && job.job_type.toLowerCase() !== filters.jobType.toLowerCase()) {
      return false;
    }

    // Filter by search query (title, company, or description)
    if (searchQuery) {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery) ||
        job.company.toLowerCase().includes(searchQuery) ||
        job.description.toLowerCase().includes(searchQuery);
      
      if (!matchesSearch) return false;
    }

    // Filter by location
    if (locationQuery) {
      if (!job.location.toLowerCase().includes(locationQuery)) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading jobs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="mb-4">
                  <Button
                    variant={showMyJobs ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setShowMyJobs(!showMyJobs)}
                  >
                    {showMyJobs ? "Showing My Posted Jobs" : "Show My Posted Jobs"}
                  </Button>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Job Type</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.jobType}
                  onChange={(e) =>
                    setFilters({ ...filters, jobType: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="md:col-span-3">
          {showMyJobs && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                My Posted Jobs {filteredJobs?.length > 0 ? `(${filteredJobs.length} jobs)` : ''}
              </h2>
              {filteredJobs?.length === 0 && (
                <p className="text-muted-foreground mt-2">
                  You haven't posted any jobs yet.
                </p>
              )}
            </div>
          )}

          {(searchQuery || locationQuery) && !showMyJobs && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Search Results {filteredJobs?.length > 0 ? `(${filteredJobs.length} jobs found)` : ''}
              </h2>
              {filteredJobs?.length === 0 && (
                <p className="text-muted-foreground mt-2">
                  No jobs found matching your search criteria.
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {filteredJobs?.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.job_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      {job.salary_range && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary_range}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(job.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;