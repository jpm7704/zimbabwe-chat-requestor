
import { UserProfile } from "./useAuth";

export function useRoles(userProfile: UserProfile | null) {
  // Basic role check function that safely compares role values
  const checkRole = (role: string | undefined) => {
    // If profile doesn't exist, return false
    if (!userProfile || !userProfile.role) return false;
    // Case-insensitive comparison for more robust matching
    return userProfile.role.toLowerCase() === role.toLowerCase();
  };
  
  // Role check functions using the core checkRole method
  const isAdmin = () => checkRole('director');
  const isHeadOfPrograms = () => checkRole('head_of_programs');
  const isAssistantProjectOfficer = () => checkRole('assistant_project_officer');
  const isProjectOfficer = () => checkRole('project_officer');
  const isFieldOfficer = () => checkRole('field_officer');
  const isRegularUser = () => checkRole('user');
  const isCEO = () => checkRole('ceo');
  const isPatron = () => checkRole('patron');
  
  // Generic role check
  const hasRole = (role: string) => checkRole(role);
  
  // Debug function to help identify role issues
  const getCurrentRole = () => userProfile?.role || 'unknown';
  
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
    
    // Convert role to lowercase for case-insensitive matching
    const role = userProfile.role.toLowerCase();
    
    switch(role) {
      case 'director':
        return {
          title: 'Director',
          description: 'Review & Approval Authority',
          color: 'green',
          iconClass: 'bg-green-100',
          textClass: 'text-green-600',
          badgeClass: 'bg-green-500',
          responsibilities: [
            'Review thoroughly verified requests from Head of Programs',
            'Evaluate requests against organizational budget and priorities',
            'Approve or reject requests as part of the leadership team',
            'Authorize resource allocation for approved requests',
            'Monitor program effectiveness and impact',
            'Oversee organizational compliance and governance'
          ]
        };
      case 'ceo':
        return {
          title: 'CEO',
          description: 'Executive Approval Authority',
          color: 'purple',
          iconClass: 'bg-purple-100',
          textClass: 'text-purple-600',
          badgeClass: 'bg-purple-500',
          responsibilities: [
            'Review requests forwarded by Head of Programs',
            'Provide executive-level approval for organizational resources',
            'Ensure alignment with organizational mission and strategy',
            'Oversee financial implications of approved requests',
            'Communicate decisions to stakeholders',
            'Monitor overall program impact and effectiveness'
          ]
        };
      case 'patron':
        return {
          title: 'Patron',
          description: 'Final Endorsement Authority',
          color: 'red',
          iconClass: 'bg-red-100',
          textClass: 'text-red-600',
          badgeClass: 'bg-red-500',
          responsibilities: [
            'Review and endorse requests approved by Director and CEO',
            'Provide final authorization for significant resource allocations',
            'Ensure alignment with organizational vision',
            'Represent the organization to external stakeholders',
            'Oversee organizational governance at the highest level'
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
            'Forward verified requests to Director, CEO and Patron for approval',
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
            'Receive requests from Project Officers',
            'Review and assess request documentation',
            'Coordinate with field staff for implementation',
            'Prepare detailed reports for Head of Programs',
            'Monitor project milestones and deliverables',
            'Ensure compliance with organizational standards'
          ]
        };
      case 'project_officer':
        return {
          title: 'Project Officer',
          description: 'Project Coordinator',
          color: 'purple',
          iconClass: 'bg-purple-100',
          textClass: 'text-purple-600',
          badgeClass: 'bg-purple-500',
          responsibilities: [
            'Oversee projects across assigned areas',
            'Coordinate with field officers for verification',
            'Review and compile field assessment data',
            'Submit verified requests to Assistant Project Officers',
            'Monitor project implementation',
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
            'Prepare detailed verification reports for Project Officers',
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
    isProjectOfficer,
    isFieldOfficer,
    isRegularUser,
    isCEO,
    isPatron,
    hasRole,
    getRoleInfo,
    getCurrentRole  // Added for debugging purposes
  };
}
