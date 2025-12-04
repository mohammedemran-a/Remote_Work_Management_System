import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  UserPlus,
  FileText,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "task" | "project" | "team" | "reminder" | "system";
  read: boolean;
  timestamp: string;
  icon: any;
}

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "مهمة جديدة",
      message: "تم تعيين مهمة 'تصميم الواجهة الرئيسية' لك",
      type: "task",
      read: false,
      timestamp: "منذ 5 دقائق",
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: "تحديث المشروع",
      message: "تم تحديث حالة مشروع 'تطوير التطبيق' إلى قيد التنفيذ",
      type: "project",
      read: false,
      timestamp: "منذ 15 دقيقة",
      icon: FileText,
    },
    {
      id: 3,
      title: "عضو جديد",
      message: "انضم 'أحمد محمد' إلى فريق المشروع",
      type: "team",
      read: true,
      timestamp: "منذ ساعة",
      icon: UserPlus,
    },
    {
      id: 4,
      title: "تذكير اجتماع",
      message: "اجتماع الفريق سيبدأ بعد 30 دقيقة",
      type: "reminder",
      read: false,
      timestamp: "منذ ساعتين",
      icon: Calendar,
    },
    {
      id: 5,
      title: "رسالة جديدة",
      message: "لديك رسالة جديدة من 'فاطمة علي' في دردشة المشروع",
      type: "project",
      read: true,
      timestamp: "منذ 3 ساعات",
      icon: MessageSquare,
    },
    {
      id: 6,
      title: "تحديث النظام",
      message: "تم تحديث النظام إلى الإصدار 2.0",
      type: "system",
      read: true,
      timestamp: "منذ يوم",
      icon: AlertCircle,
    },
    {
      id: 7,
      title: "موعد نهائي قريب",
      message: "مهمة 'كتابة التوثيق' تستحق خلال يومين",
      type: "reminder",
      read: false,
      timestamp: "منذ يومين",
      icon: Clock,
    },
    {
      id: 8,
      title: "تعليق جديد",
      message: "علّق 'محمد خالد' على مهمتك 'مراجعة الكود'",
      type: "task",
      read: true,
      timestamp: "منذ 3 أيام",
      icon: MessageSquare,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    toast({
      title: "تم التحديث",
      description: "تم تعليم الإشعار كمقروء",
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast({
      title: "تم التحديث",
      description: "تم تعليم جميع الإشعارات كمقروءة",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف الإشعار بنجاح",
    });
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((notif) => !notif.read));
    toast({
      title: "تم الحذف",
      description: "تم حذف جميع الإشعارات المقروءة",
    });
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
      case "system":
        return "bg-gray-500/10 text-gray-500";
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
      case "system":
        return "نظام";
      default:
        return "عام";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === type);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            الإشعارات
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mr-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            جميع إشعاراتك وتحديثاتك في مكان واحد
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="ml-2 h-4 w-4" />
            تعليم الكل كمقروء
          </Button>
          <Button variant="outline" onClick={deleteAllRead}>
            <Trash2 className="ml-2 h-4 w-4" />
            حذف المقروءة
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">الكل ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            غير مقروءة ({unreadCount})
          </TabsTrigger>
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
              filterNotifications(tab).map((notification) => (
                <Card
                  key={notification.id}
                  className={`${
                    !notification.read ? "border-r-4 border-r-primary bg-accent/5" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        <notification.icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              {notification.message}
                            </p>
                          </div>

                          {!notification.read && (
                            <Badge className="mr-2">جديد</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCheck className="h-4 w-4 ml-1" />
                                تعليم كمقروء
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4 ml-1" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notifications;
