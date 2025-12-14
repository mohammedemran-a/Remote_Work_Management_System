import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Bell,
  CheckCheck,
  CheckCircle2,
  UserPlus,
  FileText,
  Calendar,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/api/notifications";

// -------------------------------
// Notification Interface
// -------------------------------
interface Notification {
  id: string;
  data: {
    title: string;
    message: string;
    project_id?: number;
    status?: string;
    manager_name?: string;
  };
  type: string;
  read_at: string | null;
  created_at: string;
}

// -------------------------------
// Component
// -------------------------------
const Notifications = () => {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Load Notifications
  // -----------------------------
  const loadNotifications = useCallback(async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الإشعارات",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // -----------------------------
  // Mark one notification as read
  // -----------------------------
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read_at: new Date().toISOString() } : item
        )
      );

      toast({
        title: "تم التحديث",
        description: "تم تعليم الإشعار كمقروء",
      });
    } catch {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء العملية",
        variant: "destructive",
      });
    }
  };

  // -----------------------------
  // Mark all notifications as read
  // -----------------------------
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read_at: new Date().toISOString(),
        }))
      );

      toast({
        title: "تم التحديث",
        description: "تم تعليم جميع الإشعارات كمقروءة",
      });
    } catch {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء العملية",
        variant: "destructive",
      });
    }
  };

  // -----------------------------
  // Date Formatter (12/12/2025, 10:43 PM)
  // -----------------------------
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // -----------------------------
  // Helpers
  // -----------------------------
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter((n) => !n.read_at);
    return notifications.filter((n) => n.type === type);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return CheckCircle2;
      case "project":
        return FileText;
      case "team":
        return UserPlus;
      case "reminder":
        return Calendar;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-500/10 text-blue-500";
      case "project":
        return "bg-purple-500/10 text-purple-500";
      case "team":
        return "bg-green-500/10 text-green-500";
      case "reminder":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "task":
        return "مهام";
      case "project":
        return "مشاريع";
      case "team":
        return "فريق";
      case "reminder":
        return "تذكير";
      default:
        return "عام";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-lg text-muted-foreground">
        جاري تحميل الإشعارات...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            الإشعارات
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            جميع إشعاراتك وتحديثاتك في مكان واحد
          </p>
        </div>

        <div>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="ml-2 h-4 w-4" />
            تعليم الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">الكل ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">غير مقروءة ({unreadCount})</TabsTrigger>
          <TabsTrigger value="task">المهام</TabsTrigger>
          <TabsTrigger value="project">المشاريع</TabsTrigger>
          <TabsTrigger value="team">الفريق</TabsTrigger>
          <TabsTrigger value="reminder">التذكيرات</TabsTrigger>
        </TabsList>

        {["all", "unread", "task", "project", "team", "reminder"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterNotifications(tab).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد إشعارات</p>
                </CardContent>
              </Card>
            ) : (
              filterNotifications(tab).map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <Card
                    key={notification.id}
                    className={`${
                      !notification.read_at
                        ? "border-r-4 border-r-primary bg-accent/5"
                        : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              {/* Title */}
                              <h3 className="font-semibold text-foreground">
                                {notification.data.title}
                              </h3>

                              {/* Message */}
                              <p className="text-muted-foreground text-sm mt-1">
                                {notification.data.message}
                              </p>

                              {/* Project ID */}
                              {notification.data.project_id && (
                                <p className="text-sm text-muted-foreground">
                                  رقم المشروع: {notification.data.project_id}
                                </p>
                              )}

                              {/* Status */}
                              {notification.data.status && (
                                <p className="text-sm text-muted-foreground">
                                  الحالة: {notification.data.status}
                                </p>
                              )}

                              {/* Manager Name */}
                              {notification.data.manager_name && (
                                <p className="text-sm text-muted-foreground">
                                  المشرف: {notification.data.manager_name}
                                </p>
                              )}
                            </div>

                            {!notification.read_at && (
                              <Badge className="mr-2">جديد</Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </span>
                            </div>

                            {!notification.read_at && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                <CheckCheck className="h-4 w-4 ml-1" />
                                تعليم كمقروء
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notifications;
