
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/types';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  // Define styles for different statuses
  const styles: Record<RequestStatus, { className: string, label: string }> = {
    submitted: { 
      className: 'bg-blue-500 hover:bg-blue-600', 
      label: 'Submitted' 
    },
    pending: { 
      className: 'bg-amber-500 hover:bg-amber-600', 
      label: 'Pending' 
    },
    in_review: { 
      className: 'bg-purple-500 hover:bg-purple-600', 
      label: 'In Review' 
    },
    additional_info: { 
      className: 'bg-orange-500 hover:bg-orange-600', 
      label: 'Info Needed' 
    },
    approved: { 
      className: 'bg-green-500 hover:bg-green-600', 
      label: 'Approved' 
    },
    rejected: { 
      className: 'bg-red-500 hover:bg-red-600', 
      label: 'Rejected' 
    },
    completed: { 
      className: 'bg-teal-500 hover:bg-teal-600', 
      label: 'Completed' 
    },
    cancelled: { 
      className: 'bg-gray-500 hover:bg-gray-600', 
      label: 'Cancelled' 
    },
  };

  return (
    <Badge 
      className={styles[status].className}
      variant="secondary"
    >
      {styles[status].label}
    </Badge>
  );
};

export default RequestStatusBadge;
