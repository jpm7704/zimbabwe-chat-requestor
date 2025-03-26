
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Stethoscope, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-elegant">Get the Support You Need</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            Our specialized healthcare and education programs now serve more communities with faster processing times
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
        </div>
      </div>
    </section>
  );
};

export default CTASection;
