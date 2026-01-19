import { useState } from "react"; // 🗑️ سنحذف useCallback و useEffect إذا لم تكن هناك حاجة أخرى لهما
import {
  Bell,
  Check,
  CheckCheck,
  X,
  UserPlus,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/hooks/use-toast";
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notifications";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

// --------------------------------
// Types (No changes)
// --------------------------------
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

// --------------------------------
// Component
// --------------------------------
const Notifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthStore();

  const canView = hasPermission("notifications_view");
  const canDelete = hasPermission("notifications_delete");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  // 🗑️ 1. حذف حالة التحميل اليدوية
  // const [isLoading, setIsLoading] = useState(true);

  // 🗑️ 2. حذف دالة fetchNotifications غير المستخدمة
  // const fetchNotifications = useCallback(...)

  // --------------------------------
  // Fetch notifications with useQuery
  // --------------------------------
  // ✅ 3. استخدام isLoading و isError مباشرة من useQuery
  const {
    data: notifications = [],
    isLoading, // <-- هذا هو الذي سنستخدمه
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
    enabled: canView,
    retry: false,
  });

  // --------------------------------
  // Mutations (No changes needed here)
  // --------------------------------
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // --------------------------------
  // Helpers (No changes needed here)
  // --------------------------------
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const formatDate = (date: string) => new Date(date).toLocaleString("ar-EG");
  const getIcon = (type: string) => {
    switch (type) {
      case "task": return CheckCircle2;
      case "project": return FileText;
      case "team": return UserPlus;
      case "reminder": return Calendar;
      default: return Bell;
    }
  };
  const getColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500/10 text-blue-600";
      case "project": return "bg-purple-500/10 text-purple-600";
      case "team": return "bg-green-500/10 text-green-600";
      case "reminder": return "bg-orange-500/10 text-orange-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  // --------------------------------
  // Render Logic
  // --------------------------------
  if (!canView) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">
          ليس لديك صلاحية لعرض صفحة الإشعارات
        </p>
      </div>
    );
  }

  // ✅ 4. استخدام isLoading من useQuery لعرض الـ Skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 p-6" dir="rtl">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-28" />
            </div>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
            </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 py-10">
        حدث خطأ أثناء تحميل الإشعارات
      </p>
    );
  }

  // --------------------------------
  // Render Component (No changes from here on)
  // --------------------------------
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          الإشعارات
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </h1>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
            >
              <CheckCheck className="ml-2 h-4 w-4" />
              تعليم الكل كمقروء
            </Button>
          )}

          {notifications.length > 0 && canDelete && (
            <Button
              variant="destructive"
              onClick={() => setDeleteAllOpen(true)}
            >
              <X className="ml-2 h-4 w-4" />
              حذف الكل
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الإشعارات</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {notifications.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              لا توجد إشعارات حالياً
            </p>
          )}

          {notifications.map((n) => {
            const Icon = getIcon(n.type);

            return (
              <div
                key={n.id}
                className={`flex items-start justify-between p-4 rounded-lg border transition ${
                  !n.read_at ? "bg-primary/5" : "bg-background"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg ${getColor(n.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{n.data.title}</h3>
                    <p className="text-muted-foreground">{n.data.message}</p>
                    <small className="text-muted-foreground">
                      {formatDate(n.created_at)}
                    </small>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!n.read_at && (
                    <Button
                      size="icon"
                      variant="ghost"
                      title="تعليم كمقروء"
                      onClick={() => markAsReadMutation.mutate(n.id)}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  {canDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      title="حذف"
                      onClick={() => setDeleteId(n.id)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Dialogs (No changes) */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الإشعار نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteMutation.mutate(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع الإشعارات نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAllMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف الكل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;
