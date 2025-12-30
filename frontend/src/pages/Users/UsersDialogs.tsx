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
import { User } from "@/api/users";
import { Role } from "@/api/roles";
import { FormData } from "./useUsersState";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // تأكد من المسار الصحيح

// واجهة الخصائص (Props)
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

  return (
    <>
      {/* ===== نافذة الإضافة والتعديل ===== */}
      {hasPermission("users_edit") && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser
                  ? "قم بتحديث بيانات المستخدم."
                  : "أدخل بيانات المستخدم الجديد."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* الاسم */}
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* كلمة المرور (عند الإضافة فقط) */}
              {!selectedUser && (
                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}

              {/* الأدوار (Dropdown متعدد الاختيار باستخدام Radix UI Select) */}
              <div>
                <Label htmlFor="roles">الأدوار</Label>
                <Select
                  value={String(formData.roles[0] || "")}
                  onValueChange={(value) =>
                    setFormData({ ...formData, roles: [Number(value)] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/* ===== نافذة تأكيد الحذف ===== */}
      {hasPermission("users_delete") && (
        <AlertDialog
          open={!!userToDelete}
          onOpenChange={() => setUserToDelete(null)}
        >
          <AlertDialogContent dir="rtl" className="text-right">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right">
                هل أنت متأكد من الحذف؟
              </AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم وبياناته بشكل
                نهائي.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
