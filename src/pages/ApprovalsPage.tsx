
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateRequestStatus } from "@/services/api/requestMutationApi";

const ApprovalsPage = () => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const roles = useRoles(userProfile);
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // In a real application, this would come from your API
  const [pendingRequests] = useState([
    {
      id: "1",
      title: "Emergency Food Assistance for Harare",
      description: "Requesting food supplies for 200 families affected by drought in Harare region.",
      ticketNumber: "BGF-2305-0001",
      status: "awaiting_approval",
      submittedBy: "John Doe",
      submittedDate: "2023-05-15",
      lastUpdate: "2023-05-20",
      type: "food_assistance"
    },
    {
      id: "2",
      title: "Medical Supplies for Bulawayo Clinic",
      description: "Request for essential medical supplies for the community clinic serving 500 households.",
      ticketNumber: "BGF-2305-0002",
      status: "awaiting_approval",
      submittedBy: "Jane Smith",
      submittedDate: "2023-05-16",
      lastUpdate: "2023-05-21",
      type: "medical_assistance"
    },
  ]);
  
  const roleTitle = roles.isAdmin() ? "Director" : roles.isCEO() ? "CEO" : "Patron";
  
  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      // In a real app, this would update the database
      // Change from "approved" to "completed" to match the valid RequestStatus type
      await updateRequestStatus(requestId, "completed", note);
      toast({
        title: "Request approved",
        description: `You have approved request ${requestId}. It will now be processed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
      setNote("");
    }
  };
  
  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      // In a real app, this would update the database
      await updateRequestStatus(requestId, "rejected", note);
      toast({
        title: "Request rejected",
        description: `You have rejected request ${requestId}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
      setNote("");
    }
  };
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{roleTitle} Approvals</h1>
          <p className="text-muted-foreground">Review and approve/reject requests forwarded by Head of Programs</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="pending">
            Pending <Badge className="ml-2 bg-amber-500">{pendingRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>
                          {request.ticketNumber} • {new Date(request.lastUpdate).toDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-500">Awaiting {roleTitle} Approval</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{request.description}</p>
                    <div className="space-y-4 mt-4">
                      <Textarea 
                        placeholder={`Add notes as ${roleTitle} before approving/rejecting...`}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline" 
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button
                          className="gap-1"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                        >
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">No requests awaiting your approval</h3>
              <p className="mt-1 text-muted-foreground">
                All pending requests have been processed. Check back later for new requests.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          <div className="text-center py-16">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">No approved requests</h3>
            <p className="mt-1 text-muted-foreground">
              Once you approve requests, they will appear here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="rejected">
          <div className="text-center py-16">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">No rejected requests</h3>
            <p className="mt-1 text-muted-foreground">
              Once you reject requests, they will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalsPage;
