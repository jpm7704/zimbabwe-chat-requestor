
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-elegant">Need Assistance?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            Start your application today and take the first step towards receiving the support you need
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button asChild size="lg" className="h-12 px-8 font-serif">
              <Link to="/submit?type=medical_assistance" className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5" />
                Medical Assistance
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="h-12 px-8 font-serif">
              <Link to="/submit?type=educational_support" className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Educational Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
