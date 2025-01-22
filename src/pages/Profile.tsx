import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

// Use the generated types from our database schema
type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: "",
    username: null,
    full_name: null,
    avatar_url: null,
    gender: null,
    date_of_birth: null,
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name, gender, date_of_birth")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile({
            username: data.username,
            full_name: data.full_name,
            gender: data.gender,
            date_of_birth: data.date_of_birth,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          gender: profile.gender,
          date_of_birth: profile.date_of_birth,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <Input
                id="username"
                value={profile.username || ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                id="full_name"
                value={profile.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <Select
                value={profile.gender || ""}
                onValueChange={(value) =>
                  setProfile({ ...profile, gender: value })
                }
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <Input
                id="date_of_birth"
                type="date"
                value={profile.date_of_birth || ""}
                onChange={(e) =>
                  setProfile({ ...profile, date_of_birth: e.target.value })
                }
                disabled={saving}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;