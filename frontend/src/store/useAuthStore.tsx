import { create } from "zustand";
import { AxiosError } from "axios";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "@/api/auth";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
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
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

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

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiLogout();
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في تسجيل الخروج",
        loading: false,
      });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getCurrentUser();
      set({
        user: res.user,
        token: localStorage.getItem("token"),
        loading: false,
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        user: null,
        token: null,
        loading: false,
        error: error.response?.data?.message || "انتهت الجلسة",
      });
    }
  },

  // ✅ التابع المهم جدًا:
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
