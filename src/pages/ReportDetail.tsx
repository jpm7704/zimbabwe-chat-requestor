
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReportEditingForm } from "@/components/forms/ReportEditingForm";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, Download, Edit, FileText, MapPin, Printer, Share2, User } from "lucide-react";

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would call an API via Supabase
        // Mock data for demonstration
        setTimeout(() => {
          setReport({
            id,
            title: "Field Assessment Report - Mashonaland East Region",
            content: `# Community Assessment Report

## Executive Summary
This report provides an overview of the community assessment conducted in the Mashonaland East Region during October 2023. The assessment involved surveys, interviews, and focus group discussions with community members to understand their needs and challenges.

## Key Findings
1. Access to clean water remains a significant challenge for 65% of households.
2. Educational infrastructure requires urgent attention, with 3 out of 5 schools lacking adequate facilities.
3. Healthcare services are limited, with the nearest clinic being over 15km away for most residents.
4. Food security concerns were reported by 72% of households due to drought conditions.

## Recommendations
- Implement water infrastructure projects including borehole drilling and well rehabilitation.
- Repair and expand educational facilities, particularly focusing on classroom structures and sanitation.
- Establish mobile health clinics to serve the most remote communities.
- Provide agricultural support through drought-resistant seed distribution and farming techniques training.

## Conclusion
The community faces significant challenges but demonstrates strong social cohesion and resilience. With targeted interventions in the areas identified, sustainable improvement in living conditions can be achieved.`,
            status: "Published",
            type: "Field Assessment",
            region: "Mashonaland East",
            author_name: "John Doe",
            category: "Community",
            created_at: "2023-11-10T08:30:00Z",
            updated_at: "2023-11-12T14:45:00Z"
          });
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.message || "Failed to load report");
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleEditReport = (data: any) => {
    setReport({ ...report, ...data });
    setDialogOpen(false);
    toast({
      title: "Report updated",
      description: "The report has been updated successfully."
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading report",
      description: "Your report is being prepared for download."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Share report",
      description: "Report link copied to clipboard for sharing."
    });
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto max-w-5xl py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-[300px]"></div>
            <div className="h-6 bg-muted rounded w-[250px]"></div>
            <div className="h-32 bg-muted rounded w-full max-w-[600px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto max-w-5xl py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load the report: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  // Helper function to render Markdown content as HTML
  const renderMarkdown = (content: string) => {
    // This is a very basic renderer - in a real app, use a proper Markdown library
    // Convert headers
    let html = content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      // Convert lists
      .replace(/^\d+\. (.*)$/gm, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/^- (.*)$/gm, '<li class="ml-6 list-disc">$1</li>')
      // Convert paragraphs
      .replace(/^(?!<h|<li)(.+)$/gm, '<p class="mb-3">$1</p>');
    
    // Wrap lists
    html = html.replace(/<li class="ml-6 list-decimal">.*?(?=<h|<p|<li class="ml-6 list-disc"|$)/gs, (match) => {
      return `<ol class="list-decimal mb-4">${match}</ol>`;
    });
    
    html = html.replace(/<li class="ml-6 list-disc">.*?(?=<h|<p|<li class="ml-6 list-decimal"|$)/gs, (match) => {
      return `<ul class="list-disc mb-4">${match}</ul>`;
    });
    
    return html;
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{report.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={report.status === "Published" ? "default" : "outline"}>
              {report.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{report.type}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{report.region}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{report.author_name}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Edit Report</DialogTitle>
              </DialogHeader>
              <ReportEditingForm onSuccess={handleEditReport} initialData={report} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(report.content) }}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(new Date(report.updated_at), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDownload} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle>Report Metadata</CardTitle>
              <CardDescription>Detailed information about this report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Report Title</h3>
                    <p>{report.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Report Type</h3>
                    <p>{report.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Category</h3>
                    <p>{report.category}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Author</h3>
                    <p>{report.author_name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Region</h3>
                    <p>{report.region}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <Badge variant={report.status === "Published" ? "default" : "outline"}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="font-medium">Document History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Created</span>
                    <span>{new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Modified</span>
                    <span>{new Date(report.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Track changes made to this report over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 rounded-lg border">
                  <div className="md:w-32 font-medium">12 Nov 2023</div>
                  <div className="flex-1">
                    <div className="font-medium">Published report</div>
                    <div className="text-sm text-muted-foreground">Final review completed and report published</div>
                  </div>
                  <div className="text-sm text-muted-foreground">By John Doe</div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 rounded-lg border">
                  <div className="md:w-32 font-medium">11 Nov 2023</div>
                  <div className="flex-1">
                    <div className="font-medium">Content updated</div>
                    <div className="text-sm text-muted-foreground">Added executive summary and recommendations</div>
                  </div>
                  <div className="text-sm text-muted-foreground">By John Doe</div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 rounded-lg border">
                  <div className="md:w-32 font-medium">10 Nov 2023</div>
                  <div className="flex-1">
                    <div className="font-medium">Created report</div>
                    <div className="text-sm text-muted-foreground">Initial draft created</div>
                  </div>
                  <div className="text-sm text-muted-foreground">By John Doe</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
