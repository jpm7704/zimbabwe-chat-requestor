
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
import { useQuery } from "@tanstack/react-query";
import { fetchFieldWorkRequests } from "@/services/requestService";

const FieldWork = () => {
  const { userProfile, formatRole } = useAuth();
  const navigate = useNavigate();
  
  const { data: assignedRequests, isLoading, error } = useQuery({
    queryKey: ['fieldWorkRequests'],
    queryFn: fetchFieldWorkRequests
  });

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

  if (isLoading) return <div>Loading field work requests...</div>;
  if (error) return <div>Error loading requests: {error.message}</div>;

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
              <div className="text-3xl font-bold">
                {assignedRequests?.filter(r => r.status === 'assigned').length || 0}
              </div>
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
              <div className="text-3xl font-bold">
                {assignedRequests?.filter(r => r.status === 'completed').length || 0}
              </div>
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
              <div className="text-3xl font-bold">
                {assignedRequests?.filter(r => new Date(r.dueDate) < new Date(Date.now() + 48 * 60 * 60 * 1000)).length || 0}
              </div>
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
                {assignedRequests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No requests assigned to you at this time.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignedRequests?.map((request) => (
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

        {/* Removed recent activity section as it was mock data */}
      </div>
    </div>
  );
};

export default FieldWork;
