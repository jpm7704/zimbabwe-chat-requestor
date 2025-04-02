
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useFieldWork } from "@/hooks/useFieldWork";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const FieldWork = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { visits, isLoading, updateVisitStatus } = useFieldWork({
    status: activeTab === "upcoming" ? "scheduled,pending" : "completed"
  });
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (visitId: string, newStatus: string) => {
    try {
      await updateVisitStatus(visitId, newStatus);
    } catch (error) {
      console.error("Failed to update visit status:", error);
    }
  };

  const renderVisitCard = (visit: any) => (
    <Card key={visit.id} className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {visit.title}
          </span>
          <span className="flex items-center gap-1 text-sm font-normal">
            {renderStatusIcon(visit.status)}
            <span className="capitalize">{visit.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(visit.dueDate).toLocaleDateString()}</span>
          </div>
          
          {visit.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{visit.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Badge variant={visit.priority === 'high' ? 'destructive' : visit.priority === 'medium' ? 'default' : 'outline'}>
              {visit.priority} priority
            </Badge>
            {visit.report === 'Submitted' && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Report Submitted
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant={visit.status === "completed" ? "outline" : "default"}>
                {visit.status === "completed" ? "View Details" : "Manage Visit"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Field Visit Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Request</p>
                  <p>{visit.ticketNumber} - {visit.title}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-sm">Location</p>
                  <p>{visit.location || 'Not specified'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-sm">Due Date</p>
                  <p>{new Date(visit.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-sm">Assigned To</p>
                  <p>{visit.assignee}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-sm">Status</p>
                  <div className="flex gap-2 mt-2">
                    {visit.status !== "completed" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(visit.id, "completed")}
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {visit.status === "scheduled" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleStatusChange(visit.id, "pending")}
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {visit.status !== "cancelled" && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleStatusChange(visit.id, "cancelled")}
                      >
                        Cancel Visit
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <Button asChild>
                    <a href={`/reports?visitId=${visit.id}`}>
                      {visit.report === 'Submitted' ? 'View Report' : 'Create Report'}
                    </a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {visit.status !== "completed" && visit.status !== "cancelled" && (
            <Button size="sm" variant="secondary" onClick={() => toast({ title: "Feature coming soon", description: "Rescheduling will be available in the next update" })}>
              Reschedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Field Work</h1>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming Visits</TabsTrigger>
          <TabsTrigger value="completed">Completed Visits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : visits.length > 0 ? (
            visits.map(renderVisitCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No upcoming field visits scheduled
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : visits.length > 0 ? (
            visits.map(renderVisitCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No completed field visits found
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldWork;
