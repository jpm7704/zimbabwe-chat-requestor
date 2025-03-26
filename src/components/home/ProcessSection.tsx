
import { ArrowRight, MessageSquare, Stethoscope, GraduationCap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center bg-transparent border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
                <MessageSquare size={28} />
              </div>
              <CardTitle className="text-xl mb-2">1. Submit Request</CardTitle>
              <CardDescription className="text-base">
                Complete our simple application form and upload basic documentation needed for your healthcare or education request
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
                <div className="relative">
                  <Stethoscope size={28} className="absolute -left-2" />
                  <GraduationCap size={28} className="absolute -right-2" />
                </div>
              </div>
              <CardTitle className="text-xl mb-2">2. Program Matching</CardTitle>
              <CardDescription className="text-base">
                Our team reviews your application and matches you with the most appropriate medical or educational assistance program
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
                <CheckCircle size={28} />
              </div>
              <CardTitle className="text-xl mb-2">3. Rapid Approval</CardTitle>
              <CardDescription className="text-base">
                Receive fast-tracked approval and efficient assistance delivery through our streamlined process
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
