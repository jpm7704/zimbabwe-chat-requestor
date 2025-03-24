
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  ListFilter,
  Clock,
  Plus,
  FileCheck,
  Users
} from "lucide-react";
import { UserProfile } from "@/hooks/useAuth";
import { Permissions } from "@/hooks/usePermissions";

interface RoleBasedWorkflowProps {
  userProfile: UserProfile | null;
  permissions: Permissions;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const RoleBasedWorkflow = ({ userProfile, permissions, statusCounts }: RoleBasedWorkflowProps) => {
  if (!userProfile) return null;
  
  // Instead of checking permissions only, we'll check the actual role
  // to ensure proper differentiation between user types
  
  // Field Officer View - explicitly check for role
  if (userProfile.role === 'field_officer') {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-yellow-600" />
          Field Officer Dashboard
        </h2>
        <p className="text-muted-foreground mb-3">
          Your role is to verify information and conduct necessary due diligence on requests assigned to you.
        </p>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
          <li>Review the request details thoroughly</li>
          <li>Contact the applicant to arrange for verification</li>
          <li>Complete field assessment and gather necessary evidence</li>
          <li>Submit your verification report for Programme Manager review</li>
        </ol>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/field-work" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              My Assigned Work
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Pending Verifications ({statusCounts.underReview})
          </Button>
        </div>
      </div>
    );
  } 
  
  // Programme Manager View
  else if (userProfile.role === 'programme_manager') {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-blue-600" />
          Programme Manager Workflow
        </h2>
        <p className="text-muted-foreground mb-3">
          Your role is to review verification findings and ensure all due diligence is complete before forwarding to Management.
        </p>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
          <li>Review field officer verification reports</li>
          <li>Check that all required information is collected</li>
          <li>Request additional information if necessary</li>
          <li>Forward verified requests to Management for final approval</li>
        </ol>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analytics" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Program Overview
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Pending Reviews ({statusCounts.underReview})
          </Button>
        </div>
      </div>
    );
  } 
  
  // Management View
  else if (userProfile.role === 'management') {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Users className="mr-2 h-5 w-5 text-green-600" />
          Management Workflow
        </h2>
        <p className="text-muted-foreground mb-3">
          Your role is to make final decisions on requests that have been verified and reviewed.
        </p>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
          <li>Review all documentation and recommendations</li>
          <li>Make final determinations on resource allocation</li>
          <li>Approve or reject requests based on program criteria</li>
          <li>Authorize disbursement of approved assistance</li>
        </ol>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Administration
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Awaiting Approval ({statusCounts.awaitingApproval})
          </Button>
        </div>
      </div>
    );
  } 
  
  // Regular User View - make sure this is only shown to regular users
  else if (userProfile.role === 'user') {
    return (
      <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
          Beneficiary Request Process
        </h2>
        <p className="text-muted-foreground mb-3">
          As a beneficiary, your request will go through the following process:
        </p>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
          <li>Submit your request with all required information</li>
          <li>Field Officer verification and due diligence</li>
          <li>Programme Manager review</li>
          <li>Management approval and action</li>
        </ol>
        <div className="flex gap-3 mt-2">
          <Button size="sm" asChild>
            <Link to="/submit?action=new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Fallback for any undefined role
  else {
    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h2 className="text-lg font-medium mb-2">Welcome to BGF Zimbabwe</h2>
        <p className="text-muted-foreground">
          Please contact support to set up your account role correctly.
        </p>
      </div>
    );
  }
};

export default RoleBasedWorkflow;
