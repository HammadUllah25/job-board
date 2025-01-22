import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/job-board">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/job-board" element={<HomePage />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
