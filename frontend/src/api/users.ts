// src/api/users.ts

import { api } from "./axios";
import { AxiosError } from "axios";

/* ================= TYPES ================= */

// واجهة Role يمكن استخدامها في أي مكان
export interface Role {
  id: number;
  name: string;
}

// 1. الواجهة الرئيسية للمستخدم (User Interface)
export interface User {
  id: number;
  name: string;
  email: string;
  department: string | null;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

// 2. واجهة الحمولة (Payload) التي يتم إرسالها إلى الـ API (النسخة المصححة)
export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  department?: string;
  roles: string[]; // ✅✅ التعديل الوحيد والمهم: يجب أن تكون مصفوفة من النصوص (أسماء الأدوار)
}

// واجهة لرسائل الخطأ من الـ API
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/* ================= API FUNCTIONS ================= */

// --- جلب كل المستخدمين ---
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<{ data: User[] }>("/users");
    // 🟢 التأكد من التعامل مع الاستجابة المغلفة
    return response.data.data || response.data; 
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error("Error fetching users:", err.response?.data);
    throw err.response?.data || { message: "خطأ غير معروف في جلب المستخدمين" };
  }
};

// --- إنشاء مستخدم جديد ---
export const createUser = async (payload: UserPayload): Promise<User> => {
  try {
    const response = await api.post<{ data: User }>("/users", payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error("Error creating user:", err.response?.data);
    throw err.response?.data || { message: "خطأ غير معروف في إنشاء المستخدم" };
  }
};

// --- تحديث مستخدم موجود ---
export const updateUser = async (id: number, payload: Partial<UserPayload>): Promise<User> => {
  try {
    const response = await api.put<{ data: User }>(`/users/${id}`, payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error("Error updating user:", err.response?.data);
    throw err.response?.data || { message: "خطأ غير معروف في تحديث المستخدم" };
  }
};

// --- حذف مستخدم ---
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error("Error deleting user:", err.response?.data);
    throw err.response?.data || { message: "خطأ غير معروف في حذف المستخدم" };
  }
};
