import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRoles, getPermissions, createRole, deleteRole } from "@/api/roles";

// استيراد ترجمات الصلاحيات
import permissionsTranslation from "@/lang/permissions.json";

interface Role {
  id: number;
  name: string;
  usersCount: number;
  permissions: string[];
}

interface PermissionItem {
  name: string;
  label: string;
  category: string;
}

const RolesPermissions = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  // 🔹 دالة لتصنيف الصلاحيات حسب القسم
  const getCategoryFromPermission = (perm: string): string => {
    if (perm.startsWith("dashboard")) return "لوحة التحكم";
    if (perm.startsWith("users")) return "المستخدمين";
    if (perm.startsWith("roles")) return "الأدوار والصلاحيات";
    if (perm.startsWith("notifications")) return "الإشعارات";
    if (perm.startsWith("projects")) return "المشاريع";
    if (perm.startsWith("tasks")) return "المهام";
    if (perm.startsWith("team")) return "الفريق";
    if (perm.startsWith("files")) return "الملفات";
    if (perm.startsWith("reports")) return "التقارير";
    if (perm.startsWith("settings")) return "الإعدادات";
    return "عام";
  };

  // 🔹 جلب الأدوار
  const fetchRoles = useCallback(async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل جلب الأدوار";
      toast({ title: "خطأ", description: message });
    }
  }, [toast]);

  // 🔹 جلب الصلاحيات
  const fetchPermissions = useCallback(async () => {
    try {
      const res = await getPermissions();
      const mapped: PermissionItem[] = res.data.map((p: string) => ({
        name: p,
        label: permissionsTranslation[p] || p, // استخدام الترجمة من الملف
        category: getCategoryFromPermission(p),
      }));
      setPermissions(mapped);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل جلب الصلاحيات";
      toast({ title: "خطأ", description: message });
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  // 🔹 حذف دور
  const handleDeleteRole = async (roleId: number) => {
    try {
      await deleteRole(roleId);
      toast({ title: "تم الحذف", description: "تم حذف الدور بنجاح" });
      fetchRoles();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "فشل حذف الدور أو الدور مرتبط بمستخدمين";
      toast({ title: "خطأ", description: message });
    }
  };

  // 🔹 حفظ دور جديد
  const handleSaveRole = async () => {
    if (!newRoleName || newRolePermissions.length === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الدور واختيار الصلاحيات",
      });
      return;
    }
    try {
      await createRole({ name: newRoleName, permissions: newRolePermissions });
      toast({ title: "تم الحفظ", description: "تم حفظ الدور وصلاحياته بنجاح" });
      setIsDialogOpen(false);
      setNewRoleName("");
      setNewRolePermissions([]);
      fetchRoles();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "فشل حفظ الدور أو صلاحيات غير موجودة";
      toast({ title: "خطأ", description: message });
    }
  };

  const togglePermission = (perm: string) => {
    setNewRolePermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  // 🔹 الأقسام الجديدة مع السابقة
  const roleCategories = [
    "لوحة التحكم",
    "المستخدمين",
    "الأدوار والصلاحيات",
    "الإشعارات",
    "المشاريع",
    "المهام",
    "الفريق",
    "الملفات",
    "التقارير",
    "الإعدادات",
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* زر إضافة دور جديد */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الأدوار والصلاحيات</h1>
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
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">اسم الدور</Label>
                <Input
                  id="role-name"
                  placeholder="مثال: محرر المحتوى"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>الصلاحيات</Label>
                {roleCategories.map((category) => (
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
                              key={permission.name}
                              className="flex items-center space-x-2 space-x-reverse"
                            >
                              <Checkbox
                                id={permission.name}
                                checked={newRolePermissions.includes(permission.name)}
                                onCheckedChange={() => togglePermission(permission.name)}
                              />
                              <label
                                htmlFor={permission.name}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {permission.label}
                              </label>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

      {/* الأدوار */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="inline-block ml-2 h-5 w-5" />
            الأدوار المتاحة
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الدور</TableHead>
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

      {/* جدول الصلاحيات */}
      <Card>
        <CardHeader>
          <CardTitle>جدول الصلاحيات</CardTitle>
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
                {permissions.map((permission) => (
                  <TableRow key={permission.name}>
                    <TableCell className="font-medium">{permission.label}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        {role.permissions.includes("all") ||
                        role.permissions.includes(permission.name) ? (
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
