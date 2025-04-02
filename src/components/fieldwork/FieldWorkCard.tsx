
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Calendar, Clock, Download, Share, Printer } from "lucide-react";
import { format } from "date-fns";
import { RescheduleButton } from "./RescheduleButton";
import { FieldWorkRequest } from "@/hooks/useFieldWork";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { submitFieldVisitReport } from "@/services/fieldWorkService";

interface FieldWorkCardProps {
  fieldWork: FieldWorkRequest;
  onUpdate?: () => void;
}

export function FieldWorkCard({ fieldWork, onUpdate }: FieldWorkCardProps) {
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const handleViewReport = () => {
    if (fieldWork.reportId) {
      // If report exists, navigate to the report detail view
      // For now just show a dialog with the report content
      setIsReportDialogOpen(true);
    } else {
      // If no report exists, open dialog to create one
      setReportContent("");
      setIsReportDialogOpen(true);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportContent.trim()) {
      toast({
        title: "Error",
        description: "Report content cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReport(true);
    
    try {
      await submitFieldVisitReport(fieldWork.id, reportContent);
      
      toast({
        title: "Success",
        description: "Field visit report has been submitted successfully"
      });
      
      setIsReportDialogOpen(false);
      
      // Trigger refresh of parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error submitting field visit report:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit field visit report",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate file download process
    setTimeout(() => {
      const reportText = fieldWork.reportId 
        ? "Field Report #" + fieldWork.reportId 
        : "Visit details for " + fieldWork.title;
      
      const element = document.createElement("a");
      const file = new Blob([reportText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `field-visit-${fieldWork.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setIsDownloading(false);
      
      toast({
        title: "Downloaded",
        description: "Field visit report has been downloaded"
      });
    }, 1000);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Prepare content for printing
    const printContent = `
      <h1>${fieldWork.title}</h1>
      <p><strong>Location:</strong> ${fieldWork.location}</p>
      <p><strong>Date:</strong> ${formatDate(fieldWork.visitDate)}</p>
      <p><strong>Time:</strong> ${formatTime(fieldWork.visitDate)}</p>
      <p><strong>Status:</strong> ${fieldWork.status}</p>
      <p><strong>Purpose:</strong> ${fieldWork.purpose || "Field visit"}</p>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Field Visit - ${fieldWork.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              p { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      
      // Wait a moment to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
        
        toast({
          title: "Print Initiated",
          description: "Field visit report has been sent to printer"
        });
      }, 500);
    } else {
      setIsPrinting(false);
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      // In a real app, this would use the Web Share API or a sharing service
      const shareData = {
        title: fieldWork.title,
        text: `Field visit to ${fieldWork.location} on ${formatDate(fieldWork.visitDate)}`,
        url: window.location.href
      };
      
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share(shareData)
          .then(() => {
            toast({
              title: "Shared",
              description: "Field visit details have been shared"
            });
          })
          .catch((error) => {
            console.error("Error sharing:", error);
            toast({
              title: "Error",
              description: "Could not share field visit details",
              variant: "destructive"
            });
          })
          .finally(() => {
            setIsSharing(false);
          });
      } else {
        // Fallback for browsers that don't support Web Share API
        // Copy to clipboard
        navigator.clipboard.writeText(`
          Field Visit: ${fieldWork.title}
          Location: ${fieldWork.location}
          Date: ${formatDate(fieldWork.visitDate)}
          Time: ${formatTime(fieldWork.visitDate)}
          Status: ${fieldWork.status}
        `).then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Field visit details have been copied to clipboard"
          });
        });
        
        setIsSharing(false);
      }
    }, 1000);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{fieldWork.title}</CardTitle>
          <Badge 
            className={
              fieldWork.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-200" :
              fieldWork.status === "scheduled" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
              "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }
          >
            {fieldWork.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {fieldWork.location}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(fieldWork.visitDate)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(fieldWork.visitDate)}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {fieldWork.purpose || "Field visit"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={handleViewReport}>
          <FileText className="h-4 w-4 mr-2" />
          {fieldWork.reportId ? "View Report" : "Create Report"}
        </Button>
        
        <RescheduleButton 
          fieldWorkId={fieldWork.id} 
          currentDate={fieldWork.visitDate}
          onReschedule={onUpdate}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          disabled={isPrinting}
        >
          <Printer className="h-4 w-4 mr-2" />
          {isPrinting ? "Printing..." : "Print"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          disabled={isSharing}
        >
          <Share className="h-4 w-4 mr-2" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </CardFooter>
      
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {fieldWork.reportId ? "Field Visit Report" : "Create Field Visit Report"}
            </DialogTitle>
            <DialogDescription>
              {fieldWork.reportId 
                ? "View the details of this field visit report" 
                : "Add details about this field visit to create a report"}
            </DialogDescription>
          </DialogHeader>
          
          {fieldWork.reportId ? (
            <div>
              <p>Report ID: {fieldWork.reportId}</p>
              <p>This report has been submitted and is now complete.</p>
              {/* In a real app, we would fetch and display the actual report content */}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-content">Report Content</Label>
                <textarea
                  id="report-content"
                  className="w-full h-64 p-2 border rounded-md"
                  placeholder="Enter your report details here..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReportDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReport} 
                  disabled={isSubmittingReport || !reportContent.trim()}
                >
                  {isSubmittingReport ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default FieldWorkCard;
