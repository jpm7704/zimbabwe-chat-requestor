
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, BarChart3, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestTypeInfo } from "@/types";
import { getRequestTypes } from "@/services/requestService";

const Home = () => {
  const [requestTypes, setRequestTypes] = useState<RequestTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestTypes = async () => {
      try {
        const types = await getRequestTypes();
        setRequestTypes(types);
      } catch (error) {
        console.error("Error fetching request types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestTypes();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-primary/5 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Business Growth Fund <span className="text-primary">Zimbabwe</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Supporting entrepreneurs and businesses across Zimbabwe through funding, 
              mentorship, and training to drive economic growth and innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/chat">
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

        {/* Stats Section */}
        <div className="container px-4 mx-auto mt-16 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass dark:glass-dark border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">$10M+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  In funding provided to Zimbabwean businesses
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="glass dark:glass-dark border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">500+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Entrepreneurs supported across Zimbabwe
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="glass dark:glass-dark border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">5</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Provinces with active BGF support programs
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Types Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Can Support You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              BGF Zimbabwe offers various support programs designed to help businesses at different stages of growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading placeholders
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Actual request types
              requestTypes.map((type) => (
                <Card key={type.type} className="group hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>{type.name}</CardTitle>
                    <CardDescription>
                      {type.requiredDocuments.length} document{type.requiredDocuments.length !== 1 ? 's' : ''} required
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {type.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full group-hover:bg-primary transition-colors duration-300">
                      <Link to={`/chat?type=${type.type}`}>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
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

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your application today and take the first step towards growing your business with support from BGF Zimbabwe
            </p>
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/chat">
                Start New Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
