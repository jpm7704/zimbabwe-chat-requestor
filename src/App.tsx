
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
