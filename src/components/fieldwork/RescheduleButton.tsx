
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RescheduleButtonProps {
  fieldWorkId: string;
  className?: string;
}

export function RescheduleButton({ fieldWorkId, className }: RescheduleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReschedule = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Show toast notification
      toast({
        title: "Feature coming soon",
        description: "Field visit rescheduling will be available in a future update.",
      });
    }, 500);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      onClick={handleReschedule}
      disabled={isLoading}
    >
      <Calendar className="h-4 w-4 mr-2" />
      Reschedule
      {isLoading && <span className="ml-2 h-4 w-4 animate-spin">●</span>}
    </Button>
  );
}

export default RescheduleButton;
