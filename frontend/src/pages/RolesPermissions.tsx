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
import { Shield, Plus, Edit, Trash2, Users, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getRoles,
  getPermissions,
  createRole,
  deleteRole,
  updateRole,
} from "@/api/roles";
import { useAuthStore } from "@/store/useAuthStore"; // <-- 1. استيراد useAuthStore

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
  const { hasPermission } = useAuthStore(); // <-- 2. الحصول على دالة التحقق من الصلاحيات

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // تعريف الصلاحيات المطلوبة
  const canView = hasPermission("roles_view");
  const canCreate = hasPermission("roles_create");
  const canEdit = hasPermission("roles_edit");
  const canDelete = hasPermission("roles_delete");
  const [isLoading, setIsLoading] = useState(true); // true لأنها تبدأ عند تحميل الصفحة

  const getCategoryFromPermission = (perm: string): string => {
    if (perm.startsWith("dashboard")) return "لوحة التحكم";
    if (perm.startsWith("users")) return "المستخدمين";
    if (perm.startsWith("roles")) return "الأدوار والصلاحيات";
    if (perm.startsWith("notifications")) return "الإشعارات";
    if (perm.startsWith("projects")) return "المشاريع";
    if (perm.startsWith("tasks")) return "المهام";
    if (perm.startsWith("activities")) return "الأنشطة";
    if (perm.startsWith("team")) return "الفريق";
    if (perm.startsWith("files")) return "الملفات";
    if (perm.startsWith("reports")) return "التقارير";
    if (perm.startsWith("settings")) return "الإعدادات";
    return "عام";
  };

  const fetchRoles = useCallback(async () => {
    try {
      const res = await getRoles();
      const mappedRoles = res.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions || [],
        usersCount: role.usersCount || 0,
      }));
      setRoles(mappedRoles);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل جلب الأدوار";
      toast({ title: "خطأ", description: message });
    }
  }, [toast]);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await getPermissions();
      const mapped: PermissionItem[] = res.map((p: string) => ({
        name: p,
        label: permissionsTranslation[p] || p,
        category: getCategoryFromPermission(p),
      }));
      setPermissions(mapped);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل جلب الصلاحيات";
      toast({ title: "خطأ", description: message });
    }
  }, [toast]);

  useEffect(() => {
    if (!canView) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchRoles(), fetchPermissions()]);
      } finally {
        setIsLoading(false); // بعد انتهاء التحميل
      }
    };

    fetchData();
  }, [canView, fetchRoles, fetchPermissions]);

  const handleDeleteRole = async (roleId: number) => {
    if (!canDelete) {
      toast({ title: "ممنوع", description: "ليس لديك صلاحية حذف الأدوار." });
      return;
    }
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

  const handleSaveRole = async () => {
    if (!newRoleName || newRolePermissions.length === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الدور واختيار الصلاحيات",
      });
      return;
    }

    try {
      if (editingRole) {
        if (!canEdit) {
          toast({
            title: "ممنوع",
            description: "ليس لديك صلاحية تعديل الأدوار.",
          });
          return;
        }
        await updateRole(editingRole.id, {
          name: newRoleName,
          permissions: newRolePermissions,
        });
        toast({ title: "تم التعديل", description: "تم تعديل الدور بنجاح" });
        setEditingRole(null);
      } else {
        if (!canCreate) {
          toast({
            title: "ممنوع",
            description: "ليس لديك صلاحية إنشاء الأدوار.",
          });
          return;
        }
        await createRole({
          name: newRoleName,
          permissions: newRolePermissions,
        });
        toast({
          title: "تم الحفظ",
          description: "تم حفظ الدور وصلاحياته بنجاح",
        });
      }

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
    "الأنشطة",
    "الإعدادات",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">
          جاري تحميل الأدوار والصلاحيات...
        </p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">
          ليس لديك صلاحية لعرض صفحة الأدوار والصلاحيات
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          الأدوار والصلاحيات
        </h1>

        {canCreate && (
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setEditingRole(null);
                setNewRoleName("");
                setNewRolePermissions([]);
              }
              setIsDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة دور جديد
              </Button>
            </DialogTrigger>

            <DialogContent
              className="max-w-3xl max-h-[80vh] overflow-y-auto"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? "تعديل الدور" : "إضافة دور جديد"}
                </DialogTitle>
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
                                  checked={newRolePermissions.includes(
                                    permission.name
                                  )}
                                  onCheckedChange={() =>
                                    togglePermission(permission.name)
                                  }
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                  }}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSaveRole}>
                  {editingRole ? "حفظ التعديل" : "حفظ الدور"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* جدول الأدوار */}
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
                {/* إظهار عمود الإجراءات فقط إذا كان هناك صلاحية للتعديل أو الحذف */}
                {(canEdit || canDelete) && (
                  <TableHead className="text-right">الإجراءات</TableHead>
                )}
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
                  {(canEdit || canDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <-- 5. التحقق من صلاحية التعديل */}
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingRole(role);
                              setNewRoleName(role.name);
                              setNewRolePermissions(role.permissions);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {/* <-- 6. التحقق من صلاحية الحذف */}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
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
                    <TableCell className="font-medium">
                      {permission.label}
                    </TableCell>
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