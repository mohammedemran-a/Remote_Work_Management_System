import { api } from "./axios";
import { AxiosError } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface ApiError {
  message: string;
}

// جلب كل المستخدمين
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    
    return response.data.users; // backend يعيد users داخل object
    
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في جلب المستخدمين" };
  }
};

// إنشاء مستخدم جديد مع الدور
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<User> => {
  try {
    const response = await api.post("/users", { name, email, password, role });
    return response.data.user;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في إنشاء المستخدم" };
  }
};

// تعديل مستخدم مع دعم الدور
export const updateUser = async (
  id: number,
  data: Partial<User> & { password?: string; role?: string }
): Promise<User> => {
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
