
import { Request } from "@/types";
import { Link } from "react-router-dom";
import { Circle, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface RequestCardProps {
  request: Request;
}

const RequestCard = ({ request }: RequestCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "assigned":
        return <Circle className="h-4 w-4 text-purple-500" />;
      case "under_review":
        return <Circle className="h-4 w-4 text-yellow-500" />;
      case "manager_review":
        return <Circle className="h-4 w-4 text-orange-500" />;
      case "forwarded":
        return <Circle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "assigned":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
      case "under_review":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "manager_review":
        return "bg-orange-500/10 text-orange-500 border-orange-200";
      case "forwarded":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/30 animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2 font-normal">
            Ticket: {request.ticket_number}
          </Badge>
          <Badge className={`${getStatusColor(request.status)} border`}>
            <div className="flex items-center gap-1.5">
              {getStatusIcon(request.status)}
              <span>{getStatusText(request.status)}</span>
            </div>
          </Badge>
        </div>
        <h3 className="text-lg font-semibold">{request.title}</h3>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-muted-foreground line-clamp-2">{request.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="font-normal">
            {request.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </Badge>
          <Badge variant="outline" className="font-normal">
            Documents: {request.documents.length}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Updated: {new Date(request.updated_at).toLocaleDateString()}
        </div>
        <Button asChild size="sm">
          <Link to={`/requests/${request.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
