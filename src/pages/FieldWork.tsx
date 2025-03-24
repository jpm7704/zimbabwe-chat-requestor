
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Search } from "lucide-react";

const FieldWork = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();

  // Redirect if user doesn't have permission to view this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!permissions.canReviewRequests) {
      navigate('/');
    }
  }, [isAuthenticated, permissions, navigate]);

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Field Work Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assigned requests and field activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Assigned Requests</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">You currently have 5 assigned requests waiting for action.</p>
              <Button className="w-full">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Assigned Requests
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Field Assessments</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">You have 3 scheduled field assessments in the next 7 days.</p>
              <Button className="w-full" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                View Assessment Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0023 - Medical Assistance</div>
              <div className="text-sm text-muted-foreground">Field assessment completed on March 22, 2025</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0045 - Educational Support</div>
              <div className="text-sm text-muted-foreground">Report submitted on March 21, 2025</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0018 - Food Assistance</div>
              <div className="text-sm text-muted-foreground">Verification completed on March 20, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldWork;
