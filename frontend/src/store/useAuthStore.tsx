import { create } from "zustand";
import { AxiosError } from "axios";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "@/api/auth";

// ✅ الخطوة 1: أضف تعريفًا للمشاريع داخل كائن المستخدم
interface UserProject {
  id: number;
  name: string;
  // يمكنك إضافة خصائص أخرى حسب ما يرسله الـ API
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  projects?: UserProject[]; // ✅ الخطوة 2: أضف الخاصية هنا
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;

  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // =====================
  // الحالة الابتدائية
  // =====================
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  // =====================
  // تسجيل الدخول
  // =====================
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiLogin(email, password);

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في تسجيل الدخول",
        loading: false,
      });
      throw error;
    }
  },

  // =====================
  // إنشاء حساب
  // =====================
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRegister(name, email, password);

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في التسجيل",
        loading: false,
      });
      throw error;
    }
  },

  // =====================
  // تسجيل الخروج
  // =====================
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiLogout();
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        loading: false,
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في تسجيل الخروج",
        loading: false,
      });
      throw error;
    }
  },

  // =====================
  // جلب المستخدم بعد Refresh
  // =====================
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getCurrentUser();

      set({
        user: res,
        token: localStorage.getItem("token"),
        loading: false,
      });
    } catch {
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        loading: false,
        error: "انتهت الجلسة",
      });
    }
  },

  // =====================
  // الصلاحيات
  // =====================
  hasPermission: (permission: string) => {
    const user = get().user;
    if (!user) return false;
    if (user.roles.includes("admin")) return true;
    return user.permissions.includes(permission);
  },

  hasRole: (role: string) => {
    const user = get().user;
    if (!user) return false;
    return user.roles.includes(role);
  },
}));
