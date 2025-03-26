
import { UserProfile } from "./useAuth";

export function useRoles(userProfile: UserProfile | null) {
  const isAdmin = () => userProfile?.role === 'director';
  const isHeadOfPrograms = () => userProfile?.role === 'head_of_programs';
  const isAssistantProjectOfficer = () => userProfile?.role === 'assistant_project_officer';
  const isRegionalProjectOfficer = () => userProfile?.role === 'regional_project_officer';
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
      case 'director':
        return {
          title: 'Director',
          description: 'Final Approver',
          color: 'green',
          iconClass: 'bg-green-100',
          textClass: 'text-green-600',
          badgeClass: 'bg-green-500',
          responsibilities: [
            'Review thoroughly verified requests from Head of Programs',
            'Evaluate requests against organizational budget and priorities',
            'Make final approval or rejection decisions',
            'Authorize resource allocation for approved requests',
            'Monitor program effectiveness and impact',
            'Oversee organizational compliance and governance'
          ]
        };
      case 'head_of_programs':
        return {
          title: 'Head of Programs',
          description: 'Program Coordinator',
          color: 'blue',
          iconClass: 'bg-blue-100',
          textClass: 'text-blue-600',
          badgeClass: 'bg-blue-500',
          responsibilities: [
            'Review assistance requests from Assistant Project Officers',
            'Coordinate program implementation across regions',
            'Review verification reports and assessment data',
            'Forward verified requests to Directors for final approval',
            'Implement approved programs and allocate resources',
            'Monitor overall program efficiency and effectiveness'
          ]
        };
      case 'assistant_project_officer':
        return {
          title: 'Assistant Project Officer',
          description: 'Project Facilitator',
          color: 'indigo',
          iconClass: 'bg-indigo-100',
          textClass: 'text-indigo-600',
          badgeClass: 'bg-indigo-500',
          responsibilities: [
            'Receive requests from Regional Project Officers',
            'Review and assess request documentation',
            'Coordinate with field staff for implementation',
            'Prepare detailed reports for Head of Programs',
            'Monitor project milestones and deliverables',
            'Ensure compliance with organizational standards'
          ]
        };
      case 'regional_project_officer':
        return {
          title: 'Regional Project Officer',
          description: 'Regional Coordinator',
          color: 'purple',
          iconClass: 'bg-purple-100',
          textClass: 'text-purple-600',
          badgeClass: 'bg-purple-500',
          responsibilities: [
            'Oversee projects in assigned region',
            'Coordinate with field officers for verification',
            'Review and compile field assessment data',
            'Submit verified requests to Assistant Project Officers',
            'Monitor regional project implementation',
            'Build relationships with local communities and stakeholders'
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
            'Prepare detailed verification reports for Regional Officers',
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
    isHeadOfPrograms,
    isAssistantProjectOfficer,
    isRegionalProjectOfficer,
    isFieldOfficer,
    isRegularUser,
    hasRole,
    getRoleInfo
  };
}
