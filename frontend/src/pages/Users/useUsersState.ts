// src/pages/Users/useUsersState.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
  UserPayload,
} from "@/api/users";
import { getRoles, Role } from "@/api/roles";
import { useAuthStore } from "@/store/useAuthStore";

/* ================= TYPES ================= */
export interface FormData {
  name: string;
  email: string;
  password: string;
  department: string;
  roles: number[];
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

/* ================= HOOK ================= */
export const useUsersState = () => {
  const { toast } = useToast();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // --- الصلاحيات ---
  const canView = hasPermission("users_view");
  const canCreate = hasPermission("users_create");
  const canEdit = hasPermission("users_edit");
  const canDelete = hasPermission("users_delete");

  // --- حالات البيانات ---
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // --- حالات الواجهة ---
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // --- حالة النموذج ---
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    department: "",
    roles: [],
  });

  /* ============== DATA LOADING ============== */
  const loadData = useCallback(async () => {
    if (!canView) return;
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        fetchUsers(),
        getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error: unknown) {
      const err = error as ApiError;
      toast({
        title: "خطأ في جلب البيانات",
        description: err.message || "فشل جلب المستخدمين أو الأدوار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, canView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ============== FILTERING ============== */
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [users, searchTerm]
  );

  /* ============== DIALOG HANDLING ============== */
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        department: user.department || "",
        roles: user.roles?.map((r) => r.id) || [],
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        roles: roles.length > 0 ? [roles[0].id] : [],
      });
    }
    setIsDialogOpen(true);
  };

  /* ============== SAVE (CREATE/UPDATE) ============== */
  const handleSaveUser = async () => {
    if (selectedUser && !canEdit) {
      toast({ title: "🚫 ليس لديك صلاحية تعديل المستخدم", variant: "destructive" });
      return;
    }
    if (!selectedUser && !canCreate) {
      toast({ title: "🚫 ليس لديك صلاحية إضافة مستخدم جديد", variant: "destructive" });
      return;
    }

    if (!formData.name || !formData.email || (!selectedUser && !formData.password)) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const roleNames = formData.roles
      .map((id) => roles.find((r) => r.id === id)?.name)
      .filter(Boolean) as string[];

    const payload: UserPayload = {
      name: formData.name,
      email: formData.email,
      department: formData.department || undefined,
      roles: roleNames,
      password: formData.password || undefined,
    };

    try {
      if (selectedUser) {
        if (!payload.password) delete payload.password;
        await updateUser(selectedUser.id, payload);
        toast({ title: "تم التحديث", description: "تم تعديل المستخدم بنجاح" });
      } else {
        await createUser(payload);
        toast({ title: "تمت الإضافة", description: "تم إنشاء مستخدم جديد" });
      }

      setIsDialogOpen(false);
      await loadData();
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessages = err.errors
        ? Object.values(err.errors).flat().join("\n")
        : err.message || "فشل حفظ البيانات";

      toast({
        title: "حدث خطأ",
        description: errorMessages,
        variant: "destructive",
      });
    }
  };

  /* ============== DELETE ============== */
  const confirmDelete = async () => {
    if (!canDelete) {
      toast({ title: "🚫 ليس لديك صلاحية حذف المستخدم", variant: "destructive" });
      return;
    }
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
      await loadData();
    } catch (error: unknown) {
      const err = error as ApiError;
      toast({
        title: "خطأ",
        description: err.message || "فشل حذف المستخدم",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  return {
    loading,
    users,
    roles,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    userToDelete,
    setUserToDelete,
    formData,
    setFormData,
    selectedUser,
    handleOpenDialog,
    handleSaveUser,
    confirmDelete,
    canView,
    canCreate,
    canEdit,
    canDelete,
  };
};
