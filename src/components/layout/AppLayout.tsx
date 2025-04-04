
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
