
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFieldWork } from "@/hooks/useFieldWork";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { FieldVisitsList } from "@/components/field-work/FieldVisitsList";

const FieldWork = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { fieldVisits, loading, error, updateFieldVisit } = useFieldWork();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  console.log("FieldWork component rendering with:", { 
    fieldVisitsCount: fieldVisits?.length, 
    loading, 
    error: error?.message,
    activeTab
  });
  
  // Filter visits based on active tab
  const filteredVisits = fieldVisits?.filter(visit => 
    activeTab === "upcoming" 
      ? (visit.status === "scheduled" || visit.status === "pending") 
      : visit.status === "completed"
  ) || [];

  const handleStatusChange = async (visitId: string, newStatus: string) => {
    try {
      await updateFieldVisit(visitId, { status: newStatus });
      toast({
        title: "Status updated",
        description: `Field visit status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update visit status:", error);
      toast({
        title: "Update failed",
        description: "Could not update field visit status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Field Work</h1>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming Visits</TabsTrigger>
          <TabsTrigger value="completed">Completed Visits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <FieldVisitsList
            visits={filteredVisits}
            loading={loading}
            error={error}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <FieldVisitsList
            visits={filteredVisits}
            loading={loading}
            error={error}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldWork;
