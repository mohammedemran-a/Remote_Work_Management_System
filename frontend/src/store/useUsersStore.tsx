import { create } from "zustand";
import { AxiosError } from "axios";
import {
  User,
  UserPayload,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/users";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;

  loadUsers: () => Promise<void>;
  addUser: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  editUser: (
    id: number,
    data: Partial<User> & { password?: string; role?: string }
  ) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  error: null,

  /* ================= LOAD ================= */
  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await fetchUsers();
      set({ users, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في جلب المستخدمين",
        loading: false,
      });
    }
  },

  /* ================= ADD ================= */
  addUser: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const payload: UserPayload = {
        name,
        email,
        password,
        roles: [role], // ✅ REQUIRED
      };

      const user = await createUser(payload);

      set((state) => ({
        users: [...state.users, user],
        loading: false,
      }));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في إنشاء المستخدم",
        loading: false,
      });
    }
  },

  /* ================= EDIT ================= */
  editUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const payload: UserPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: data.role ? [data.role] : [], // ✅
      };

      const updatedUser = await updateUser(id, payload);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? updatedUser : u
        ),
        loading: false,
      }));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في تعديل المستخدم",
        loading: false,
      });
    }
  },

  /* ================= DELETE ================= */
  removeUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "خطأ في حذف المستخدم",
        loading: false,
      });
    }
  },
}));
