
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const RequestsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Requests</h1>
        <p className="text-muted-foreground">
          Track and manage your BGF Zimbabwe support requests
        </p>
      </div>
      <Button asChild>
        <Link to="/submit?action=new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </Button>
    </div>
  );
};

export default RequestsHeader;
