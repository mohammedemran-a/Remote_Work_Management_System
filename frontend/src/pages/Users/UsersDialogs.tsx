// src/pages/Users/UsersDialogs.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/api/users";
import { Role } from "@/api/roles";
import { FormData } from "./useUsersState";
import { useAuthStore } from "@/store/useAuthStore";

// واجهة الخصائص (Props) التي يتلقاها المكون
interface UsersDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  userToDelete: number | null;
  setUserToDelete: (id: number | null) => void;
  selectedUser: User | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  roles: Role[];
  onSave: () => void;
  onDeleteConfirm: () => void;
}

export const UsersDialogs = ({
  isDialogOpen,
  setIsDialogOpen,
  userToDelete,
  setUserToDelete,
  selectedUser,
  formData,
  setFormData,
  roles,
  onSave,
  onDeleteConfirm,
}: UsersDialogsProps) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // دالة للتعامل مع تغيير الأدوار (Checkbox)
  const handleRoleChange = (roleId: number) => {
    const currentRoles = formData.roles;
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter(id => id !== roleId) // إزالة الدور إذا كان موجودًا
      : [...currentRoles, roleId]; // إضافة الدور إذا لم يكن موجودًا
    setFormData({ ...formData, roles: newRoles });
  };

  return (
    <>
      {/* ===== نافذة الإضافة والتعديل (تظهر فقط عند وجود صلاحية users_edit) ===== */}
      {hasPermission("users_edit") && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser ? "قم بتحديث بيانات المستخدم." : "أدخل بيانات المستخدم الجديد."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* حقل الاسم */}
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* حقل البريد الإلكتروني */}
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* حقل كلمة المرور (يظهر فقط عند الإضافة) */}
              {!selectedUser && (
                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              {/* حقل القسم */}
              <div>
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="مثال: التطوير، التسويق..."
                />
              </div>

              {/* حقل الأدوار (Checkboxes) */}
              <div>
                <Label>الأدوار</Label>
                <div className="space-y-2 mt-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={formData.roles.includes(role.id)}
                        onCheckedChange={() => handleRoleChange(role.id)}
                      />
                      <Label htmlFor={`role-${role.id}`} className="font-normal">
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={onSave}>
                {selectedUser ? "حفظ التعديلات" : "إضافة المستخدم"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ===== نافذة تأكيد الحذف (تظهر فقط عند وجود صلاحية users_delete) ===== */}
      {hasPermission("users_delete") && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
              <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم وبياناته بشكل نهائي.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
