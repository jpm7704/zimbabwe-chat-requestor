
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface StatusIconProps {
  status: string;
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case "scheduled":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "pending":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};
