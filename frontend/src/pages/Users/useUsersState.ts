// src/pages/Users/useUsersState.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
  UserPayload, // سنقوم بتعديل كيفية استخدامه
} from "@/api/users";
import { getRoles, Role } from "@/api/roles";

/* ================= TYPES ================= */

// واجهة لبيانات النموذج (Form)
export interface FormData {
  name: string;
  email: string;
  password: string;
  department: string;
  roles: number[]; // النموذج الداخلي لا يزال يستخدم IDs لسهولة التعامل مع Checkboxes
}

/* ================= HOOK ================= */

export const useUsersState = () => {
  const { toast } = useToast();

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
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        fetchUsers(),
        getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        title: "خطأ في جلب البيانات",
        description: err.message || "فشل جلب المستخدمين أو الأدوار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ============== FILTERING ============== */

  const filteredUsers = useMemo(() =>
    (users || []).filter(
      (user) =>
        user && user.name && user.email && (
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    ), [users, searchTerm]
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
        roles: user.roles?.map(role => role.id) || [],
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

  /* ============== SAVE (CREATE/UPDATE) - (النسخة المصححة) ============== */

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email || (!selectedUser && !formData.password)) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }

    // 🟢 1. تحويل مصفوفة الـ IDs إلى مصفوفة من الأسماء
    const roleNames = formData.roles.map(roleId => {
      const role = roles.find(r => r.id === roleId);
      return role ? role.name : '';
    }).filter(Boolean); // لإزالة أي قيم فارغة في حالة عدم العثور على دور

    // 🟢 2. بناء الحمولة (Payload) بالأسماء بدلاً من الـ IDs
    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department || undefined, // أرسل undefined إذا كان فارغًا
      roles: roleNames, // ✅ إرسال مصفوفة الأسماء
      password: formData.password || undefined, // أرسل undefined إذا كان فارغًا
    };

    try {
      if (selectedUser) {
        // لا نرسل كلمة المرور عند التحديث إلا إذا تم تغييرها
        if (!payload.password) {
          delete payload.password;
        }
        await updateUser(selectedUser.id, payload);
        toast({ title: "تم التحديث", description: "تم تعديل المستخدم بنجاح" });
      } else {
        await createUser(payload as UserPayload);
        toast({ title: "تمت الإضافة", description: "تم إنشاء مستخدم جديد" });
      }

      setIsDialogOpen(false);
      await loadData();
    } catch (error: any) {
      const errorMessages = error.errors ? Object.values(error.errors).flat().join('\n') : (error.message || "فشل حفظ البيانات");
      toast({ title: "حدث خطأ", description: errorMessages, variant: "destructive" });
    }
  };

  /* ============== DELETE ============== */

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
      await loadData();
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "فشل حذف المستخدم", variant: "destructive" });
    } finally {
      setUserToDelete(null);
    }
  };

  // --- إرجاع كل ما تحتاجه المكونات ---
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
  };
};
