
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, GraduationCap } from "lucide-react";

const StatsSection = () => {
  return (
    <div className="container px-4 mx-auto mt-16 md:mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass dark:glass-dark border-primary/20">
          <CardHeader className="pb-2 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-4xl font-bold">15,000+</CardTitle>
              <CardDescription className="text-base mt-1">
                Students supported through our educational programs since 2020
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="glass dark:glass-dark border-primary/20">
          <CardHeader className="pb-2 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-4xl font-bold">10,000+</CardTitle>
              <CardDescription className="text-base mt-1">
                Individuals received medical assistance across Zimbabwe
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default StatsSection;
