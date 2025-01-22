import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const getProfile = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load profile information.",
            });
          } else {
            setFullName(data?.full_name || null);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        } finally {
          setLoading(false);
        }
      };

      getProfile();
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b backdrop-blur-sm bg-white/75 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold">
              JobBoard
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-sm hover:text-primary transition-colors">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-sm hover:text-primary transition-colors">
                Companies
              </Link>
              <Link to="/salary" className="text-sm hover:text-primary transition-colors">
                Salary Guide
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/post-job">
                  <Button size="sm">Post a Job</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative h-8 w-8 rounded-full"
                      disabled={loading}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{loading ? "..." : getInitials(fullName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth?view=sign_up">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/jobs" className="text-sm hover:text-primary transition-colors">
                  Find Jobs
                </Link>
                <Link to="/companies" className="text-sm hover:text-primary transition-colors">
                  Companies
                </Link>
                <Link to="/salary" className="text-sm hover:text-primary transition-colors">
                  Salary Guide
                </Link>
                {user ? (
                  <>
                    <Link to="/post-job">
                      <Button className="w-full">Post a Job</Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">Profile</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button className="w-full mb-2">Sign in</Button>
                    </Link>
                    <Link to="/auth?view=sign_up">
                      <Button className="w-full" variant="outline">Sign up</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;