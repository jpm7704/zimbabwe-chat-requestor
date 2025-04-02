
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateFieldVisit } from "@/services/fieldWorkService";

interface RescheduleButtonProps {
  fieldWorkId: string;
  currentDate: string;
  className?: string;
  onReschedule?: () => void;
}

export function RescheduleButton({ 
  fieldWorkId, 
  currentDate, 
  className, 
  onReschedule 
}: RescheduleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const { toast } = useToast();

  // Set initial values based on current date
  const handleOpenDialog = () => {
    const date = new Date(currentDate);
    const formattedDate = date.toISOString().split('T')[0];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    setNewDate(formattedDate);
    setNewTime(formattedTime);
    setIsDialogOpen(true);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine date and time into a single datetime
      const newDateTimeStr = `${newDate}T${newTime}:00`;
      const newDateTime = new Date(newDateTimeStr);
      
      if (isNaN(newDateTime.getTime())) {
        throw new Error("Invalid date or time format");
      }
      
      // Update the field visit in the database
      await updateFieldVisit(fieldWorkId, {
        visit_date: newDateTime.toISOString(),
        status: 'scheduled'
      });
      
      toast({
        title: "Success",
        description: "Field visit has been rescheduled successfully",
      });
      
      setIsDialogOpen(false);
      
      // Call the onReschedule callback if provided
      if (onReschedule) {
        onReschedule();
      }
    } catch (error) {
      console.error("Error rescheduling field visit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reschedule the field visit",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className={className}
        onClick={handleOpenDialog}
        disabled={isLoading}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Reschedule
        {isLoading && <span className="ml-2 h-4 w-4 animate-spin">●</span>}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Field Visit</DialogTitle>
            <DialogDescription>
              Select a new date and time for this field visit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RescheduleButton;
