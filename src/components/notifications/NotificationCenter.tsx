
import { useState, useEffect } from 'react';
import { X, CheckCheck, Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationBadge from './NotificationBadge';
import NotificationItem from './NotificationItem';
import { useNotifications, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { Separator } from '@/components/ui/separator';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, isLoading, refetch } = useNotifications();
  const { markAllAsRead, isMarking } = useMarkAllNotificationsAsRead();
  
  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refetch();
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // When opening, refresh notifications
    if (open) {
      refetch();
    }
  };

  // Group notifications by date (today, yesterday, earlier this week, earlier)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const groupedNotifications = {
    today: notifications.filter(n => new Date(n.createdAt) >= today),
    yesterday: notifications.filter(n => {
      const date = new Date(n.createdAt);
      return date >= yesterday && date < today;
    }),
    thisWeek: notifications.filter(n => {
      const date = new Date(n.createdAt);
      return date >= lastWeek && date < yesterday;
    }),
    earlier: notifications.filter(n => new Date(n.createdAt) < lastWeek)
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div>
          <NotificationBadge onClick={() => setIsOpen(true)} />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </SheetTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead}
              disabled={isMarking || notifications.length === 0 || notifications.every(n => n.read)}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">You have no notifications</div>
          ) : (
            <div className="space-y-6">
              {groupedNotifications.today.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Today</h3>
                  <div className="space-y-1">
                    {groupedNotifications.today.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onRead={refetch}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {groupedNotifications.yesterday.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Yesterday</h3>
                  <div className="space-y-1">
                    {groupedNotifications.yesterday.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onRead={refetch}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {groupedNotifications.thisWeek.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Earlier this week</h3>
                  <div className="space-y-1">
                    {groupedNotifications.thisWeek.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onRead={refetch}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {groupedNotifications.earlier.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Earlier</h3>
                  <div className="space-y-1">
                    {groupedNotifications.earlier.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onRead={refetch}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
