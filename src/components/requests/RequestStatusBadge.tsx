
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/types';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  // Define styles for different statuses
  const styles: Record<string, { className: string, label: string }> = {
    submitted: { 
      className: 'bg-blue-500 hover:bg-blue-600', 
      label: 'Submitted' 
    },
    assigned: { 
      className: 'bg-amber-500 hover:bg-amber-600', 
      label: 'Assigned' 
    },
    under_review: { 
      className: 'bg-purple-500 hover:bg-purple-600', 
      label: 'In Review' 
    },
    manager_review: { 
      className: 'bg-orange-500 hover:bg-orange-600', 
      label: 'Manager Review' 
    },
    forwarded: { 
      className: 'bg-green-500 hover:bg-green-600', 
      label: 'Forwarded' 
    },
    rejected: { 
      className: 'bg-red-500 hover:bg-red-600', 
      label: 'Rejected' 
    },
    completed: { 
      className: 'bg-teal-500 hover:bg-teal-600', 
      label: 'Completed' 
    },
  };

  return (
    <Badge 
      className={styles[status]?.className || 'bg-gray-500 hover:bg-gray-600'}
      variant="secondary"
    >
      {styles[status]?.label || status.replace('_', ' ')}
    </Badge>
  );
};

export default RequestStatusBadge;
