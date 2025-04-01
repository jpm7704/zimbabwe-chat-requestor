
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports, type Report } from "@/services/reportService";

const Reports = () => {
  const { userProfile } = useAuth();
  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports
  });

  if (isLoading) return <div>Loading reports...</div>;
  if (error) return <div>Error loading reports: {(error as Error).message}</div>;

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">
              Access and manage field reports and assessments
            </p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create New Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View and download the latest field reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No reports available
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.author}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === 'Published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting review or approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 p-4 text-center text-muted-foreground">
                {reports.filter(r => r.status !== 'Published').length} pending reports
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Standardized templates for field assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Report template section remains empty for now */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
