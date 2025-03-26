
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import SupportTypesSection from "@/components/home/SupportTypesSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  return (
    <div className="animate-fade-in w-full">
      <HeroSection />
      <StatsSection />
      <SupportTypesSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
};

export default Home;
