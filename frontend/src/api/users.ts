import { api } from "./axios";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// جلب كل المستخدمين
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في جلب المستخدمين" };
  }
};

// إنشاء مستخدم جديد
export const createUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await api.post("/users", { name, email, password });
    return response.data.user;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في إنشاء المستخدم" };
  }
};

// تعديل مستخدم
export const updateUser = async (id: number, data: Partial<User> & { password?: string }): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في تعديل المستخدم" };
  }
};

// حذف مستخدم
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في حذف المستخدم" };
  }
};
