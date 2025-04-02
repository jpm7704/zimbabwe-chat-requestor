
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Report } from "@/services/reportService";
import { format } from "date-fns";

interface ReportsListProps {
  reports: Report[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

const ReportsList = ({ reports, isLoading, error, onRefresh }: ReportsListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  if (error && error.message !== "Failed to load field visits" && 
      !error.message.includes("no rows returned") && 
      !error.message.includes("policy") && 
      !error.message.includes("infinite recursion")) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-lg font-medium mb-2">Failed to load reports</p>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No reports found</h3>
        <p className="text-muted-foreground mb-6">
          No reports match your current filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <Card key={report.id} className="mb-4 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="capitalize">{report.category}</span> • {format(new Date(report.date), 'MMM d, yyyy')}
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                ${report.status === 'Published' ? 'bg-green-100 text-green-700' : 
                  report.status === 'Draft' ? 'bg-orange-100 text-orange-700' : 
                  'bg-blue-100 text-blue-700'}`}>
                {report.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Author: {report.author}
            </p>
            {report.content && report.content.length > 100 ? (
              <p className="text-sm text-muted-foreground mt-2">
                {report.content.substring(0, 100)}...
              </p>
            ) : report.content ? (
              <p className="text-sm text-muted-foreground mt-2">{report.content}</p>
            ) : null}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View Report
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
