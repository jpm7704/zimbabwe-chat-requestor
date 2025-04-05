
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRequestById } from '@/services/requestService';
import { addNote, updateRequestStatus } from '@/services/requestService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Send, FileText, MessageSquare, ClipboardList } from 'lucide-react';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import RequestTimeline from '@/components/requests/RequestTimeline';
import RequestDocuments from '@/components/requests/RequestDocuments';
import RequestMessages from '@/components/requests/RequestMessages';
import RequestAssignmentPanel from '@/components/requests/RequestAssignmentPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNextStatusOptions } from '@/lib/requestStatusUtils';

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [note, setNote] = useState('');
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequestById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load request details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAddNote = async () => {
    if (!note.trim() || !id) return;

    try {
      setIsSubmitting(true);
      await addNote(id, note);
      setNote('');
      refetch();
      toast({
        title: "Note added",
        description: "Your note has been added successfully."
      });
    } catch (error) {
      console.error("Failed to add note:", error);
      toast({
        title: "Failed to add note",
        description: "There was an error adding your note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !id) return;

    try {
      setIsSubmitting(true);
      await updateRequestStatus(id, newStatus, note);
      setNote('');
      setNewStatus(undefined);
      refetch();
      toast({
        title: "Status updated",
        description: `Request status has been updated to ${newStatus}.`
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Failed to update status",
        description: "There was an error updating the status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Request not found</h1>
        <p>The request you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/requests')} className="mt-4">
          Back to Requests
        </Button>
      </div>
    );
  }

  const statusOptions = getNextStatusOptions(request.status, userProfile?.role);
  const canUpdateStatus = statusOptions.length > 0;
  const createdAtFormatted = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{request.type}</Badge>
            <span className="text-sm text-muted-foreground">#{request.ticket_number}</span>
            <span className="text-sm text-muted-foreground">Created {createdAtFormatted}</span>
          </div>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="pt-6">
                  <RequestTimeline requestId={id as string} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardContent className="pt-6">
                  <RequestDocuments requestId={id as string} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardContent className="pt-6">
                  <RequestMessages requestId={id as string} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <RequestAssignmentPanel
            request={request}
            onAssignmentChange={refetch}
          />

          {canUpdateStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Add a note about this status change..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <Button
                    className="w-full"
                    onClick={handleStatusChange}
                    disabled={!newStatus || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a note to this request..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px]"
                />

                <Button
                  className="w-full"
                  onClick={handleAddNote}
                  disabled={!note.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
