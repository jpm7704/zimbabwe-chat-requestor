import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

const ApprovalsPage = () => {
  const { userProfile } = useAuth();
  const { isAdmin, isCEO } = useRoles(userProfile);
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-2">Approval Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Review and approve assistance requests
      </p>

      {/* Role-specific content */}
      {isAdmin() && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-semibold mb-2">Director Review Queue</h2>
          <p>As a Director or Management member, you have final approval authority.</p>
        </div>
      )}

      {isCEO() && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-semibold mb-2">CEO Priority Queue</h2>
          <p>As CEO, you can view and override all approval decisions.</p>
        </div>
      )}

      <div className="text-center text-muted-foreground mt-8">
        <p>No requests currently awaiting your approval.</p>
      </div>
    </div>
  );
};

export default ApprovalsPage;
