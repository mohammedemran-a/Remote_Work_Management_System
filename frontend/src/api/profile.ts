// src/api/profile.ts
import { api } from "./axios";

/**
 * 🔹 جلب بيانات المستخدم + البروفايل
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

/**
 * 🔹 تحديث بيانات الحساب (الاسم + البريد الإلكتروني)
 * ➜ users table
 */
export const updateAccount = async (data: {
  name: string;
  email: string;
}) => {
  try {
    const response = await api.post("/profile/account", data);
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

/**
 * 🔹 تحديث بيانات الملف الشخصي (profiles table)
 * ➜ يدعم FormData لرفع الصورة
 */
export const updateMyProfile = async (
  data:
    | FormData
    | {
        job_title?: string;
        status?: string;
        joined_at?: string;
      }
) => {
  try {
    // ❗ لا نضع Content-Type يدويًا
    const response = await api.post("/profile/update", data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
