
import ThemeToggle from "@/components/theme/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bridging Gaps Foundation</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Index;
