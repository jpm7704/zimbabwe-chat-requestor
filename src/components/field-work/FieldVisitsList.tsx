
import { Loader2 } from "lucide-react";
import { FieldWorkRequest } from "@/hooks/useFieldWork";
import { FieldVisitCard } from "./FieldVisitCard";

interface FieldVisitsListProps {
  visits: FieldWorkRequest[];
  loading: boolean;
  error: Error | null;
  onStatusChange: (visitId: string, newStatus: string) => Promise<void>;
}

export const FieldVisitsList = ({ 
  visits, 
  loading, 
  error, 
  onStatusChange 
}: FieldVisitsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && 
      error.message !== "Failed to load field visits" && 
      !error.message.includes("no rows returned") && 
      !error.message.includes("policy") && 
      !error.message.includes("infinite recursion")) {
    return (
      <div className="text-center py-10 text-red-500">
        {error.message}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No field visits found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map(visit => (
        <FieldVisitCard
          key={visit.id}
          visit={visit}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
