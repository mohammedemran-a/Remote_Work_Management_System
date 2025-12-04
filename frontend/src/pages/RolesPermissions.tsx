import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
}

const RolesPermissions = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roles: Role[] = [
    {
      id: 1,
      name: "مدير عام",
      description: "صلاحيات كاملة على النظام",
      usersCount: 2,
      permissions: ["all"],
    },
    {
      id: 2,
      name: "مشرف مشروع",
      description: "إدارة المشاريع والمهام",
      usersCount: 5,
      permissions: ["projects", "tasks", "team"],
    },
    {
      id: 3,
      name: "عضو فريق",
      description: "عرض وتحديث المهام المخصصة",
      usersCount: 15,
      permissions: ["tasks_view", "tasks_update"],
    },
  ];

  const permissions = [
    { id: "projects", label: "إدارة المشاريع", category: "المشاريع" },
    { id: "projects_create", label: "إنشاء مشاريع", category: "المشاريع" },
    { id: "projects_edit", label: "تعديل مشاريع", category: "المشاريع" },
    { id: "projects_delete", label: "حذف مشاريع", category: "المشاريع" },
    { id: "tasks", label: "إدارة المهام", category: "المهام" },
    { id: "tasks_view", label: "عرض المهام", category: "المهام" },
    { id: "tasks_create", label: "إنشاء مهام", category: "المهام" },
    { id: "tasks_update", label: "تحديث المهام", category: "المهام" },
    { id: "tasks_delete", label: "حذف المهام", category: "المهام" },
    { id: "team", label: "إدارة الفريق", category: "الفريق" },
    { id: "team_invite", label: "دعوة أعضاء", category: "الفريق" },
    { id: "team_remove", label: "إزالة أعضاء", category: "الفريق" },
    { id: "files", label: "إدارة الملفات", category: "الملفات" },
    { id: "files_upload", label: "رفع ملفات", category: "الملفات" },
    { id: "files_delete", label: "حذف ملفات", category: "الملفات" },
    { id: "reports", label: "عرض التقارير", category: "التقارير" },
    { id: "reports_export", label: "تصدير التقارير", category: "التقارير" },
    { id: "settings", label: "إدارة الإعدادات", category: "الإعدادات" },
  ];

  const handleDeleteRole = (roleId: number) => {
    toast({
      title: "تم الحذف",
      description: "تم حذف الدور بنجاح",
    });
  };

  const handleSaveRole = () => {
    setIsDialogOpen(false);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الدور وصلاحياته بنجاح",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الأدوار والصلاحيات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة أدوار المستخدمين وتحديد الصلاحيات
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة دور جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة دور جديد</DialogTitle>
              <DialogDescription>
                قم بإنشاء دور جديد وتحديد الصلاحيات المناسبة له
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">اسم الدور</Label>
                <Input id="role-name" placeholder="مثال: محرر المحتوى" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description">الوصف</Label>
                <Input
                  id="role-description"
                  placeholder="وصف مختصر للدور وصلاحياته"
                />
              </div>

              <div className="space-y-4">
                <Label>الصلاحيات</Label>
                {["المشاريع", "المهام", "الفريق", "الملفات", "التقارير", "الإعدادات"].map(
                  (category) => (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="text-base">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {permissions
                            .filter((p) => p.category === category)
                            .map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2 space-x-reverse"
                              >
                                <Checkbox id={permission.id} />
                                <label
                                  htmlFor={permission.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {permission.label}
                                </label>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveRole}>حفظ الدور</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="inline-block ml-2 h-5 w-5" />
            الأدوار المتاحة
          </CardTitle>
          <CardDescription>
            قائمة بجميع الأدوار وعدد المستخدمين في كل دور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الدور</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">
                  <Users className="inline-block ml-2 h-4 w-4" />
                  المستخدمين
                </TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {role.usersCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جدول الصلاحيات</CardTitle>
          <CardDescription>
            عرض تفصيلي لصلاحيات كل دور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصلاحية</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center">
                      {role.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.slice(0, 10).map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {permission.label}
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        {role.permissions.includes("all") ||
                        role.permissions.includes(permission.id) ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPermissions;
