import { create } from "zustand";
import { AxiosError } from "axios";
import { User, fetchUsers, createUser, updateUser, deleteUser } from "@/api/users";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;

  loadUsers: () => Promise<void>;
  addUser: (name: string, email: string, password: string) => Promise<void>;
  editUser: (id: number, data: Partial<User> & { password?: string }) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  error: null,

  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await fetchUsers();
      set({ users, loading: false });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في جلب المستخدمين", loading: false });
    }
  },

  addUser: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await createUser(name, email, password);
      set((state) => ({ users: [...state.users, user], loading: false }));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في إنشاء المستخدم", loading: false });
    }
  },

  editUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false
      }));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في تعديل المستخدم", loading: false });
    }
  },

  removeUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false
      }));
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({ error: error.response?.data?.message || "خطأ في حذف المستخدم", loading: false });
    }
  },
}));
