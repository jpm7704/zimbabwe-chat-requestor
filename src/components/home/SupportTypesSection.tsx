
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Stethoscope, GraduationCap } from "lucide-react";
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
        // Fetch all request types but filter only for medical and educational
        const types = await getRequestTypes();
        const filteredTypes = types.filter(
          type => type.type === "medical_assistance" || type.type === "educational_support"
        );
        setRequestTypes(filteredTypes);
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

  const getIconForType = (type: string) => {
    switch (type) {
      case "medical_assistance":
        return <Stethoscope className="h-10 w-10 text-primary mb-4" />;
      case "educational_support":
        return <GraduationCap className="h-10 w-10 text-primary mb-4" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Assistance Programs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our focused programs are designed to deliver meaningful impact in healthcare and education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
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
                className="group hover:border-primary/50 transition-all duration-300 cursor-pointer glass dark:glass-dark"
                onClick={() => handleApplyNow(type.type)}
              >
                <CardHeader className="flex flex-col items-center">
                  {getIconForType(type.type)}
                  <CardTitle className="text-center">{type.name}</CardTitle>
                  <CardDescription className="text-center">
                    {type.requiredDocuments.filter(doc => doc.required).length} required documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
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
