import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm && !location) {
      toast({
        title: "Search criteria required",
        description: "Please enter either a job title/keyword or location to search.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/jobs?q=${searchTerm}&l=${location}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="bg-gradient-to-b from-zinc-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg text-zinc-600 mb-8">
              Discover thousands of job opportunities with all the information you need.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Job title or keyword"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" className="md:w-auto">
                Search Jobs
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Popular Job Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Technology", "Healthcare", "Finance"].map((category) => (
              <div
                key={category}
                className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <p className="text-sm text-zinc-600 mb-4">
                  1000+ available positions
                </p>
                <Button variant="ghost" className="group-hover:text-primary">
                  Browse Jobs
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;