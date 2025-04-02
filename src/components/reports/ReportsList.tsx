
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Report } from "@/services/reportService";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Printer, Share, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ReportsListProps {
  reports: Report[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, isLoading, error, onRefresh }) => {
  const { toast } = useToast();

  const handleDownload = (reportId: string) => {
    toast({
      title: "Feature coming soon",
      description: "Report download will be available in a future update."
    });
  };

  const handlePrint = (reportId: string) => {
    toast({
      title: "Feature coming soon",
      description: "Print functionality will be available in a future update."
    });
  };

  const handleShare = (reportId: string) => {
    toast({
      title: "Feature coming soon",
      description: "Report sharing will be available in a future update."
    });
  };
  
  const handleAdvancedFilter = () => {
    toast({
      title: "Feature coming soon",
      description: "Advanced filtering will be available in a future update."
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error loading reports</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button variant="outline" onClick={onRefresh}>Retry</Button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No reports found</h3>
        <p className="text-muted-foreground mb-6">
          No reports match your current filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleAdvancedFilter} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>{format(new Date(report.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{report.author}</TableCell>
                <TableCell>{report.category || "Uncategorized"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      report.status === "Published" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                      report.status === "Draft" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                      "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/reports/${report.id}`}>
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(report.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePrint(report.id)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(report.id)}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsList;
