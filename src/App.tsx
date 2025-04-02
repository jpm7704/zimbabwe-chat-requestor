import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
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
import ReportDetail from "./pages/ReportDetail";
import Settings from "./pages/Settings";
import ApprovalsPage from "./pages/ApprovalsPage";
import UserManagement from "./pages/UserManagement";
import RolesManagement from "./pages/RolesManagement";
import SystemSettings from "./pages/SystemSettings";
import UserProfile from "./pages/UserProfile";
import { useAuth } from "./hooks/useAuth";
import { useRoles } from "./hooks/useRoles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";

const RoleRoute = ({ 
  element, 
  allowedRoles = [],
  redirectTo = "/dashboard" 
}) => {
  const { userProfile, isAuthenticated } = useAuth();
  const { 
    isAdmin, 
    isRegularUser, 
    isFieldOfficer, 
    isProjectOfficer, 
    isAssistantProjectOfficer, 
    isHeadOfPrograms, 
    isDirector, 
    isCEO, 
    isPatron 
  } = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  const checkRole = () => {
    if (isDevelopment && devRole) return true;
    
    if (isAdmin()) return true;
    
    return allowedRoles.some(role => {
      switch(role) {
        case "admin": return isAdmin();
        case "user": return isRegularUser();
        case "field_officer": return isFieldOfficer();
        case "project_officer": return isProjectOfficer();
        case "assistant_project_officer": return isAssistantProjectOfficer();
        case "head_of_programs": return isHeadOfPrograms();
        case "director": return isDirector();
        case "ceo": return isCEO();
        case "patron": return isPatron();
        default: return false;
      }
    });
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (isDevelopment && devRole) return;
    
    if (!checkRole()) {
      toast({
        title: "Access Restricted",
        description: "You don't have access to this page.",
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [userProfile, isAuthenticated]);
  
  return element;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/staff-verification" element={<StaffVerification />} />
            
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="/requests" element={<MainLayout><RequestsPage /></MainLayout>} />
            <Route path="/requests/:id" element={<MainLayout><RequestDetail /></MainLayout>} />
            
            <Route path="/submit" element={
              <MainLayout>
                <RoleRoute
                  element={<RequestSubmissionPage />}
                  allowedRoles={["user"]}
                />
              </MainLayout>
            } />
            
            <Route path="/enquiry" element={
              <MainLayout>
                <RoleRoute
                  element={<EnquiryPage />}
                  allowedRoles={["user"]}
                />
              </MainLayout>
            } />
            
            <Route path="/chat" element={
              <MainLayout>
                <Navigate to="/submit" replace />
              </MainLayout>
            } />
            
            <Route path="/field-work" element={
              <MainLayout>
                <RoleRoute
                  element={<FieldWork />}
                  allowedRoles={["field_officer", "project_officer", "assistant_project_officer"]}
                />
              </MainLayout>
            } />
            
            <Route path="/reports" element={
              <MainLayout>
                <RoleRoute
                  element={<Reports />}
                  allowedRoles={[
                    "field_officer", 
                    "project_officer", 
                    "assistant_project_officer", 
                    "head_of_programs", 
                    "director", 
                    "ceo", 
                    "patron",
                    "admin"
                  ]}
                />
              </MainLayout>
            } />
            
            <Route path="/reports/:id" element={
              <MainLayout>
                <RoleRoute
                  element={<ReportDetail />}
                  allowedRoles={[
                    "field_officer", 
                    "project_officer", 
                    "assistant_project_officer", 
                    "head_of_programs", 
                    "director", 
                    "ceo", 
                    "patron",
                    "admin"
                  ]}
                />
              </MainLayout>
            } />
            
            <Route path="/analytics" element={
              <MainLayout>
                <RoleRoute
                  element={<Analytics />}
                  allowedRoles={[
                    "head_of_programs", 
                    "director", 
                    "ceo", 
                    "patron",
                    "admin"
                  ]}
                />
              </MainLayout>
            } />
            
            <Route path="/approvals" element={
              <MainLayout>
                <RoleRoute
                  element={<ApprovalsPage />}
                  allowedRoles={["director", "ceo", "patron"]}
                />
              </MainLayout>
            } />
            
            <Route path="/admin/users" element={
              <MainLayout>
                <RoleRoute
                  element={<UserManagement />}
                  allowedRoles={["admin", "director", "ceo"]}
                />
              </MainLayout>
            } />
            
            <Route path="/admin/roles" element={
              <MainLayout>
                <RoleRoute
                  element={<RolesManagement />}
                  allowedRoles={["admin"]}
                />
              </MainLayout>
            } />
            
            <Route path="/admin/system" element={
              <MainLayout>
                <RoleRoute
                  element={<SystemSettings />}
                  allowedRoles={["admin"]}
                />
              </MainLayout>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
