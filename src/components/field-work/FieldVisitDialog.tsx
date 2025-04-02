
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FieldWorkRequest } from "@/hooks/useFieldWork";

interface FieldVisitDialogProps {
  visit: FieldWorkRequest;
  onStatusChange: (visitId: string, newStatus: string) => Promise<void>;
}

export const FieldVisitDialog = ({ visit, onStatusChange }: FieldVisitDialogProps) => {
  return (
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
            <p>{visit.ticketNumber || 'N/A'} - {visit.title}</p>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium text-sm">Location</p>
            <p>{visit.location || 'Not specified'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium text-sm">Due Date</p>
            <p>{new Date(visit.visitDate).toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium text-sm">Assigned To</p>
            <p>{visit.assignee || 'Not assigned'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium text-sm">Status</p>
            <div className="flex gap-2 mt-2">
              {visit.status !== "completed" && (
                <Button 
                  size="sm" 
                  onClick={() => onStatusChange(visit.id, "completed")}
                >
                  Mark as Completed
                </Button>
              )}
              {visit.status === "scheduled" && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onStatusChange(visit.id, "pending")}
                >
                  Mark as Pending
                </Button>
              )}
              {visit.status !== "cancelled" && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onStatusChange(visit.id, "cancelled")}
                >
                  Cancel Visit
                </Button>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <Button asChild>
              <a href={`/reports?visitId=${visit.id}`}>
                {visit.reportSubmitted ? 'View Report' : 'Create Report'}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
