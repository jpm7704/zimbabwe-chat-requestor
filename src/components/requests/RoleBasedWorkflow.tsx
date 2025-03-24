
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  ListFilter,
  Clock,
  Plus,
  FileCheck,
  Users,
  CheckSquare,
  ArrowRight,
  UserCheck
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
  
  // Field Officer View - explicitly check for role
  if (userProfile.role === 'field_officer') {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-yellow-600" />
          {userProfile.first_name} {userProfile.last_name} | Field Officer
        </h2>
        <p className="text-muted-foreground mb-2">
          Your role is to verify information and conduct necessary due diligence on requests assigned to you.
        </p>
        <div className="bg-white/60 p-3 rounded-md border border-yellow-100 mb-3">
          <h3 className="font-medium text-sm mb-1 text-yellow-800">Your Main Functions:</h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Review assigned requests from Programme Manager</li>
            <li>Conduct field verification and assessment</li>
            <li>Gather necessary supporting documentation</li>
            <li>Submit verification reports for review</li>
          </ol>
        </div>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/field-work" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              My Assigned Requests
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
          <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
          {userProfile.first_name} {userProfile.last_name} | Programme Manager
        </h2>
        <p className="text-muted-foreground mb-2">
          Your role is to manage request workflows and review verification reports before forwarding to Management.
        </p>
        <div className="bg-white/60 p-3 rounded-md border border-blue-100 mb-3">
          <h3 className="font-medium text-sm mb-1 text-blue-800">Your Main Functions:</h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Assign requests to appropriate Field Officers</li>
            <li>Review verification reports from Field Officers</li>
            <li>Request additional information if needed</li>
            <li>Forward verified requests to Management for approval</li>
          </ol>
        </div>
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
          <Button variant="outline" size="sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Forward to Management ({statusCounts.underReview})
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
          {userProfile.first_name} {userProfile.last_name} | Senior Management
        </h2>
        <p className="text-muted-foreground mb-2">
          Your role is to make final decisions on requests that have been verified and reviewed.
        </p>
        <div className="bg-white/60 p-3 rounded-md border border-green-100 mb-3">
          <h3 className="font-medium text-sm mb-1 text-green-800">Your Main Functions:</h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Review all documentation and Programme Manager recommendations</li>
            <li>Make final approval decisions on verified requests</li>
            <li>Authorize resource allocation for approved requests</li>
            <li>Oversee overall program effectiveness</li>
          </ol>
        </div>
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
          <Button variant="outline" size="sm">
            <CheckSquare className="mr-2 h-4 w-4" />
            Approved Requests ({statusCounts.completed})
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
          {userProfile.first_name} {userProfile.last_name} | Beneficiary
        </h2>
        <p className="text-muted-foreground mb-2">
          As a beneficiary, your request will go through the following process:
        </p>
        <div className="bg-white/60 p-3 rounded-md border border-primary/10 mb-3">
          <h3 className="font-medium text-sm mb-1">Request Process Flow:</h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Submit your request with all required information</li>
            <li>Field Officer verification and due diligence</li>
            <li>Programme Manager review</li>
            <li>Management approval and action</li>
          </ol>
        </div>
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
