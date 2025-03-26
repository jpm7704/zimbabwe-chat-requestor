
import { ArrowRight, MessageSquare, Users, BarChart3, CheckCircle } from "lucide-react";

const ProcessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process ensures efficient handling of your requests from submission to completion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit Request</h3>
            <p className="text-muted-foreground">Submit your request with all required documentation</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Field Officer Review</h3>
            <p className="text-muted-foreground">A field officer conducts due diligence and verification</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="text-muted-foreground" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Management Review</h3>
            <p className="text-muted-foreground">Program managers and management review and approve requests</p>
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
