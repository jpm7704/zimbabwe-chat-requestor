
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, CheckCircle2, Clock, AlertCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const ApprovalsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data
  const pendingApprovals = [
    {
      id: 1,
      title: "Financial Aid Request #FA-2025-0042",
      applicant: "John Doe",
      submittedDate: "2025-03-25",
      type: "Financial",
      priority: "high",
      status: "pending"
    },
    {
      id: 2,
      title: "Housing Support Request #HS-2025-0018",
      applicant: "Jane Smith",
      submittedDate: "2025-03-24",
      type: "Housing",
      priority: "medium",
      status: "pending"
    },
    {
      id: 3,
      title: "Medical Assistance Application #MA-2025-0031",
      applicant: "Robert Johnson",
      submittedDate: "2025-03-23",
      type: "Medical",
      priority: "high",
      status: "pending"
    }
  ];
  
  const reviewedApprovals = [
    {
      id: 4,
      title: "Education Grant Request #EG-2025-0015",
      applicant: "Sarah Williams",
      submittedDate: "2025-03-20",
      reviewedDate: "2025-03-22",
      type: "Education",
      status: "approved"
    },
    {
      id: 5,
      title: "Community Support Request #CS-2025-0027",
      applicant: "Michael Brown",
      submittedDate: "2025-03-19",
      reviewedDate: "2025-03-21",
      type: "Community",
      status: "rejected"
    },
    {
      id: 6,
      title: "Disaster Relief Application #DR-2025-0009",
      applicant: "Emily Davis",
      submittedDate: "2025-03-18",
      reviewedDate: "2025-03-20",
      type: "Emergency",
      status: "approved"
    }
  ];

  // Get the correct list based on active tab
  const getFilteredList = () => {
    const list = activeTab === "pending" ? pendingApprovals : reviewedApprovals;
    
    if (!searchTerm) return list;
    
    return list.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const handleApprove = (id: number) => {
    toast({
      title: "Request approved",
      description: "The request has been approved and the applicant will be notified.",
    });
  };
  
  const handleReject = (id: number) => {
    toast({
      title: "Request rejected",
      description: "The request has been rejected and the applicant will be notified.",
      variant: "destructive",
    });
  };
  
  const handleViewRequest = (id: number) => {
    navigate(`/requests/${id}`);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low Priority</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Rejected</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Approvals Dashboard</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search approvals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {getFilteredList().length > 0 ? (
            getFilteredList().map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.priority && getPriorityBadge(item.priority)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Applicant</p>
                      <p className="text-sm text-muted-foreground">{item.applicant}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-sm text-muted-foreground">{new Date(item.submittedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => handleViewRequest(item.id)}>
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={() => handleReject(item.id)}>
                      Reject
                    </Button>
                    <Button onClick={() => handleApprove(item.id)}>
                      Approve
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No pending approvals match your search
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviewed" className="space-y-4">
          {getFilteredList().length > 0 ? (
            getFilteredList().map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Applicant</p>
                      <p className="text-sm text-muted-foreground">{item.applicant}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-sm text-muted-foreground">{new Date(item.submittedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reviewed</p>
                      <p className="text-sm text-muted-foreground">{new Date(item.reviewedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                  <Button variant="outline" onClick={() => handleViewRequest(item.id)}>
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No reviewed approvals match your search
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalsPage;
