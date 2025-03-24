
import { UserProfile } from "./useAuth";

export function useRoles(userProfile: UserProfile | null) {
  const isAdmin = () => userProfile?.role === 'management';
  const isProgrammeManager = () => userProfile?.role === 'programme_manager';
  const isFieldOfficer = () => userProfile?.role === 'field_officer';
  const isRegularUser = () => userProfile?.role === 'user';
  
  const hasRole = (role: string) => userProfile?.role === role;
  
  // Get role display information
  const getRoleInfo = () => {
    if (!userProfile || !userProfile.role) {
      return {
        title: 'Guest',
        description: 'Not logged in',
        color: 'gray',
        iconClass: 'bg-gray-100',
        textClass: 'text-gray-600',
        badgeClass: 'bg-gray-500',
        responsibilities: []
      };
    }
    
    switch(userProfile.role) {
      case 'management':
        return {
          title: 'Senior Management',
          description: 'Final Approver',
          color: 'green',
          iconClass: 'bg-green-100',
          textClass: 'text-green-600',
          badgeClass: 'bg-green-500',
          responsibilities: [
            'Review thoroughly verified requests from Programme Managers',
            'Evaluate requests against organizational budget and priorities',
            'Make final approval or rejection decisions',
            'Authorize resource allocation for approved requests',
            'Monitor program effectiveness and impact',
            'Oversee organizational compliance and governance'
          ]
        };
      case 'programme_manager':
        return {
          title: 'Programme Manager',
          description: 'Request Coordinator',
          color: 'blue',
          iconClass: 'bg-blue-100',
          textClass: 'text-blue-600',
          badgeClass: 'bg-blue-500',
          responsibilities: [
            'Review all incoming assistance requests',
            'Assign requests to appropriate Field Officers based on location and expertise',
            'Review verification reports and assessment data',
            'Request additional information or clarification when needed',
            'Forward verified requests to Management for final approval',
            'Monitor overall verification process efficiency'
          ]
        };
      case 'field_officer':
        return {
          title: 'Field Officer',
          description: 'Verification Specialist',
          color: 'yellow',
          iconClass: 'bg-yellow-100',
          textClass: 'text-yellow-600',
          badgeClass: 'bg-yellow-500',
          responsibilities: [
            'Review and assess assistance requests assigned to you',
            'Conduct field visits to verify beneficiary information',
            'Collect and validate supporting documentation',
            'Prepare detailed verification reports for Programme Manager review',
            'Complete assessments within assigned timeframes'
          ]
        };
      case 'user':
      default:
        return {
          title: 'Beneficiary',
          description: 'Support Requestor',
          color: 'primary',
          iconClass: 'bg-primary/10',
          textClass: 'text-primary',
          badgeClass: 'bg-primary/80',
          responsibilities: [
            'Submit assistance requests with required documentation',
            'Provide accurate information for assessment',
            'Respond to queries from Field Officers during verification',
            'Track request status throughout the process',
            'Provide feedback on assistance received',
            'Update personal information as needed'
          ]
        };
    }
  };
  
  return {
    isAdmin,
    isProgrammeManager,
    isFieldOfficer,
    isRegularUser,
    hasRole,
    getRoleInfo
  };
}
