
import ThemeToggle from "@/components/theme/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-background text-foreground transition-colors duration-300">
      <div className="text-center w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to Bridging Gaps Foundation</h1>
        <p className="text-base sm:text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Index;
