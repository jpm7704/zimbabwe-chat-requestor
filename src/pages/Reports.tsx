
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Search } from "lucide-react";

const Reports = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();

  // Redirect if user doesn't have permission to view this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!permissions.canAccessFieldReports) {
      navigate('/');
    }
  }, [isAuthenticated, permissions, navigate]);

  // Sample reports data
  const reports = [
    {
      id: "REP-2503-001",
      title: "Harare District Educational Needs Assessment",
      date: "March 25, 2025",
      author: "John Doe",
      status: "Published"
    },
    {
      id: "REP-2103-002",
      title: "Bulawayo Medical Support Initiative Impact Report",
      date: "March 21, 2025",
      author: "Jane Smith",
      status: "Published"
    },
    {
      id: "REP-1903-003",
      title: "Mutare Food Security Assessment Q1 2025",
      date: "March 19, 2025",
      author: "Robert Johnson",
      status: "Published"
    },
    {
      id: "REP-1503-004",
      title: "Gweru Livelihood Development Project Evaluation",
      date: "March 15, 2025",
      author: "Alice Williams",
      status: "Draft"
    },
    {
      id: "REP-1003-005",
      title: "Masvingo Water & Sanitation Program Progress Report",
      date: "March 10, 2025",
      author: "David Chen",
      status: "Draft"
    }
  ];

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
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.date}</TableCell>
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
                ))}
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
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="font-medium">Chitungwiza Food Assistance Distribution Report</div>
                  <div className="text-sm text-muted-foreground">Created on March 26, 2025 • Awaiting review</div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="font-medium">Norton School Supplies Distribution Impact Assessment</div>
                  <div className="text-sm text-muted-foreground">Created on March 25, 2025 • Awaiting approval</div>
                </div>
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
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">Needs Assessment Template</div>
                    <div className="text-sm text-muted-foreground">Standard template for initial assessments</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">Project Evaluation Template</div>
                    <div className="text-sm text-muted-foreground">For completed project assessments</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">Monthly Progress Report Template</div>
                    <div className="text-sm text-muted-foreground">For ongoing project tracking</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
