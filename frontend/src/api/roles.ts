// src/api/roles.ts
import { api as axiosInstance } from "./axios";
import { AxiosError } from "axios";

// =============================
// TYPES
// =============================
export interface Role {
  id: number;
  name: string;
  permissions?: string[]; // ✅ جعله اختياريًا لزيادة المرونة
  usersCount?: number;
  createdAt?: string;
}

export type PermissionItem = string;

// واجهة لرسائل الخطأ
interface ApiError {
  message: string;
}

// ================================
// 🔹 جلب كل الأدوار (النسخة المحسنة والآمنة)
// ================================
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await axiosInstance.get("/roles");

    // ✅ هذا هو الجزء الأهم: التعامل مع كل أشكال الاستجابة
    // إذا كانت البيانات مغلفة داخل { data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // إذا كانت البيانات عبارة عن مصفوفة مباشرة [...]
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // في حالة وجود استجابة غير متوقعة، أرجع مصفوفة فارغة
    return [];

  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error("Error fetching roles:", err.response?.data);
    throw err.response?.data || { message: "خطأ غير معروف في جلب الأدوار" };
  }
};

// ================================
// 🔹 جلب جميع الصلاحيات
// ================================
// (لا تغيير هنا، ولكن من الأفضل تحسينها بنفس الطريقة)
export const getPermissions = async (): Promise<PermissionItem[]> => {
  const response = await axiosInstance.get<PermissionItem[]>("/permissions");
  return response.data;
};

// ================================
// 🔹 إنشاء دور جديد
// ================================
export const createRole = async (role: { name: string; permissions: string[] }): Promise<Role> => {
  const response = await axiosInstance.post<Role>("/roles", role);
  return response.data;
};

// ================================
// 🔹 تحديث دور
// ================================
export const updateRole = async (id: number, role: { name: string; permissions: string[] }): Promise<Role> => {
  const response = await axiosInstance.put<Role>(`/roles/${id}`, role);
  return response.data;
};

// ================================
// 🔹 حذف دور
// ================================
export const deleteRole = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${id}`);
};
