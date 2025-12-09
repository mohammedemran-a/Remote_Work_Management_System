// src/api/roles.ts
import { api as axiosInstance } from "./axios";

// =============================
// TYPES
// =============================
export interface Role {
  id: number;
  name: string;
  permissions: string[];   // نفس اللي يرجعه Laravel
  usersCount?: number;
  createdAt?: string;
}

// Laravel يرجع فقط array of strings → نعدّله
export type PermissionItem = string;

// ================================
// 🔹 جلب كل الأدوار
// ================================
export const getRoles = () => {
  return axiosInstance.get<Role[]>("/roles");
};

// ================================
// 🔹 جلب جميع الصلاحيات
// ================================
export const getPermissions = () => {
  return axiosInstance.get<PermissionItem[]>("/permissions");
};

// ================================
// 🔹 إنشاء دور جديد
// ================================
export const createRole = (role: { name: string; permissions: string[] }) => {
  return axiosInstance.post<Role>("/roles", role);
};

// ================================
// 🔹 تحديث دور
// ================================
export const updateRole = (id: number, role: { name: string; permissions: string[] }) => {
  return axiosInstance.put<Role>(`/roles/${id}`, role);
};

// ================================
// 🔹 حذف دور
// ================================
export const deleteRole = (id: number) => {
  return axiosInstance.delete(`/roles/${id}`);
};
