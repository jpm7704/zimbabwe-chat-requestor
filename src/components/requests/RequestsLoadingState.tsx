
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface RequestsLoadingStateProps {
  count?: number;
}

const RequestsLoadingState = ({ count = 4 }: RequestsLoadingStateProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
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
      ))}
    </>
  );
};

export default RequestsLoadingState;
