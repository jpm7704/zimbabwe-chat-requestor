
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusHistory } from '@/services/api/request/statusApi';
import { TimelineEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertCircle, Clock, CalendarClock, UserCheck, Users, User } from 'lucide-react';

interface StatusHistoryProps {
  requestId: string;
}

export function StatusHistory({ requestId }: StatusHistoryProps) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const history = await getStatusHistory(requestId);
        setTimeline(history);
      } catch (error) {
        console.error('Error fetching status history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusHistory();
  }, [requestId]);

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'assigned':
        return <UserCheck className="h-5 w-5 text-indigo-500" />;
      case 'under_review':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'verified':
        return <User className="h-5 w-5 text-green-500" />;
      case 'manager_review':
        return <CalendarClock className="h-5 w-5 text-purple-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CalendarClock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'assigned':
        return 'Assigned to APO';
      case 'under_review':
        return 'Under Review (Field Assessment)';
      case 'verified':
        return 'Verified by RPO';
      case 'manager_review':
        return 'Manager Review';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status.replace('_', ' ');
    }
  };

  const getNextStep = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Awaiting assignment to Assistant Project Officer';
      case 'assigned':
        return 'APO to review and assign to Regional Project Officer';
      case 'under_review':
        return 'Regional Project Officer conducting field verification';
      case 'verified':
        return 'Awaiting final review by Assistant Project Officer';
      case 'manager_review':
        return 'Awaiting final decision by Head of Programs';
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="px-4 py-3 bg-muted/50">
        <CardTitle className="text-lg">Status History</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : timeline.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No status updates available
          </div>
        ) : (
          <div className="relative pl-6 before:absolute before:left-2.5 before:top-0 before:h-full before:w-[1px] before:bg-muted space-y-6">
            {timeline.map((event, index) => {
              const status = event.metadata?.newStatus || '';
              const nextStep = getNextStep(status);
              return (
                <div key={event.id} className="relative">
                  <div className="absolute left-[-1.625rem] top-1 h-5 w-5">
                    {getStatusIcon(status)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{getStatusName(status)}</h4>
                      <span className="text-sm text-muted-foreground">{formatTime(event.createdAt)}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>By: {event.createdBy?.name || 'Unknown'}</p>
                      {event.metadata?.note && (
                        <p className="text-muted-foreground italic border-l-2 pl-2 border-muted mt-1">
                          "{event.metadata.note}"
                        </p>
                      )}
                      {nextStep && index === 0 && (
                        <div className="mt-2 text-blue-600 bg-blue-50 p-2 rounded-sm border border-blue-100">
                          <p className="font-medium">Next Step: {nextStep}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
