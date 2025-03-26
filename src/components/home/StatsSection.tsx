
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StatsSection = () => {
  return (
    <div className="container px-4 mx-auto mt-16 md:mt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass dark:glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">25,000+</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Individuals supported through our programs since 2020
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="glass dark:glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">12</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Specialized assistance programs now available
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="glass dark:glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">All 10</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Provinces of Zimbabwe served with expanded reach
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsSection;
