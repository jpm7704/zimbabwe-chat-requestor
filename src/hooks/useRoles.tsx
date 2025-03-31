
import { useState, useEffect } from "react";
import { UserProfile } from "@/hooks/useAuth";

type RoleInfo = {
  title: string;
  description: string;
  badgeClass: string;
  permissions: string[];
  responsibilities: string[];
};

export const useRoles = (userProfile: UserProfile | null) => {
  const [roleData, setRoleData] = useState<Record<string, RoleInfo>>({});

  useEffect(() => {
    // Initialize role data
    setRoleData({
      user: {
        title: "Regular User",
        description: "Beneficiary requesting assistance",
        badgeClass: "bg-blue-500 hover:bg-blue-700",
        permissions: ["create_requests", "view_own_requests"],
        responsibilities: [
          "Submit assistance requests through the system",
          "Provide required documentation to support your request",
          "Cooperate with field officers during the verification process",
          "Respond to any queries about your application in a timely manner",
          "Update your request with new information if circumstances change"
        ]
      },
      field_officer: {
        title: "Field Officer",
        description: "Conducts field verification and assessments",
        badgeClass: "bg-yellow-500 hover:bg-yellow-700",
        permissions: ["view_assigned_requests", "update_request_status", "add_verification_notes"],
        responsibilities: [
          "Conduct field visits to verify request information",
          "Document verification findings with photos and notes",
          "Interview beneficiaries and community members",
          "Complete verification reports for each assigned request",
          "Provide recommendations based on field assessments"
        ]
      },
      programme_manager: {
        title: "Programme Manager",
        description: "Oversees request verification process",
        badgeClass: "bg-purple-500 hover:bg-purple-700",
        permissions: ["assign_requests", "view_all_requests", "approve_requests"],
        responsibilities: [
          "Assign field officers to verify requests",
          "Review verification reports from field officers",
          "Prioritize requests based on urgency and available resources",
          "Forward verified requests to management for final approval",
          "Monitor the overall request process and workflow"
        ]
      },
      director: {
        title: "Director",
        description: "Makes final approval decisions",
        badgeClass: "bg-green-500 hover:bg-green-700",
        permissions: ["approve_requests", "reject_requests", "view_all_reports"],
        responsibilities: [
          "Review verified requests forwarded by the Programme Manager",
          "Make final decisions on request approvals",
          "Ensure resource allocation aligns with organizational priorities",
          "Provide guidance on complex or special cases",
          "Monitor overall program effectiveness and impact"
        ]
      },
      ceo: {
        title: "CEO",
        description: "Chief Executive Officer of the organization",
        badgeClass: "bg-purple-500 hover:bg-purple-700",
        permissions: ["approve_requests", "reject_requests", "view_all_data", "manage_staff"],
        responsibilities: [
          "Oversee all organizational operations and programs",
          "Review high-value or sensitive assistance requests",
          "Ensure programs align with organizational mission and strategy",
          "Report to the board of directors and external stakeholders",
          "Provide final authorization for special cases"
        ]
      },
      patron: {
        title: "Patron",
        description: "Highest level of organizational leadership",
        badgeClass: "bg-red-500 hover:bg-red-700",
        permissions: ["endorse_requests", "view_all_data", "special_authorization"],
        responsibilities: [
          "Provide final endorsement for major organizational initiatives",
          "Represent the organization at the highest levels",
          "Authorize exceptional cases that require special consideration",
          "Engage with major donors and key stakeholders",
          "Provide guidance on organizational vision and direction"
        ]
      }
    });
  }, []);

  const getRoleInfo = () => {
    if (!userProfile || !userProfile.role) {
      return roleData.user || {
        title: "Regular User",
        description: "Beneficiary requesting assistance",
        badgeClass: "bg-blue-500 hover:bg-blue-700",
        permissions: ["create_requests", "view_own_requests"],
        responsibilities: [
          "Submit assistance requests through the system",
          "Provide required documentation to support your request",
          "Cooperate with field officers during the verification process",
          "Respond to any queries about your application in a timely manner",
          "Update your request with new information if circumstances change"
        ]
      };
    }

    // Map the database role value to our frontend role key
    const roleKey = userProfile.role.toLowerCase();
    
    // Return the role info or a default if not found
    return roleData[roleKey] || roleData.user || {
      title: "User",
      description: "Standard user account",
      badgeClass: "bg-blue-500 hover:bg-blue-700",
      permissions: ["create_requests", "view_own_requests"],
      responsibilities: [
        "Submit assistance requests through the system",
        "Track the status of your submitted requests",
        "Provide additional information when requested"
      ]
    };
  };

  // Check if a user has a specific permission
  const hasPermission = (permission: string) => {
    const info = getRoleInfo();
    return info.permissions.includes(permission);
  };

  // Add role check methods
  const isAdmin = () => {
    return userProfile?.role?.toLowerCase() === 'admin' || 
           userProfile?.role?.toLowerCase() === 'director' ||
           userProfile?.role?.toLowerCase() === 'management';
  };

  const isRegularUser = () => {
    return !userProfile?.role || userProfile.role.toLowerCase() === 'user';
  };

  const isFieldOfficer = () => {
    return userProfile?.role?.toLowerCase() === 'field_officer';
  };

  const isProjectOfficer = () => {
    return userProfile?.role?.toLowerCase() === 'project_officer' || 
           userProfile?.role?.toLowerCase() === 'regional_project_officer';
  };

  const isAssistantProjectOfficer = () => {
    return userProfile?.role?.toLowerCase() === 'assistant_project_officer';
  };

  const isHeadOfPrograms = () => {
    return userProfile?.role?.toLowerCase() === 'head_of_programs' || 
           userProfile?.role?.toLowerCase() === 'programme_manager' || 
           userProfile?.role?.toLowerCase() === 'hop';
  };

  const isCEO = () => {
    return userProfile?.role?.toLowerCase() === 'ceo';
  };

  const isPatron = () => {
    return userProfile?.role?.toLowerCase() === 'patron';
  };

  return { 
    getRoleInfo,
    hasPermission,
    isAdmin,
    isRegularUser,
    isFieldOfficer,
    isProjectOfficer,
    isAssistantProjectOfficer,
    isHeadOfPrograms,
    isCEO,
    isPatron
  };
};
