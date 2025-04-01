
import { RequestStatus } from '@/types';

type UserRole = 'user' | 'field_officer' | 'programme_manager' | 'management' | 'director' | string;

interface StatusOption {
  value: string;
  label: string;
}

/**
 * Gets the next possible status options based on the current status and user role
 */
export function getNextStatusOptions(
  currentStatus: RequestStatus, 
  userRole?: UserRole
): StatusOption[] {
  // Define possible next statuses for each current status
  const nextStatusMapping: Record<string, string[]> = {
    submitted: ['assigned', 'rejected'],
    assigned: ['under_review', 'rejected'],
    under_review: ['manager_review', 'rejected'],
    manager_review: ['forwarded', 'completed', 'rejected'],
    forwarded: ['completed', 'rejected'],
    completed: [],
    rejected: [],
  };
  
  // Define which roles can transition to which statuses
  const rolePermissions: Record<string, Record<string, boolean>> = {
    user: {
      // Users cannot change statuses
    },
    field_officer: {
      assigned: true,
      under_review: true,
      rejected: true
    },
    programme_manager: {
      assigned: true,
      under_review: true,
      manager_review: true,
      forwarded: true,
      rejected: true
    },
    management: {
      assigned: true,
      under_review: true,
      manager_review: true,
      forwarded: true,
      completed: true,
      rejected: true
    },
    director: {
      assigned: true,
      under_review: true,
      manager_review: true,
      forwarded: true,
      completed: true,
      rejected: true
    }
  };
  
  // Get possible next statuses based on current status
  const possibleNextStatuses = nextStatusMapping[currentStatus] || [];
  
  // Filter based on role permissions
  const filteredStatuses = userRole 
    ? possibleNextStatuses.filter(status => rolePermissions[userRole]?.[status])
    : [];

  // Map to the format needed for the dropdown
  return filteredStatuses.map(status => ({
    value: status,
    label: formatStatusLabel(status),
  }));
}

/**
 * Format a status string into a user-friendly label
 */
export function formatStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    under_review: 'Under Review',
    manager_review: 'Manager Review',
    forwarded: 'Forwarded',
    completed: 'Completed',
    rejected: 'Rejected',
  };
  
  return statusLabels[status] || status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
