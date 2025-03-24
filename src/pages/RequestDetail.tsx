
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  getRequestById, 
  addNoteToRequest 
} from "@/services/requestService";
import { Request, TimelineEvent } from "@/types";
import {
  ArrowLeft,
  FileText,
  Clock,
  Circle,
  CheckCircle2,
  XCircle,
  Send,
  Download,
  MessageSquare,
  User,
  AlertCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) return;
      
      try {
        const data = await getRequestById(id);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request details:", error);
        toast({
          title: "Error",
          description: "Failed to load request details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, toast]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !noteText.trim()) return;
    
    setSubmitting(true);
    
    try {
      const result = await addNoteToRequest(id, noteText);
      
      // Update the local state with the new note and timeline event
      if (request) {
        setRequest({
          ...request,
          notes: [...request.notes, result.note],
          timeline: [result.timelineEvent, ...request.timeline]
        });
      }
      
      setNoteText("");
      toast({
        title: "Note added",
        description: "Your note has been added to the request."
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string, size: number = 4) => {
    const iconProps = { className: `h-${size} w-${size}` };
    
    switch (status) {
      case "submitted":
        return <Clock {...iconProps} className={`h-${size} w-${size} text-blue-500`} />;
      case "assigned":
        return <Circle {...iconProps} className={`h-${size} w-${size} text-purple-500`} />;
      case "under_review":
        return <Circle {...iconProps} className={`h-${size} w-${size} text-yellow-500`} />;
      case "manager_review":
        return <Circle {...iconProps} className={`h-${size} w-${size} text-orange-500`} />;
      case "forwarded":
        return <Circle {...iconProps} className={`h-${size} w-${size} text-green-500`} />;
      case "completed":
        return <CheckCircle2 {...iconProps} className={`h-${size} w-${size} text-green-500`} />;
      case "rejected":
        return <XCircle {...iconProps} className={`h-${size} w-${size} text-destructive`} />;
      default:
        return <AlertCircle {...iconProps} className={`h-${size} w-${size} text-muted-foreground`} />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "assigned":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
      case "under_review":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "manager_review":
        return "bg-orange-500/10 text-orange-500 border-orange-200";
      case "forwarded":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "status_change":
        return <Circle className="h-4 w-4 text-blue-500" />;
      case "note_added":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "document_added":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "assigned":
        return <User className="h-4 w-4 text-orange-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const TimelineItem = ({ event }: { event: TimelineEvent }) => {
    return (
      <div className="flex gap-3 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="rounded-full p-1 bg-primary/10">
            {getEventIcon(event.type)}
          </div>
          <div className="w-px flex-grow bg-border mt-2"></div>
        </div>
        <div className="pb-6 pt-1">
          <p className="font-medium">{event.description}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(event.createdAt).toLocaleString()}
            {event.createdBy && ` • ${event.createdBy.name}`}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto max-w-5xl py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2 mb-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-10 bg-muted rounded w-full mb-4"></div>
              <div className="h-32 bg-muted rounded w-full mb-6"></div>
              <div className="h-40 bg-muted rounded w-full"></div>
            </div>
            <div>
              <div className="h-10 bg-muted rounded w-full mb-4"></div>
              <div className="h-24 bg-muted rounded w-full mb-4"></div>
              <div className="h-40 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container px-4 mx-auto max-w-5xl py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Request not found</h2>
          <p className="text-muted-foreground mb-6">
            The request you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link to="/requests">Back to Requests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8 animate-fade-in">
      <Button asChild variant="ghost" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/requests" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap gap-3 mb-2">
            <Badge className="font-normal">Ticket: {request.ticketNumber}</Badge>
            <Badge variant="outline" className="font-normal capitalize">
              {request.type.replace(/_/g, ' ')}
            </Badge>
            <Badge className={`${getStatusColor(request.status)} border`}>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(request.status)}
                <span>{getStatusText(request.status)}</span>
              </div>
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-1">{request.title}</h1>
          <p className="text-muted-foreground">
            Submitted on {new Date(request.createdAt).toLocaleDateString()} • Last updated {new Date(request.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Contact Support</Button>
          {request.status === "rejected" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> 
              New Request
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{request.description}</p>
              </div>

              <Separator className="my-6" />

              <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({request.notes.length})</TabsTrigger>
                  <TabsTrigger value="documents">Documents ({request.documents.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="space-y-0">
                  {request.timeline.map((event) => (
                    <TimelineItem key={event.id} event={event} />
                  ))}
                  
                  {request.timeline.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No timeline events yet</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="notes">
                  <div className="mb-6">
                    <form onSubmit={handleAddNote} className="space-y-4">
                      <Textarea
                        placeholder="Add a note to this request..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="min-h-32"
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="gap-2" 
                          disabled={!noteText.trim() || submitting}
                        >
                          <Send className="h-4 w-4" />
                          Add Note
                        </Button>
                      </div>
                    </form>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-6">
                    {request.notes.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No notes added yet</p>
                      </div>
                    ) : (
                      request.notes.map((note) => (
                        <div key={note.id} className="animate-fade-in">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{note.authorName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {note.isInternal && (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <div className="pl-10">
                            <p className="whitespace-pre-wrap">{note.content}</p>
                          </div>
                          <Separator className="mt-6" />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-4">
                    {request.documents.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No documents uploaded yet</p>
                      </div>
                    ) : (
                      request.documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors animate-fade-in"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded p-2">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type.replace(/_/g, ' ')} • Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {getStatusIcon(request.status, 6)}
                <div>
                  <p className="font-semibold">{getStatusText(request.status)}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(request.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary text-white p-1">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>Submitted</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${
                        ["assigned", "under_review", "manager_review", "forwarded", "completed"].includes(request.status)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className={!["assigned", "under_review", "manager_review", "forwarded", "completed"].includes(request.status) 
                        ? "text-muted-foreground" 
                        : ""
                      }>
                        Assigned to Field Officer
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${
                        ["under_review", "manager_review", "forwarded", "completed"].includes(request.status)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className={!["under_review", "manager_review", "forwarded", "completed"].includes(request.status) 
                        ? "text-muted-foreground" 
                        : ""
                      }>
                        Due Diligence
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${
                        ["manager_review", "forwarded", "completed"].includes(request.status)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className={!["manager_review", "forwarded", "completed"].includes(request.status) 
                        ? "text-muted-foreground" 
                        : ""
                      }>
                        Program Manager Review
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${
                        ["forwarded", "completed"].includes(request.status)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className={!["forwarded", "completed"].includes(request.status) 
                        ? "text-muted-foreground" 
                        : ""
                      }>
                        Forwarded to Management
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${
                        ["completed"].includes(request.status)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className={!["completed"].includes(request.status) 
                        ? "text-muted-foreground" 
                        : ""
                      }>
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Request Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ticket Number</dt>
                    <dd className="font-medium">{request.ticketNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-medium capitalize">{request.type.replace(/_/g, ' ')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Submitted On</dt>
                    <dd className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Documents</dt>
                    <dd className="font-medium">{request.documents.length}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
