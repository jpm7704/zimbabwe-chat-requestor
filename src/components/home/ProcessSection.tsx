
import { ArrowRight, MessageSquare, Users, BarChart3, CheckCircle, Clock } from "lucide-react";

const ProcessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Improved Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've streamlined our application process to ensure faster response times and more efficient support delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit Request</h3>
            <p className="text-muted-foreground">Complete our simplified application with required documentation</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Initial Assessment</h3>
            <p className="text-muted-foreground">24-hour initial review by our dedicated assessment team</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Approval & Delivery</h3>
            <p className="text-muted-foreground">Fast-tracked approval and efficient assistance delivery</p>
          </div>

          <div className="hidden md:flex items-center justify-center col-span-5 pt-4">
            <CheckCircle className="text-primary h-12 w-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
