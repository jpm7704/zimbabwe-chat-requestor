
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { clearAllData } from "@/utils/dbReset";
import { useToast } from "@/hooks/use-toast";

/**
 * A button component that when clicked, shows a confirmation dialog
 * to clear all application data
 */
const ClearDatabaseButton = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClearData = async () => {
    setIsClearing(true);
    
    try {
      const result = await clearAllData();
      
      if (result.success) {
        toast({
          title: "Database Cleared",
          description: "All application data has been successfully cleared.",
        });
      } else {
        toast({
          title: "Failed to Clear Data",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during data clearing:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while clearing data.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear All Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete ALL data in the database including users, requests, messages, and all other application data.
            <br /><br />
            <span className="font-bold text-destructive">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isClearing}
            onClick={(e) => {
              e.preventDefault();
              handleClearData();
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Clearing...
              </>
            ) : (
              "Yes, Clear All Data"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearDatabaseButton;
