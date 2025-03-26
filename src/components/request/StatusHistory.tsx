
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusHistory } from '@/services/api/request/statusApi';
import { TimelineEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertCircle, Clock, CalendarClock } from 'lucide-react';

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
      case 'assigned':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'under_review':
      case 'manager_review':
        return <CalendarClock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'forwarded':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CalendarClock className="h-5 w-5 text-muted-foreground" />;
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
            {timeline.map((event, index) => (
              <div key={event.id} className="relative">
                <div className="absolute left-[-1.625rem] top-1 h-5 w-5">
                  {getStatusIcon(event.metadata?.newStatus || '')}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{event.description}</h4>
                    <span className="text-sm text-muted-foreground">{formatTime(event.createdAt)}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>By: {event.createdBy?.name || 'Unknown'}</p>
                    {event.metadata?.note && (
                      <p className="text-muted-foreground italic border-l-2 pl-2 border-muted mt-1">
                        "{event.metadata.note}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
