import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  roles: number[];
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

/* ================= CONSTANTS ================= */
const QUERY_KEYS = {
  users: ["users"],
  roles: ["roles"],
};

const CACHE_TIME = 1000 * 60 * 5; // 5 دقائق
const STALE_TIME = 1000 * 60 * 2; // دقيقتان

/* ================= HOOK ================= */
export const useUsersState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // --- الصلاحيات ---
  const canView = hasPermission("users_view");
  const canCreate = hasPermission("users_create");
  const canEdit = hasPermission("users_edit");
  const canDelete = hasPermission("users_delete");

  // --- حالات الواجهة ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // --- حالة النموذج ---
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    roles: [],
  });

  /* ============== REACT QUERY: جلب المستخدمين ============== */
  const {
    data: users = [],
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    enabled: canView, // لا تجلب البيانات إذا لم تكن لديك صلاحية
    staleTime: STALE_TIME, // البيانات تبقى طازجة لمدة دقيقتين
    gcTime: CACHE_TIME, // الاحتفاظ بالبيانات في الذاكرة لمدة 5 دقائق
    retry: 2, // إعادة المحاولة مرتين عند الفشل
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /* ============== REACT QUERY: جلب الأدوار ============== */
  const {
    data: roles = [],
    isLoading: loadingRoles,
  } = useQuery({
    queryKey: QUERY_KEYS.roles,
    queryFn: getRoles,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  const loading = loadingUsers || loadingRoles;

  /* ============== MUTATION: إنشاء مستخدم ============== */
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({ title: "تمت الإضافة", description: "تم إنشاء مستخدم جديد" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      const errorMessages = err.errors
        ? Object.values(err.errors).flat().join("\n")
        : err.message || "فشل حفظ البيانات";

      toast({
        title: "حدث خطأ",
        description: errorMessages,
        variant: "destructive",
      });
    },
  });

  /* ============== MUTATION: تحديث مستخدم ============== */
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      toast({ title: "تم التحديث", description: "تم تعديل المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      const errorMessages = err.errors
        ? Object.values(err.errors).flat().join("\n")
        : err.message || "فشل حفظ البيانات";

      toast({
        title: "حدث خطأ",
        description: errorMessages,
        variant: "destructive",
      });
    },
  });

  /* ============== MUTATION: حذف مستخدم ============== */
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setUserToDelete(null);
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast({
        title: "خطأ",
        description: err.message || "فشل حذف المستخدم",
        variant: "destructive",
      });
    },
  });

  /* ============== FILTERING ============== */
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  /* ============== HELPER FUNCTIONS ============== */
  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      roles: roles.length > 0 ? [roles[0].id] : [],
    });
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        roles: user.roles?.map((r) => r.id) || [],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  /* ============== SAVE (CREATE/UPDATE) ============== */
  const handleSaveUser = async () => {
    if (selectedUser && !canEdit) {
      toast({
        title: "🚫 ليس لديك صلاحية تعديل المستخدم",
        variant: "destructive",
      });
      return;
    }
    if (!selectedUser && !canCreate) {
      toast({
        title: "🚫 ليس لديك صلاحية إضافة مستخدم جديد",
        variant: "destructive",
      });
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
      roles: roleNames,
      password: formData.password || undefined,
    };

    if (selectedUser) {
      if (!payload.password) delete payload.password;
      updateMutation.mutate({ id: selectedUser.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  /* ============== DELETE ============== */
  const confirmDelete = async () => {
    if (!canDelete) {
      toast({
        title: "🚫 ليس لديك صلاحية حذف المستخدم",
        variant: "destructive",
      });
      return;
    }
    if (!userToDelete) return;

    deleteMutation.mutate(userToDelete);
  };

  /* ============== MANUAL REFETCH (للملف الشخصي) ============== */
  const refetchUsers = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
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
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchUsers, // للملف الشخصي
    usersError,
  };
};
