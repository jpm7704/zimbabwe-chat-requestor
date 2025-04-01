
import { useEffect, useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useUnreadNotificationsCount } from '@/hooks/useNotifications';

interface NotificationBadgeProps {
  onClick: () => void;
}

const NotificationBadge = ({ onClick }: NotificationBadgeProps) => {
  const { userProfile } = useAuth();
  const { unreadCount, isLoading } = useUnreadNotificationsCount();
  const [isAnimating, setIsAnimating] = useState(false);
  const count = typeof unreadCount === 'number' ? unreadCount : 0;

  // Add animation when new notifications arrive
  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  // Don't show for regular users who don't receive notifications
  if (!userProfile || userProfile.role === 'user') {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`${count || 0} unread notifications`}
      >
        {count > 0 ? (
          <BellRing className={`h-5 w-5 ${isAnimating ? 'text-primary animate-bounce' : 'text-primary'}`} />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        
        {count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 h-5 min-w-[20px] flex items-center justify-center rounded-full"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </button>
    </div>
  );
};

export default NotificationBadge;
