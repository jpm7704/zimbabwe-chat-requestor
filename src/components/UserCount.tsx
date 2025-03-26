
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

/**
 * Displays a count of registered users
 */
const UserCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        setCount(count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) {
    return (
      <Badge variant="outline" className="gap-1 bg-muted/50">
        <Users size={14} />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-muted/50">
      <Users size={14} />
      {count !== null ? `${count} registered users` : "Unknown"}
    </Badge>
  );
};

export default UserCount;
