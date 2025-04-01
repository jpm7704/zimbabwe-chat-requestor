
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
import RequirePermission from "./components/auth/RequirePermission";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  const isDevMode = isDevelopment && devRole;
  
  console.log('App rendering, isDevelopment:', isDevelopment, 'devRole:', devRole, 'isDevMode:', isDevMode);
  
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
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/submit" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
            <Route path="/enquiry" element={<MainLayout><EnquiryPage /></MainLayout>} />
            <Route path="/chat" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
            <Route path="/requests" element={<MainLayout><RequestsPage /></MainLayout>} />
            <Route path="/requests/:id" element={<MainLayout><RequestDetail /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            
            {/* Role-specific routes - dev mode bypasses permission checks */}
            <Route path="/field-work" element={
              <MainLayout>
                {isDevMode ? <FieldWork /> : (
                  <RequirePermission permission="canAccessFieldReports">
                    <FieldWork />
                  </RequirePermission>
                )}
              </MainLayout>
            } />
            
            <Route path="/analytics" element={
              <MainLayout>
                {isDevMode ? <Analytics /> : (
                  <RequirePermission permission="canAccessAnalytics">
                    <Analytics />
                  </RequirePermission>
                )}
              </MainLayout>
            } />
            
            <Route path="/reports" element={
              <MainLayout>
                {isDevMode ? <Reports /> : (
                  <RequirePermission permission="canAccessFieldReports">
                    <Reports />
                  </RequirePermission>
                )}
              </MainLayout>
            } />
            
            <Route path="/approvals" element={
              <MainLayout>
                {isDevMode ? <ApprovalsPage /> : (
                  <RequirePermission permission="canApproveRequests">
                    <ApprovalsPage />
                  </RequirePermission>
                )}
              </MainLayout>
            } />
            
            {/* Redirect admin page to dashboard */}
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallback route for not found pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
