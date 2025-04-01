
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TimelineEvent } from '@/types';
import { Separator } from '@/components/ui/separator';

interface RequestTimelineProps {
  requestId: string;
}

const RequestTimeline = ({ requestId }: RequestTimelineProps) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        
        // Get status updates
        const { data: statusUpdates, error: statusError } = await supabase
          .from('status_updates')
          .select(`
            id,
            status,
            notes,
            timestamp,
            updated_by,
            request_id,
            updater:user_profiles!updated_by(name, role)
          `)
          .eq('request_id', requestId)
          .order('timestamp', { ascending: false });
          
        if (statusError) throw statusError;
        
        // Transform into timeline events
        const timelineEvents: TimelineEvent[] = statusUpdates.map(update => ({
          id: update.id,
          type: 'status_update',
          description: `Status changed to ${update.status.replace('_', ' ')}`,
          createdAt: update.timestamp,
          requestId: update.request_id,
          createdBy: {
            id: update.updated_by,
            name: update.updater?.name || 'Unknown User',
            role: update.updater?.role || 'user'
          },
          metadata: {
            status: update.status,
            notes: update.notes
          }
        }));
        
        setEvents(timelineEvents);
      } catch (error) {
        console.error('Error loading timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, [requestId]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex animate-pulse">
            <div className="w-12 h-12 rounded-full bg-secondary"></div>
            <div className="flex-1 ml-4 space-y-2">
              <div className="h-4 w-1/4 rounded bg-secondary"></div>
              <div className="h-3 w-3/4 rounded bg-secondary"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (events.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No timeline events found.</div>;
  }
  
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <React.Fragment key={event.id}>
          <div className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {event.type === 'status_update' ? (
                  <span className="text-sm font-medium">{event.metadata.status.charAt(0).toUpperCase()}</span>
                ) : (
                  <span className="text-sm font-medium">N</span>
                )}
              </div>
              {index < events.length - 1 && <div className="w-px h-full bg-border mt-2"></div>}
            </div>
            <div>
              <p className="font-medium">{event.description}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {format(new Date(event.createdAt), 'PPpp')} by {event.createdBy.name} ({event.createdBy.role.replace('_', ' ')})
              </p>
              
              {event.metadata.notes && (
                <div className="bg-secondary/20 p-3 rounded-md text-sm mt-2 whitespace-pre-wrap">
                  {event.metadata.notes}
                </div>
              )}
            </div>
          </div>
          {index < events.length - 1 && <Separator className="my-4" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RequestTimeline;
