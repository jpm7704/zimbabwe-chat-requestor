
import { Skeleton } from "@/components/ui/skeleton";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto space-y-4 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-72 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
