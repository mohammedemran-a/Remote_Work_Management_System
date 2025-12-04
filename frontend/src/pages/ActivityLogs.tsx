import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Search,
  Filter,
  Download,
  Activity,
  LogIn,
  LogOut,
  FileText,
  FolderPlus,
  Trash2,
  Edit,
  UserPlus,
} from "lucide-react";

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  type: "login" | "logout" | "create" | "edit" | "delete" | "upload";
  target?: string;
  timestamp: string;
  ip: string;
}

const ActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const logs: ActivityLog[] = [
    {
      id: 1,
      user: "أحمد محمد",
      action: "تسجيل الدخول",
      type: "login",
      timestamp: "2024-11-16 10:30:00",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      user: "فاطمة علي",
      action: "إنشاء مشروع جديد",
      type: "create",
      target: "مشروع تطوير الموقع",
      timestamp: "2024-11-16 10:25:00",
      ip: "192.168.1.101",
    },
    {
      id: 3,
      user: "محمد خالد",
      action: "تعديل مهمة",
      type: "edit",
      target: "تصميم الواجهة الرئيسية",
      timestamp: "2024-11-16 10:20:00",
      ip: "192.168.1.102",
    },
    {
      id: 4,
      user: "سارة أحمد",
      action: "رفع ملف",
      type: "upload",
      target: "تقرير شهري.pdf",
      timestamp: "2024-11-16 10:15:00",
      ip: "192.168.1.103",
    },
    {
      id: 5,
      user: "عمر حسن",
      action: "حذف مهمة",
      type: "delete",
      target: "مراجعة الكود القديم",
      timestamp: "2024-11-16 10:10:00",
      ip: "192.168.1.104",
    },
    {
      id: 6,
      user: "ليلى سعيد",
      action: "إضافة عضو جديد",
      type: "create",
      target: "يوسف أحمد",
      timestamp: "2024-11-16 10:05:00",
      ip: "192.168.1.105",
    },
    {
      id: 7,
      user: "خالد عبدالله",
      action: "تسجيل الخروج",
      type: "logout",
      timestamp: "2024-11-16 10:00:00",
      ip: "192.168.1.106",
    },
    {
      id: 8,
      user: "نورة محمد",
      action: "تعديل الإعدادات",
      type: "edit",
      target: "إعدادات البريد",
      timestamp: "2024-11-16 09:55:00",
      ip: "192.168.1.107",
    },
  ];

  const getActionIcon = (type: string) => {
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

  const getActionBadge = (type: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      login: { variant: "default", label: "دخول" },
      logout: { variant: "secondary", label: "خروج" },
      create: { variant: "default", label: "إنشاء" },
      edit: { variant: "default", label: "تعديل" },
      delete: { variant: "destructive", label: "حذف" },
      upload: { variant: "default", label: "رفع" },
    };

    const config = variants[type] || { variant: "default", label: "عملية" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const exportLogs = () => {
    const csvContent = logs.map(log => 
      `${log.timestamp},${log.user},${log.action},${log.target || "-"},${log.ip}`
    ).join("\n");
    
    const blob = new Blob([`التوقيت,المستخدم,الإجراء,الهدف,IP\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesFilter = filterType === "all" || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">سجل الأنشطة</h1>
          <p className="text-muted-foreground mt-2">
            متابعة جميع الأحداث والعمليات داخل النظام
          </p>
        </div>

        <Button onClick={exportLogs}>
          <Download className="ml-2 h-4 w-4" />
          تصدير السجلات
        </Button>
      </div>

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
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الإجراء</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الهدف</TableHead>
                <TableHead className="text-right">التوقيت</TableHead>
                <TableHead className="text-right">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.type)}
                      <span>{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.type)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.target || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ip}
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
              {logs.filter((l) => l.timestamp.includes("2024-11-16")).length}
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
