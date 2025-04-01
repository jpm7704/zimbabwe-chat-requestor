
import { RequestStatus, UserRole } from "@/types";

/**
 * Get available next status options based on current status and user role
 */
export const getNextStatusOptions = (currentStatus: RequestStatus, userRole?: UserRole): { value: RequestStatus; label: string }[] => {
  // Default no options
  const noOptions: { value: RequestStatus; label: string }[] = [];
  
  if (!userRole) return noOptions;
  
  // Map of status transitions allowed per role
  const statusTransitions: Record<UserRole, Record<RequestStatus, RequestStatus[]>> = {
    user: {
      // Regular users can't change status
      submitted: [],
      pending: [],
      in_review: [],
      additional_info: [],
      approved: [],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    field_officer: {
      submitted: ['in_review'],
      pending: ['in_review'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['in_review', 'approved', 'rejected'],
      approved: ['completed'],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    project_officer: {
      submitted: ['pending', 'in_review'],
      pending: ['in_review', 'additional_info'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['pending', 'in_review'],
      approved: ['completed'],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    assistant_project_officer: {
      submitted: ['pending', 'in_review'],
      pending: ['in_review', 'additional_info'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['pending', 'in_review'],
      approved: ['completed'],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    regional_project_officer: {
      submitted: ['pending', 'in_review'],
      pending: ['in_review', 'additional_info'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['pending', 'in_review'],
      approved: ['completed'],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    programme_manager: {
      submitted: ['pending', 'in_review', 'approved', 'rejected'],
      pending: ['in_review', 'approved', 'rejected'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['pending', 'in_review', 'approved', 'rejected'],
      approved: ['completed'],
      rejected: ['pending'],
      completed: [],
      cancelled: [],
    },
    head_of_programs: {
      submitted: ['pending', 'in_review', 'approved', 'rejected'],
      pending: ['in_review', 'approved', 'rejected'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected'],
      additional_info: ['pending', 'in_review', 'approved', 'rejected'],
      approved: ['completed'],
      rejected: ['pending'],
      completed: [],
      cancelled: [],
    },
    finance_manager: {
      submitted: [],
      pending: [],
      in_review: [],
      additional_info: [],
      approved: [],
      rejected: [],
      completed: [],
      cancelled: [],
    },
    director: {
      // Directors can do everything
      submitted: ['pending', 'in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      pending: ['in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected', 'cancelled'],
      additional_info: ['pending', 'in_review', 'approved', 'rejected', 'cancelled'],
      approved: ['completed', 'cancelled'],
      rejected: ['pending', 'cancelled'],
      completed: ['cancelled'],
      cancelled: ['pending'],
    },
    patron: {
      // Patrons can do everything
      submitted: ['pending', 'in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      pending: ['in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected', 'cancelled'],
      additional_info: ['pending', 'in_review', 'approved', 'rejected', 'cancelled'],
      approved: ['completed', 'cancelled'],
      rejected: ['pending', 'cancelled'],
      completed: ['cancelled'],
      cancelled: ['pending'],
    },
    ceo: {
      // CEO can do everything
      submitted: ['pending', 'in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      pending: ['in_review', 'additional_info', 'approved', 'rejected', 'cancelled'],
      in_review: ['pending', 'additional_info', 'approved', 'rejected', 'cancelled'],
      additional_info: ['pending', 'in_review', 'approved', 'rejected', 'cancelled'],
      approved: ['completed', 'cancelled'],
      rejected: ['pending', 'cancelled'],
      completed: ['cancelled'],
      cancelled: ['pending'],
    },
  };
  
  // Status display labels
  const statusLabels: Record<RequestStatus, string> = {
    submitted: 'Submitted',
    pending: 'Pending',
    in_review: 'In Review',
    additional_info: 'Additional Information Needed',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  
  // Get allowed transitions for this role and current status
  const allowedStatuses = statusTransitions[userRole]?.[currentStatus] || [];
  
  // Map to options format
  return allowedStatuses.map(status => ({
    value: status,
    label: statusLabels[status]
  }));
};
