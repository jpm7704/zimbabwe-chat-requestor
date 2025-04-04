
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import Loader from "@/components/ui/loader";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Lazy-loaded pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Requests = lazy(() => import("@/pages/Requests"));
const RequestDetail = lazy(() => import("@/pages/RequestDetail"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const FieldWork = lazy(() => import("@/pages/FieldWork"));
const Reports = lazy(() => import("@/pages/Reports"));
const Approvals = lazy(() => import("@/pages/ApprovalsPage"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const EnquiryPage = lazy(() => import("@/pages/EnquiryPage"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppLayout />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Common routes accessible to all users */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
            
            {/* Routes for all staff levels */}
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            
            {/* Field Officer routes */}
            <Route 
              path="field-work" 
              element={
                <ProtectedRoute requiredRole={['field_officer', 'project_officer', 'assistant_project_officer', 'admin', 'director', 'ceo', 'patron', 'head_of_programs', 'programme_manager']}>
                  <FieldWork />
                </ProtectedRoute>
              } 
            />
            
            {/* Project Officer, Assistant Project Officer, Head of Programs routes */}
            <Route 
              path="reports" 
              element={
                <ProtectedRoute requiredRole={['field_officer', 'project_officer', 'assistant_project_officer', 'head_of_programs', 'director', 'ceo', 'patron', 'admin']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            {/* Head of Programs, Director, CEO, Patron routes */}
            <Route 
              path="analytics" 
              element={
                <ProtectedRoute requiredRole={['head_of_programs', 'programme_manager', 'director', 'ceo', 'patron', 'admin']}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            
            {/* Director, CEO, Patron routes */}
            <Route 
              path="approvals" 
              element={
                <ProtectedRoute requiredRole={['director', 'ceo', 'patron', 'admin']}>
                  <Approvals />
                </ProtectedRoute>
              } 
            />
            
            {/* Regular user routes */}
            <Route 
              path="enquiry" 
              element={
                <ProtectedRoute requiredRole={['user']}>
                  <EnquiryPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/users" 
              element={
                <ProtectedRoute requiredRole={['admin', 'director', 'ceo']}>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/roles" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <NotFound />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/system" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <NotFound />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
