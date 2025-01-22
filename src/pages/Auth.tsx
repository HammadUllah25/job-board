import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const view = searchParams.get("view");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          if (view === "sign_up") {
            navigate("/profile");
            toast({
              title: "Welcome!",
              description: "Please complete your profile information.",
            });
          } else {
            navigate("/");
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });
          }
        }
        if (event === "SIGNED_OUT") {
          setError(null);
        }
        if (event === "USER_UPDATED") {
          const { error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            setError(getErrorMessage(sessionError));
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, view]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return "Invalid email or password. Please check your credentials and try again.";
        case 422:
          if (error.message.includes("weak_password")) {
            return "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
          }
          return "Invalid email format. Please enter a valid email address.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to JobBoard</h2>
          <p className="text-muted-foreground mt-2">
            {view === "sign_up" ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <SupabaseAuth
            supabaseClient={supabase}
            view={view === "sign_up" ? "sign_up" : "sign_in"}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign in",
                  loading_button_label: "Signing in ...",
                },
                sign_up: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password (min. 8 chars, with uppercase, lowercase & number)",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;