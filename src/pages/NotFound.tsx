
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-medium">Page not found</h2>
        </div>
        
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="pt-4">
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
