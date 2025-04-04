
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Requests = () => {
  const [isLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Requests</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading requests...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center">
                <p>Please wait while we load your requests...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requests List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No requests found. This page will display all requests when available.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Requests;
