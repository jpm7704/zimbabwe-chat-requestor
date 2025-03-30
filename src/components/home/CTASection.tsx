
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Stethoscope, GraduationCap, Home, Utensils, Droplet, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOtherServicesOpen, setIsOtherServicesOpen] = useState(false);
  
  const handleRequestClick = (type: string) => {
    if (isAuthenticated) {
      navigate(`/submit?type=${type}`);
    } else {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a request.",
        variant: "destructive",
      });
      navigate('/login');
    }
  };
  
  const handleEnquiryClick = (type: string) => {
    if (isAuthenticated) {
      navigate(`/submit?type=${type}&enquiry=true`);
    } else {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an enquiry.",
        variant: "destructive",
      });
      navigate('/login');
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-elegant">Complete Support Services</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            In addition to our core healthcare and education programs, we offer a variety of support services to meet the diverse needs of Zimbabwean communities
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Medical Assistance</h3>
              <p className="text-muted-foreground mb-4">
                Access to healthcare services, medications, and medical treatments for individuals and families in need.
              </p>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => handleRequestClick("medical_assistance")}
              >
                Apply for Medical Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Educational Support</h3>
              <p className="text-muted-foreground mb-4">
                School fees assistance, learning materials, and educational programs for students of all ages.
              </p>
              <Button 
                size="lg"
                className="w-full"
                onClick={() => handleRequestClick("educational_support")}
              >
                Apply for Education Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Collapsible 
            open={isOtherServicesOpen} 
            onOpenChange={setIsOtherServicesOpen}
            className="w-full mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="mb-6 w-full sm:w-auto">
                {isOtherServicesOpen ? "Hide Other Services" : "Explore Other Services"}
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOtherServicesOpen ? "rotate-90" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <Home className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Shelter Assistance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Housing support, home repairs, and emergency shelter services.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquiryClick("shelter_assistance")}
                  >
                    Make an Enquiry
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <Utensils className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Food Assistance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Emergency food supplies and nutrition support programs.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquiryClick("food_assistance")}
                  >
                    Make an Enquiry
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <Droplet className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Water & Sanitation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clean water access, sanitation facilities, and hygiene education.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquiryClick("water_sanitation")}
                  >
                    Make an Enquiry
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Community Development</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for community infrastructure and development initiatives.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquiryClick("community_development")}
                  >
                    Make an Enquiry
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Emergency Relief</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assistance after natural disasters or other emergencies.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquiryClick("disaster_relief")}
                  >
                    Make an Enquiry
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
