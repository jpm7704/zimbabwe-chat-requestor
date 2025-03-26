
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-primary/5 pt-0 pb-16 md:pb-24 min-h-[100vh] flex items-center -mt-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center pt-24 md:pt-32">
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Zimbabwe <span className="text-primary">Community Support Initiative</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Supporting communities across Zimbabwe through medical, educational, financial, 
            and emergency relief assistance programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-6">
              <Link to="/submit?action=new">
                Start New Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6">
              <Link to="/requests">
                Track Existing Request
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
