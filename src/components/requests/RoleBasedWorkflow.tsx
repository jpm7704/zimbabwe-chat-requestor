
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
  UserCheck,
  Shield,
  User,
  FileText
} from "lucide-react";
import { UserProfile } from "@/hooks/useAuth";
import { Permissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-full">
              <User className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500 text-white">Field Officer</Badge>
                <span className="text-sm text-muted-foreground">Verification Specialist</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-3">
          As a Field Officer, you are responsible for conducting due diligence and verification of assistance requests 
          assigned to you by the Programme Manager.
        </p>
        
        <div className="bg-white/60 p-3 rounded-md border border-yellow-100 mb-3">
          <h3 className="font-medium text-sm mb-2 text-yellow-800 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Your Key Responsibilities:
          </h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Review and assess assistance requests assigned to you</li>
            <li>Conduct field visits to verify beneficiary information</li>
            <li>Collect and validate supporting documentation</li>
            <li>Prepare detailed verification reports for Programme Manager review</li>
            <li>Complete assessments within assigned timeframes</li>
          </ol>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3">
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
          <Button variant="default" size="sm" asChild>
            <Link to="/reports" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 mr-1" />
              Submit Verification Reports
            </Link>
          </Button>
        </div>
      </div>
    );
  } 
  
  // Programme Manager View
  else if (userProfile.role === 'programme_manager') {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 text-white">Programme Manager</Badge>
                <span className="text-sm text-muted-foreground">Request Coordinator</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-3">
          As a Programme Manager, you oversee the request workflow process, assigning field officers to 
          requests and reviewing their verification reports before forwarding to Management.
        </p>
        
        <div className="bg-white/60 p-3 rounded-md border border-blue-100 mb-3">
          <h3 className="font-medium text-sm mb-2 text-blue-800 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Your Key Responsibilities:
          </h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Review all incoming assistance requests</li>
            <li>Assign requests to appropriate Field Officers based on location and expertise</li>
            <li>Review verification reports and assessment data</li>
            <li>Request additional information or clarification when needed</li>
            <li>Forward verified requests to Management for final approval</li>
            <li>Monitor overall verification process efficiency</li>
          </ol>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3">
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
          <Button variant="default" size="sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Forward to Management ({statusCounts.underReview})
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/staff" className="flex items-center gap-2">
              <Users className="h-4 w-4 mr-1" />
              Manage Field Officers
            </Link>
          </Button>
        </div>
      </div>
    );
  } 
  
  // Management View
  else if (userProfile.role === 'management') {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white">Senior Management</Badge>
                <span className="text-sm text-muted-foreground">Final Approver</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-3">
          As a Senior Management member, you have the authority to make final decisions on 
          verified and reviewed assistance requests, ensuring resource allocation aligns with organizational priorities.
        </p>
        
        <div className="bg-white/60 p-3 rounded-md border border-green-100 mb-3">
          <h3 className="font-medium text-sm mb-2 text-green-800 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Your Key Responsibilities:
          </h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Review thoroughly verified requests from Programme Managers</li>
            <li>Evaluate requests against organizational budget and priorities</li>
            <li>Make final approval or rejection decisions</li>
            <li>Authorize resource allocation for approved requests</li>
            <li>Monitor program effectiveness and impact</li>
            <li>Oversee organizational compliance and governance</li>
          </ol>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Administration
            </Link>
          </Button>
          <Button variant="default" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Awaiting Approval ({statusCounts.awaitingApproval})
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="mr-2 h-4 w-4" />
            Approved Requests ({statusCounts.completed})
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4 mr-1" />
              View Reports & Analytics
            </Link>
          </Button>
        </div>
      </div>
    );
  } 
  
  // Regular User View - make sure this is only shown to regular users
  else if (userProfile.role === 'user') {
    return (
      <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/20">Beneficiary</Badge>
                <span className="text-sm text-muted-foreground">Support Requestor</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-3">
          As a beneficiary, you can submit assistance requests which will be processed through our verification 
          and approval workflow to ensure timely and appropriate support.
        </p>
        
        <div className="bg-white/60 p-3 rounded-md border border-primary/10 mb-3">
          <h3 className="font-medium text-sm mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Request Process Flow:
          </h3>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground">
            <li>Submit your assistance request with required documentation</li>
            <li>Request is assigned to a Field Officer for verification</li>
            <li>Field Officer conducts assessment and verification</li>
            <li>Programme Manager reviews the verification report</li>
            <li>Senior Management makes final approval decision</li>
            <li>You receive notification of request status and next steps</li>
          </ol>
        </div>
        
        <div className="flex gap-3 mt-3">
          <Button size="sm" asChild>
            <Link to="/submit?action=new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/requests" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              My Requests
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
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <User className="mr-2 h-5 w-5 text-gray-600" />
          {userProfile.first_name} {userProfile.last_name}
        </h2>
        <p className="text-muted-foreground">
          Please contact support to set up your account role correctly.
        </p>
      </div>
    );
  }
};

export default RoleBasedWorkflow;
