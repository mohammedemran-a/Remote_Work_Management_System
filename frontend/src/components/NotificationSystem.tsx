import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, BellRing, CheckCircle, AlertCircle, MessageSquare, Calendar, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/api/notifications";

interface Notification {
  id: string; // Laravel notification ID
  data: {
    title: string;
    message: string;
    type: "task" | "meeting" | "message" | "update" | "team";
  };
  read_at: string | null;
  created_at: string;
}

const NotificationSystem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    tasks: true,
    meetings: true,
    messages: true,
    updates: false
  });

  /* =========================
     Fetch notifications
  ========================= */
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
  });

  const unreadCount = notifications.filter(n => !n.read_at).length;

  /* =========================
     Mutations
  ========================= */
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id: string) => {
      queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
        old?.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n) || []
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
        old?.map(n => ({ ...n, read_at: new Date().toISOString() })) || []
      );
      toast({
        title: "تم تحديث الإشعارات",
        description: "تم وضع علامة 'مقروء' على جميع الإشعارات",
      });
    },
  });

  /* =========================
     Helpers
  ========================= */
  const getTypeColor = (type: string) => {
    const colors = {
      task: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      meeting: "bg-green-500/10 text-green-600 dark:text-green-400",
      message: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      update: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      team: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
    };
    return colors[type as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      task: "مهمة",
      meeting: "اجتماع",
      message: "رسالة",
      update: "تحديث",
      team: "فريق"
    };
    return labels[type as keyof typeof labels] || "عام";
  };

  /* =========================
     UI
  ========================= */
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            نظام الإشعارات الذكي
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ابقَ على اطلاع دائم بأهم التحديثات والمهام في فريقك مع نظام إشعارات متقدم وقابل للتخصيص.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <BellRing className="w-6 h-6 text-primary" />
                    الإشعارات
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button 
                    onClick={() => markAllAsReadMutation.mutate()} 
                    variant="outline" 
                    size="sm"
                    disabled={unreadCount === 0}
                  >
                    وضع علامة مقروء للكل
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-center text-muted-foreground">جارٍ تحميل الإشعارات...</p>
                ) : (
                  notifications.map((notification) => {
                    const NotificationIcon = (() => {
                      switch(notification.data.type) {
                        case "task": return CheckCircle;
                        case "meeting": return Calendar;
                        case "message": return MessageSquare;
                        case "update": return AlertCircle;
                        case "team": return Users;
                        default: return Bell;
                      }
                    })();

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          notification.read_at 
                            ? 'bg-muted/50 border-border' 
                            : 'bg-card border-primary/20 shadow-sm'
                        }`}
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <NotificationIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold text-sm ${
                                notification.read_at ? 'text-muted-foreground' : 'text-foreground'
                              }`}>
                                {notification.data.title}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getTypeColor(notification.data.type)}`}
                              >
                                {getTypeLabel(notification.data.type)}
                              </Badge>
                              {!notification.read_at && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className={`text-xs mb-2 text-muted-foreground`}>
                              {notification.data.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.created_at}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Settings className="w-6 h-6 text-primary" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">طرق التنبيه:</h4>
                  <div className="space-y-3">
                    {["email", "push", "sms"].map((key) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {key === "email" ? "البريد الإلكتروني" : key === "push" ? "إشعارات فورية" : "رسائل نصية"}
                        </span>
                        <Switch 
                          checked={settings[key as keyof typeof settings]}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">أنواع الإشعارات:</h4>
                  <div className="space-y-3">
                    {["tasks", "meetings", "messages", "updates"].map((key) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {key === "tasks" ? "المهام الجديدة" : key === "meetings" ? "الاجتماعات" : key === "messages" ? "الرسائل" : "تحديثات المشروع"}
                        </span>
                        <Switch 
                          checked={settings[key as keyof typeof settings]}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Bell className="w-6 h-6 text-primary" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">غير مقروءة:</span>
                  <Badge variant="destructive">{unreadCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">اليوم:</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">هذا الأسبوع:</span>
                  <Badge variant="secondary">24</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationSystem;
