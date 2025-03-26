
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RequestTypeInfo } from "@/types";
import { getRequestTypes } from "@/services/requestService";

const SupportTypesSection = () => {
  const [requestTypes, setRequestTypes] = useState<RequestTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestTypes = async () => {
      try {
        const types = await getRequestTypes();
        setRequestTypes(types);
      } catch (error) {
        console.error("Error fetching request types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestTypes();
  }, []);

  const handleApplyNow = (type: string) => {
    navigate(`/submit?type=${type}&action=new`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Assistance Programs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer various assistance programs designed to help individuals and communities in need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))
          ) : (
            requestTypes.map((type) => (
              <Card 
                key={type.type} 
                className="group hover:border-primary/50 transition-all duration-300 cursor-pointer"
                onClick={() => handleApplyNow(type.type)}
              >
                <CardHeader>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription>
                    {type.requiredDocuments.length} document{type.requiredDocuments.length !== 1 ? 's' : ''} required
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary transition-colors duration-300">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportTypesSection;
