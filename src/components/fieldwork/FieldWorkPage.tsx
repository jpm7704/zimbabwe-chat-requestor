
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Filter, Download, ExternalLink } from "lucide-react";
import { useFieldWork } from "@/hooks/useFieldWork";
import { FieldWorkGrid } from "./FieldWorkGrid";
import { useToast } from "@/hooks/use-toast";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFieldVisit } from "@/services/fieldWorkService";

export function FieldWorkPage() {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);
  const [isNewVisitSheetOpen, setIsNewVisitSheetOpen] = useState(false);
  
  // New visit form states
  const [newVisitLocation, setNewVisitLocation] = useState("");
  const [newVisitDate, setNewVisitDate] = useState("");
  const [newVisitTime, setNewVisitTime] = useState("");
  const [newVisitPurpose, setNewVisitPurpose] = useState("");
  const [isSubmittingNewVisit, setIsSubmittingNewVisit] = useState(false);
  
  const { fieldVisits, loading, error, fetchFieldVisits } = useFieldWork();
  const { toast } = useToast();

  const handleRefresh = () => {
    fetchFieldVisits();
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare CSV data
    const headers = ["Title", "Location", "Date", "Status", "Purpose"];
    const csvContent = [
      headers.join(","),
      ...fieldVisits.map(visit => [
        `"${visit.title}"`,
        `"${visit.location}"`,
        `"${new Date(visit.visitDate).toLocaleDateString()}"`,
        `"${visit.status}"`,
        `"${visit.purpose || "Field visit"}"`
      ].join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `field-visits-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setIsExporting(false);
    
    toast({
      title: "Export Complete",
      description: "Field visits data has been exported to CSV"
    });
  };

  const handleAdvancedFilter = () => {
    setIsFiltering(!isFiltering);
    
    // When disabling filters, reset them and refresh data
    if (isFiltering) {
      setFilterLocation("");
      setFilterStatus(undefined);
      fetchFieldVisits();
    }
  };

  const applyFilters = () => {
    // In a real implementation, we would call the API with filter parameters
    // For now, we'll just filter the data client-side
    fetchFieldVisits();
    
    toast({
      title: "Filters Applied",
      description: "Field visits data has been filtered"
    });
  };

  const handleCreateNewVisit = async () => {
    if (!newVisitLocation || !newVisitDate || !newVisitTime || !newVisitPurpose) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingNewVisit(true);
    
    try {
      // Combine date and time
      const visitDateTime = new Date(`${newVisitDate}T${newVisitTime}`);
      
      if (isNaN(visitDateTime.getTime())) {
        throw new Error("Invalid date or time");
      }
      
      // Create a new field visit
      await createFieldVisit({
        request_id: null,
        location: newVisitLocation,
        visit_date: visitDateTime.toISOString(),
        purpose: newVisitPurpose,
        status: 'scheduled',
        priority: 'medium',
        report_id: null,
        assigned_officer_id: null,
        notes: null,
        region: null,
        assigned_officer_name: null
      });
      
      // Reset form and close sheet
      setNewVisitLocation("");
      setNewVisitDate("");
      setNewVisitTime("");
      setNewVisitPurpose("");
      setIsNewVisitSheetOpen(false);
      
      toast({
        title: "Success",
        description: "New field visit has been scheduled successfully"
      });
      
      // Refresh the list to show the new visit
      fetchFieldVisits();
    } catch (error) {
      console.error("Error creating field visit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule field visit",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingNewVisit(false);
    }
  };

  // Filter the field visits based on current filters
  const filteredVisits = fieldVisits.filter(visit => {
    let matchesLocation = true;
    let matchesStatus = true;
    
    if (filterLocation) {
      matchesLocation = visit.location.toLowerCase().includes(filterLocation.toLowerCase());
    }
    
    if (filterStatus) {
      matchesStatus = visit.status === filterStatus;
    }
    
    return matchesLocation && matchesStatus;
  });

  if (loading) {
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
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button 
            variant={isFiltering ? "default" : "outline"} 
            onClick={handleAdvancedFilter}
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </Button>
          <Sheet open={isNewVisitSheetOpen} onOpenChange={setIsNewVisitSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Visit
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Schedule New Field Visit</SheetTitle>
                <SheetDescription>
                  Fill out the details to schedule a new field visit.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Visit location" 
                    value={newVisitLocation}
                    onChange={(e) => setNewVisitLocation(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={newVisitDate}
                    onChange={(e) => setNewVisitDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time"
                    value={newVisitTime}
                    onChange={(e) => setNewVisitTime(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input 
                    id="purpose" 
                    placeholder="Purpose of the visit" 
                    value={newVisitPurpose}
                    onChange={(e) => setNewVisitPurpose(e.target.value)}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleCreateNewVisit}
                    disabled={isSubmittingNewVisit}
                  >
                    {isSubmittingNewVisit ? "Scheduling..." : "Schedule Visit"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isFiltering && (
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <h3 className="font-semibold">Filter Field Visits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-location">Location</Label>
              <Input 
                id="filter-location" 
                placeholder="Filter by location" 
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select 
                value={filterStatus} 
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}

      <FieldWorkGrid fieldWorkItems={isFiltering ? filteredVisits : fieldVisits} onUpdate={fetchFieldVisits} />
    </div>
  );
}

export default FieldWorkPage;
