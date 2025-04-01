
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const FieldWork = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const upcomingVisits = [
    { id: 1, location: "Harare North Community Center", date: "2025-04-01", status: "scheduled" },
    { id: 2, location: "Bulawayo South District", date: "2025-04-03", status: "scheduled" },
    { id: 3, location: "Mutare Rural Outreach", date: "2025-04-05", status: "pending" },
  ];
  
  const completedVisits = [
    { id: 4, location: "Victoria Falls Community Project", date: "2025-03-25", status: "completed" },
    { id: 5, location: "Gweru Township Initiative", date: "2025-03-20", status: "completed" },
    { id: 6, location: "Kariba Dam Resettlement Area", date: "2025-03-15", status: "completed" },
  ];

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const renderVisitCard = (visit: any) => (
    <Card key={visit.id} className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {visit.location}
          </span>
          <span className="flex items-center gap-1 text-sm font-normal">
            {renderStatusIcon(visit.status)}
            <span className="capitalize">{visit.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>{new Date(visit.date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <Button size="sm" variant={visit.status === "completed" ? "outline" : "default"}>
            {visit.status === "completed" ? "View Report" : "Manage Visit"}
          </Button>
          
          {visit.status !== "completed" && (
            <Button size="sm" variant="secondary">Reschedule</Button>
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
          {upcomingVisits.length > 0 ? (
            upcomingVisits.map(renderVisitCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No upcoming field visits scheduled
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedVisits.length > 0 ? (
            completedVisits.map(renderVisitCard)
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
