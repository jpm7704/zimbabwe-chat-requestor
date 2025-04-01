
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { Check, FileText, Bell, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';
import { useMarkNotificationAsRead } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { markAsRead, isMarking } = useMarkNotificationAsRead(notification.id);
  const [isHovered, setIsHovered] = useState(false);

  // Format date for display and tooltip
  const formattedDate = format(new Date(notification.createdAt), 'PPp');
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  // Get the appropriate icon based on notification type
  const renderIcon = () => {
    switch (notification.type) {
      case 'document_upload':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'status_change':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'assignment':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead();
      onRead();
    }
    
    // If the notification has a link, navigate there
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-md cursor-pointer relative",
        notification.read ? 'bg-transparent' : 'bg-primary/5',
        isHovered && 'bg-muted'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          {renderIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-sm font-medium",
              notification.read ? 'text-muted-foreground' : 'text-foreground'
            )}>
              {notification.title}
            </p>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1" title={formattedDate}>{timeAgo}</p>
        </div>
      </div>
      
      {isHovered && !notification.read && (
        <Button 
          className="absolute top-2 right-2" 
          size="sm" 
          variant="ghost" 
          onClick={(e) => {
            e.stopPropagation();
            markAsRead().then(onRead);
          }}
          disabled={isMarking}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Mark as read</span>
        </Button>
      )}
    </div>
  );
};

export default NotificationItem;
