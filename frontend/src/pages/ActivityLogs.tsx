// src/pages/ActivityLogs.tsx
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Activity,
  LogIn,
  LogOut,
  FileText,
  FolderPlus,
  Trash2,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getActivityLogs,
  deleteActivityLog,
  deleteMultipleActivityLogs,
} from "@/api/activitylogs";

// ===================== TYPES =====================
type ActivityType =
  | "login"
  | "logout"
  | "create"
  | "edit"
  | "delete"
  | "upload";

interface ApiUser {
  id: number;
  name: string;
}

interface ActivityLogResponse {
  id: number;
  user?: ApiUser | null;
  action: string;
  type: ActivityType;
  target?: string | null;
  created_at: string;
}

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  type: ActivityType;
  target?: string;
  timestamp: string;
}

type BadgeVariant = "default" | "secondary" | "destructive";

// ===================== FORMAT DATE =====================
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

// ===================== COMPONENT =====================
const ActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { toast } = useToast();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const canView = hasPermission("activities_view");
  const canDelete = hasPermission("activities_delete");

  // ===================== جلب البيانات =====================
  const loadLogs = useCallback(async () => {
    try {
      const response = await getActivityLogs(searchQuery, filterType);
      const records = response.data as ActivityLogResponse[];
      setLogs(
        records.map((log) => ({
          id: log.id,
          user: log.user?.name || "غير معروف",
          action: log.action,
          type: (
            [
              "login",
              "logout",
              "create",
              "edit",
              "delete",
              "upload",
            ] as ActivityType[]
          ).includes(log.type as ActivityType)
            ? (log.type as ActivityType)
            : "upload",
          target: log.target || "-",
          timestamp: log.created_at,
        }))
      );
    } catch {
      toast({
        title: "خطأ",
        description: "فشل تحميل السجلات",
        variant: "destructive",
      });
    }
  }, [searchQuery, filterType, toast]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // ===================== أيقونات الإجراء =====================
  const getActionIcon = (type: ActivityType) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "logout":
        return <LogOut className="h-4 w-4" />;
      case "create":
        return <FolderPlus className="h-4 w-4" />;
      case "edit":
        return <Edit className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      case "upload":
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // ===================== شارات الإجراء =====================
  const getActionBadge = (type?: ActivityType | string) => {
    const variants: Record<string, { variant: BadgeVariant; label: string }> = {
      login: { variant: "default", label: "دخول" },
      logout: { variant: "secondary", label: "خروج" },
      create: { variant: "default", label: "إنشاء" },
      edit: { variant: "default", label: "تعديل" },
      delete: { variant: "destructive", label: "حذف" },
      upload: { variant: "default", label: "رفع" },
    };

    const config = variants[type ?? ""];
    if (!config) return <Badge variant="secondary">غير معروف</Badge>;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // ===================== الفلترة =====================
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFilter = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // ===================== التحديد =====================
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredLogs.map((log) => log.id) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const isAllSelected =
    filteredLogs.length > 0 &&
    filteredLogs.every((log) => selectedIds.includes(log.id));

  // ===================== حذف =====================
  const handleDeleteSingle = async (id: number) => {
    try {
      await deleteActivityLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast({ title: "تم الحذف", description: "تم حذف السجل بنجاح" });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل حذف السجل",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteMultipleActivityLogs(selectedIds);
      setLogs((prev) => prev.filter((log) => !selectedIds.includes(log.id)));
      const count = selectedIds.length;
      setSelectedIds([]);
      toast({ title: "تم الحذف", description: `تم حذف ${count} سجل بنجاح` });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل حذف السجلات",
        variant: "destructive",
      });
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        🚫 لا تملك صلاحية عرض سجل الأنشطة
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">سجل الأنشطة</h1>
          <p className="text-muted-foreground mt-2">
            متابعة جميع الأحداث والعمليات داخل النظام
          </p>
        </div>

        <div className="flex gap-2">
          {canDelete && selectedIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف المحدد ({selectedIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من حذف {selectedIds.length} سجل؟ لا يمكن
                    التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* ✅ --- تم حذف زر التصدير من هنا --- ✅ */}
        </div>
      </div>

      {/* جدول السجلات */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="ml-2 h-4 w-4" />
                <SelectValue placeholder="تصفية حسب النوع" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="login">تسجيل الدخول</SelectItem>
                <SelectItem value="logout">تسجيل الخروج</SelectItem>
                <SelectItem value="create">إنشاء</SelectItem>
                <SelectItem value="edit">تعديل</SelectItem>
                <SelectItem value="delete">حذف</SelectItem>
                <SelectItem value="upload">رفع ملفات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الإجراء</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الهدف</TableHead>
                <TableHead className="text-right">التوقيت</TableHead>
                <TableHead className="text-right w-16">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(log.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(log.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.type)}
                      <span>{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.type)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.target}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl" className="text-right">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-right">
                              تأكيد الحذف
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-right">
                              هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن
                              هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row-reverse gap-2">
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSingle(log.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </CardContent>
      </Card>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي السجلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عمليات اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                logs.filter((l) => {
                  const logDate = new Date(l.timestamp).toDateString();
                  const today = new Date().toDateString();
                  return logDate === today;
                }).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المستخدمين النشطين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(logs.map((l) => l.user)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عمليات الحذف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {logs.filter((l) => l.type === "delete").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityLogs;
