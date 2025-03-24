
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import RequestSubmissionPage from "./pages/ChatInterface";
import RequestsPage from "./pages/RequestsPage";
import RequestDetail from "./pages/RequestDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FieldWork from "./pages/FieldWork";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import StaffManagement from "./pages/StaffManagement";
import AdminPanel from "./pages/AdminPanel";
import RequirePermission from "./components/auth/RequirePermission";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/submit" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
          <Route path="/chat" element={<MainLayout><RequestSubmissionPage /></MainLayout>} />
          <Route path="/requests" element={<MainLayout><RequestsPage /></MainLayout>} />
          <Route path="/requests/:id" element={<MainLayout><RequestDetail /></MainLayout>} />
          
          {/* Role-specific routes with permission guards */}
          <Route path="/field-work" element={
            <MainLayout>
              <RequirePermission permission="canAccessFieldReports">
                <FieldWork />
              </RequirePermission>
            </MainLayout>
          } />
          
          <Route path="/analytics" element={
            <MainLayout>
              <RequirePermission permission="canAccessAnalytics">
                <Analytics />
              </RequirePermission>
            </MainLayout>
          } />
          
          <Route path="/reports" element={
            <MainLayout>
              <RequirePermission permission="canAccessFieldReports">
                <Reports />
              </RequirePermission>
            </MainLayout>
          } />
          
          <Route path="/staff" element={
            <MainLayout>
              <RequirePermission permission="canManageStaff">
                <StaffManagement />
              </RequirePermission>
            </MainLayout>
          } />
          
          <Route path="/admin" element={
            <MainLayout>
              <RequirePermission permission="canAccessAdminPanel">
                <AdminPanel />
              </RequirePermission>
            </MainLayout>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
