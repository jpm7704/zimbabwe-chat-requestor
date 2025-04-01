
import { RequestStatus } from '@/types';

interface StatusOption {
  value: string;
  label: string;
}

/**
 * Returns the list of possible next statuses based on current status and user role
 */
export const getNextStatusOptions = (currentStatus: RequestStatus, userRole?: string): StatusOption[] => {
  const options: StatusOption[] = [];
  
  // Default options for all roles
  switch (currentStatus) {
    case 'submitted':
      if (userRole === 'field_officer' || userRole === 'programme_manager' || userRole === 'management') {
        options.push({ value: 'assigned', label: 'Assign' });
        options.push({ value: 'rejected', label: 'Reject' });
      }
      break;
      
    case 'assigned':
      if (userRole === 'field_officer') {
        options.push({ value: 'under_review', label: 'Under Review' });
        options.push({ value: 'rejected', label: 'Reject' });
      }
      break;
      
    case 'under_review':
      if (userRole === 'field_officer') {
        options.push({ value: 'manager_review', label: 'Send to Manager' });
        options.push({ value: 'rejected', label: 'Reject' });
      }
      break;
      
    case 'manager_review':
      if (userRole === 'programme_manager' || userRole === 'management') {
        options.push({ value: 'forwarded', label: 'Forward' });
        options.push({ value: 'completed', label: 'Complete' });
        options.push({ value: 'under_review', label: 'Back to Review' });
        options.push({ value: 'rejected', label: 'Reject' });
      }
      break;
      
    case 'forwarded':
      if (userRole === 'management') {
        options.push({ value: 'completed', label: 'Complete' });
        options.push({ value: 'manager_review', label: 'Back to Manager' });
      }
      break;
      
    default:
      if (userRole === 'management') {
        // Management can reopen completed or rejected requests
        if (currentStatus === 'completed' || currentStatus === 'rejected') {
          options.push({ value: 'assigned', label: 'Reopen' });
        }
      }
  }
  
  return options;
};
