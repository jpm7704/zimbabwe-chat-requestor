import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FieldWork = () => {
  const { userProfile, formatRole } = useAuth();
  const navigate = useNavigate();
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignedRequests([
        {
          id: '1',
          ticketNumber: 'BGF-2309-0023',
          title: 'Medical Assistance',
          status: 'assigned',
          createdAt: '2025-03-22T10:00:00Z',
          dueDate: '2025-03-29T10:00:00Z',
          priority: 'high'
        },
        {
          id: '2',
          ticketNumber: 'BGF-2309-0045',
          title: 'Educational Support',
          status: 'under_review',
          createdAt: '2025-03-21T14:30:00Z',
          dueDate: '2025-03-28T14:30:00Z',
          priority: 'medium'
        },
        {
          id: '3',
          ticketNumber: 'BGF-2309-0018',
          title: 'Food Assistance',
          status: 'assigned',
          createdAt: '2025-03-20T09:15:00Z',
          dueDate: '2025-03-27T09:15:00Z',
          priority: 'low'
        }
      ]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Field Work Dashboard</h1>
          <p className="text-muted-foreground">
            <span className="font-medium">
              {userProfile?.first_name} {userProfile?.last_name}
            </span> • <span>{formatRole(userProfile?.role || '')}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Assigned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Waiting for verification</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Within 48 hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/30 border-b">
            <h2 className="text-xl font-semibold">Assigned Requests</h2>
            <p className="text-sm text-muted-foreground">
              Requests assigned to you for verification and assessment
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading assigned requests...
                    </TableCell>
                  </TableRow>
                ) : assignedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No requests assigned to you at this time.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.ticketNumber}</TableCell>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>
                        <Badge className={request.status === 'assigned' ? 'bg-blue-500' : 'bg-yellow-500'}>
                          {request.status === 'assigned' ? 'Assigned' : 'Under Review'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>{new Date(request.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/requests/${request.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0023 - Medical Assistance</div>
              <div className="text-sm text-muted-foreground">Field assessment completed on March 22, 2025</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0045 - Educational Support</div>
              <div className="text-sm text-muted-foreground">Report submitted on March 21, 2025</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">BGF-2309-0018 - Food Assistance</div>
              <div className="text-sm text-muted-foreground">Verification completed on March 20, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldWork;
