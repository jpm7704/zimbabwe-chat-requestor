
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Calendar, Clock, Download, Share, Printer } from "lucide-react";
import { format } from "date-fns";
import { RescheduleButton } from "./RescheduleButton";
import { FieldWorkRequest } from "@/hooks/useFieldWork";
import { useToast } from "@/hooks/use-toast";

interface FieldWorkCardProps {
  fieldWork: FieldWorkRequest;
}

export function FieldWorkCard({ fieldWork }: FieldWorkCardProps) {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const handleViewReport = () => {
    toast({
      title: "Feature coming soon",
      description: "Report viewing will be available in a future update."
    });
  };

  const handleDownload = () => {
    toast({
      title: "Feature coming soon",
      description: "Report download will be available in a future update."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Feature coming soon",
      description: "Print functionality will be available in a future update."
    });
  };

  const handleShare = () => {
    toast({
      title: "Feature coming soon",
      description: "Report sharing will be available in a future update."
    });
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
          View Report
        </Button>
        <RescheduleButton fieldWorkId={fieldWork.id} />
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FieldWorkCard;
