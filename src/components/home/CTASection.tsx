
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
          <h2 className="text-3xl font-serif font-bold mb-4 text-elegant">Need Assistance?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            Start your application today and take the first step towards receiving the support you need
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              className="h-12 px-8 font-serif"
              onClick={() => handleRequestClick("medical_assistance")}
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              Medical Assistance
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 font-serif"
              onClick={() => handleRequestClick("educational_support")}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Educational Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
