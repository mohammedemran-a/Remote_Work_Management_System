import { create } from "zustand";
import { AxiosError } from "axios";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "@/api/auth";

interface User {
  id: number;
  name: string;
  email: string;
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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiLogin(email, password);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في تسجيل الدخول", loading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRegister(name, email, password);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في التسجيل", loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiLogout();
      set({ user: null, token: null, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في تسجيل الخروج", loading: false });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ user: null, token: null, loading: false, error: error.response?.data?.message || "خطأ في جلب البيانات" });
    }
  },
}));
