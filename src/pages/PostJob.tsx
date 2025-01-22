import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time",
    salary_range: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to post a job.",
          variant: "destructive",
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          posted_by: userData.user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Job Posted Successfully",
        description: "Your job listing has been created and is now live.",
      });
      
      navigate('/jobs'); // Redirect to jobs listing page
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Fill out the form below to create a new job listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Type</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Range</label>
                <Input
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $100,000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, requirements, and benefits..."
                  className="min-h-[200px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Post Job
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;