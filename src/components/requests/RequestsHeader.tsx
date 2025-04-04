import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

const RequestsHeader = () => {
  const { userProfile, formatRole } = useAuth();
  const { isFieldOfficer, isProjectOfficer, isAssistantProjectOfficer } = useRoles(userProfile);
  
  const getRoleSpecificHeader = () => {
    if (!userProfile) return { title: "My Requests", description: "Track and manage your BGF Zimbabwe support requests" };
    
    switch(userProfile.role) {
      case 'field_officer':
        return { 
          title: "Field Officer Dashboard", 
          description: "Verify requests and conduct assessments for BGF Zimbabwe support applications" 
        };
      case 'programme_manager':
      case 'head_of_programs':
      case 'hop':
        return { 
          title: "Programme Manager Dashboard", 
          description: "Review field verifications and manage request processing" 
        };
      case 'management':
        return { 
          title: "Management Dashboard", 
          description: "Review and approve requests for final decision" 
        };
      default:
        return { 
          title: "My Requests", 
          description: "Track and manage your BGF Zimbabwe support requests" 
        };
    }
  };
  
  const { title, description } = getRoleSpecificHeader();
  
  const hasManagementRole = () => {
    if (!userProfile || !userProfile.role) return false;
    
    const managementRoles = [
      'head_of_department', 
      'head_of_programs', 
      'hop', 
      'programme_manager'
    ];
    
    return managementRoles.includes(userProfile.role.toLowerCase());
  };
  
  const isFieldStaff = () => {
    return isFieldOfficer() || isProjectOfficer() || isAssistantProjectOfficer();
  };
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {userProfile ? (
            <>
              <span className="font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </span> • <span>{formatRole(userProfile.role || '')}</span> • <span>{description}</span>
            </>
          ) : (
            description
          )}
        </p>
      </div>
      
      {isFieldStaff() && (
        <Button asChild variant="outline">
          <Link to="/field-work" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            {isFieldOfficer() ? 'My Assignments' : 'View Assignments'}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default RequestsHeader;
