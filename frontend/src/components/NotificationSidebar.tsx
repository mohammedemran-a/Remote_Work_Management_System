import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  time: string;
}

const NotificationSidebar = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "مهمة جديدة", message: "تم تعيين مهمة جديدة لك", type: "info", read: false, time: "منذ 5 دقائق" },
    { id: 2, title: "تم إكمال المشروع", message: "تم إكمال مشروع التصميم بنجاح", type: "success", read: false, time: "منذ ساعة" },
    { id: 3, title: "تنبيه موعد", message: "اجتماع الفريق بعد 30 دقيقة", type: "warning", read: false, time: "منذ ساعتين" },
    { id: 4, title: "رسالة جديدة", message: "لديك رسالة جديدة من أحمد", type: "info", read: true, time: "منذ 3 ساعات" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-96 p-0" dir="rtl">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg font-semibold">الإشعارات</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} جديد
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead} 
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                تعليم الكل كمقروء
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={deleteAllNotifications} 
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 ml-1" />
                حذف الكل
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    !notification.read ? 'bg-accent/30' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                          title="تعليم كمقروء"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteNotification(notification.id)}
                        title="حذف"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary"
            onClick={() => {
              setNotificationsOpen(false);
              navigate("/notifications");
            }}
          >
            عرض جميع الإشعارات
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSidebar;
