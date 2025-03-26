
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-background py-16 md:py-24 min-h-screen w-full flex items-center justify-center -mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
        <div className="max-w-5xl mx-auto text-center pt-24 md:pt-32">
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Zimbabwe <span className="text-primary">Healthcare & Education</span> Initiative
          </h1>
          <p className="mb-8 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Improving lives across Zimbabwe through focused medical assistance and educational support programs with streamlined application process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="h-12 px-6 w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Link to="/submit?action=new">
                Apply for Assistance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6 w-full sm:w-auto">
              <Link to="/requests">
                Track Your Application
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
