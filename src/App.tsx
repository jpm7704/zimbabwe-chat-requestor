
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import RequestSubmissionPage from "./pages/ChatInterface";
import EnquiryPage from "./pages/EnquiryPage";
import RequestsPage from "./pages/RequestsPage";
import RequestDetail from "./pages/RequestDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffVerification from "./pages/StaffVerification";
import NotFound from "./pages/NotFound";
import FieldWork from "./pages/FieldWork";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ApprovalsPage from "./pages/ApprovalsPage";
import DevRoleSwitcher from "./components/dev/DevRoleSwitcher";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Check for dev_role in localStorage regardless of environment
  const devRole = localStorage.getItem('dev_role');
  const isDevMode = !!devRole;
  
  console.log('App rendering, devRole:', devRole, 'isDevMode:', isDevMode);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/staff-verification" element={<StaffVerification />} />
            
            {/* Protected routes - all with full access */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/submit" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
            <Route path="/enquiry" element={<MainLayout><EnquiryPage /></MainLayout>} />
            <Route path="/chat" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
            <Route path="/requests" element={<MainLayout><RequestsPage /></MainLayout>} />
            <Route path="/requests/:id" element={<MainLayout><RequestDetail /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="/field-work" element={<MainLayout><FieldWork /></MainLayout>} />
            <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
            <Route path="/approvals" element={<MainLayout><ApprovalsPage /></MainLayout>} />
            
            {/* Redirect admin page to dashboard */}
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallback route for not found pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Always show DevRoleSwitcher regardless of environment */}
          <DevRoleSwitcher />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
