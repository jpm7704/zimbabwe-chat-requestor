
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon } from "./StatusIcon";
import { FieldVisitDialog } from "./FieldVisitDialog";
import { useToast } from "@/hooks/use-toast";
import { FieldWorkRequest } from "@/hooks/useFieldWork";

interface FieldVisitCardProps {
  visit: FieldWorkRequest;
  onStatusChange: (visitId: string, newStatus: string) => Promise<void>;
}

export const FieldVisitCard = ({ visit, onStatusChange }: FieldVisitCardProps) => {
  const { toast } = useToast();

  return (
    <Card key={visit.id} className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {visit.title}
          </span>
          <span className="flex items-center gap-1 text-sm font-normal">
            <StatusIcon status={visit.status} />
            <span className="capitalize">{visit.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(visit.visitDate).toLocaleDateString()}</span>
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
            {visit.reportSubmitted && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Report Submitted
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <FieldVisitDialog 
            visit={visit} 
            onStatusChange={onStatusChange} 
          />
          
          {visit.status !== "completed" && visit.status !== "cancelled" && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => toast({ 
                title: "Feature coming soon", 
                description: "Rescheduling will be available in the next update" 
              })}
            >
              Reschedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
