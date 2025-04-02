
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Filter } from "lucide-react";
import { useFieldWork } from "@/hooks/useFieldWork";
import { FieldWorkGrid } from "./FieldWorkGrid";

export function FieldWorkPage() {
  const [isFiltering, setIsFiltering] = useState(false);
  const { fieldWorkItems, isLoading, error, refetch } = useFieldWork();

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error loading field work data</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "Failed to load field work items. Please try again."}
        </p>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Field Work</h2>
          <p className="text-muted-foreground">
            Manage and track field operations and site visits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFiltering(!isFiltering)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Visit
          </Button>
        </div>
      </div>

      <FieldWorkGrid fieldWorkItems={fieldWorkItems} />
    </div>
  );
}

export default FieldWorkPage;
