
import { FieldWorkCard } from "./FieldWorkCard";
import { FieldWorkRequest } from "@/hooks/useFieldWork";

interface FieldWorkGridProps {
  fieldWorkItems: FieldWorkRequest[];
}

export function FieldWorkGrid({ fieldWorkItems }: FieldWorkGridProps) {
  if (fieldWorkItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No field work items</h3>
        <p className="text-muted-foreground">
          No field work visits are currently scheduled
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fieldWorkItems.map((item) => (
        <FieldWorkCard key={item.id} fieldWork={item} />
      ))}
    </div>
  );
}

export default FieldWorkGrid;
