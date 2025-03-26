
import { ArrowRight, MessageSquare, Stethoscope, GraduationCap, CheckCircle } from "lucide-react";

const ProcessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Streamlined Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've simplified our application process for both medical and educational assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit Request</h3>
            <p className="text-muted-foreground">Complete our simple application with basic documentation</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <Stethoscope size={28} />
              <GraduationCap size={28} className="ml-[-8px]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Program Matching</h3>
            <p className="text-muted-foreground">We match you with the most appropriate medical or educational assistance</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rapid Approval</h3>
            <p className="text-muted-foreground">Fast-tracked approval and efficient assistance delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
