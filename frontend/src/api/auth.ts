import { api } from "./axios";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

// تسجيل الحساب
export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/register", { name, email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في التسجيل" };
  }
};

// تسجيل الدخول
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في تسجيل الدخول" };
  }
};

// تسجيل الخروج
export const logout = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في تسجيل الخروج" };
  }
};

// الحصول على بيانات المستخدم الحالي
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "لا يمكن جلب بيانات المستخدم" };
  }
};
