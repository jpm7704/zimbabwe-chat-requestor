
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Search, Filter, PlusCircle } from "lucide-react";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const reports = [
    {
      id: 1, 
      title: "Q1 Financial Aid Distribution Report",
      category: "financial", 
      date: "2025-03-31",
      author: "Jane Smith",
      status: "published"
    },
    {
      id: 2, 
      title: "Housing Assistance Program Evaluation",
      category: "housing", 
      date: "2025-03-25",
      author: "John Doe",
      status: "published"
    },
    {
      id: 3, 
      title: "Medical Outreach Initiative Impact Assessment",
      category: "medical", 
      date: "2025-03-20",
      author: "Sarah Johnson",
      status: "draft"
    },
    {
      id: 4, 
      title: "Education Support Program Progress Report",
      category: "education", 
      date: "2025-03-15",
      author: "Robert Williams",
      status: "published"
    },
    {
      id: 5, 
      title: "Community Development Fund Allocation Analysis",
      category: "community", 
      date: "2025-03-10",
      author: "Emily Davis",
      status: "draft"
    }
  ];

  const filteredReports = reports.filter(report => {
    // Filter by search term
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by tab/status
    if (activeTab === "published" && report.status !== "published") {
      return false;
    }
    
    if (activeTab === "drafts" && report.status !== "draft") {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Report
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderReportsList(filteredReports)}
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          {renderReportsList(filteredReports)}
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          {renderReportsList(filteredReports)}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderReportsList(reports: any[]) {
    if (reports.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No reports found matching your criteria
        </div>
      );
    }
    
    return reports.map(report => (
      <Card key={report.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="capitalize">{report.category}</span> • {new Date(report.date).toLocaleDateString()}
              </div>
            </div>
            <div className="px-2 py-1 rounded-full text-xs font-medium capitalize" 
                 style={{ 
                   backgroundColor: report.status === 'published' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                   color: report.status === 'published' ? 'rgb(22, 163, 74)' : 'rgb(194, 65, 12)'
                 }}>
              {report.status}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Author: {report.author}
          </p>
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
    ));
  }
};

export default Reports;
