
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getUserRequests, searchRequests } from "@/services/requestService";
import { Request } from "@/types";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Circle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestsPage = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserRequests();
        setRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast({
          title: "Error",
          description: "Failed to load requests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
      return;
    }

    try {
      setLoading(true);
      const results = await searchRequests(searchTerm);
      setFilteredRequests(results);
    } catch (error) {
      console.error("Error searching requests:", error);
      toast({
        title: "Error",
        description: "Failed to search requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(request => {
      if (filter === "active") {
        return ["submitted", "assigned", "under_review", "manager_review"].includes(request.status);
      }
      if (filter === "completed") {
        return ["completed", "forwarded"].includes(request.status);
      }
      if (filter === "rejected") {
        return request.status === "rejected";
      }
      return false;
    });

    setFilteredRequests(filtered);
  };

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
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Requests</h1>
          <p className="text-muted-foreground">
            Track and manage your BGF Zimbabwe support requests
          </p>
        </div>
        <Button asChild>
          <Link to="/chat?action=new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by ticket number or description"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            variant="outline"
            className="md:w-auto"
          >
            Search
          </Button>
          <Button variant="outline" className="md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="md:w-auto">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeFilter} onValueChange={handleFilter}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="p-4">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="px-4 pb-2">
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-0 justify-between">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="h-9 bg-muted rounded w-24"></div>
              </CardFooter>
            </Card>
          ))
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try a different search term" : "You haven't submitted any requests yet"}
            </p>
            <Button asChild>
              <Link to="/chat">Create New Request</Link>
            </Button>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="overflow-hidden transition-all hover:border-primary/30 animate-fade-in"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2 font-normal">
                    Ticket: {request.ticketNumber}
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
                  Updated: {new Date(request.updatedAt).toLocaleDateString()}
                </div>
                <Button asChild size="sm">
                  <Link to={`/requests/${request.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
