
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FieldWorkItem } from "@/services/fieldWorkService";
import { FileText, MapPin, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { RescheduleButton } from "./RescheduleButton";

interface FieldWorkCardProps {
  fieldWork: FieldWorkItem;
}

export function FieldWorkCard({ fieldWork }: FieldWorkCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{fieldWork.title}</CardTitle>
          <Badge 
            className={
              fieldWork.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-200" :
              fieldWork.status === "Scheduled" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
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
            {formatDate(fieldWork.scheduledDate)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(fieldWork.scheduledDate)}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {fieldWork.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <RescheduleButton fieldWorkId={fieldWork.id} />
      </CardFooter>
    </Card>
  );
}

export default FieldWorkCard;
