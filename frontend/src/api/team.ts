// src/api/team.ts

import { api } from "./axios";
import { AxiosError } from "axios";
import { User } from "./users"; // 🟢 1. استيراد واجهة User من مصدرها الصحيح

/* ================= TYPES ================= */

// 🟢 2. تعريف الواجهة هنا لتكون المصدر الوحيد للحقيقة
export interface TeamMember {
  id: number;
  user_id: number;
  phone: string | null;
  location: string;
  join_date: string;
  // الحقول التالية قد لا تكون موجودة في كل الاستجابات، لذا نجعلها اختيارية
  status?: string;
  tasks_completed?: number;
  tasks_in_progress?: number;
  efficiency?: number;
  last_active?: string;
  user: User; // ✅ استخدام واجهة User المستوردة
}

// واجهة للبيانات التي نرسلها عند إضافة أو تعديل عضو
export interface TeamMemberPayload {
  user_id: number;
  location: string;
  join_date: string;
  department: string;
  phone: string | null;
}

// واجهة لرسائل الخطأ
interface ApiError {
  message: string;
}

/* ================= API FUNCTIONS ================= */

// --- دالة لجلب كل أعضاء الفريق ---
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await api.get<{ data: TeamMember[] }>("/team-members");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في جلب أعضاء الفريق" };
  }
};

// --- دالة لإضافة عضو جديد ---
export const addTeamMember = async (payload: TeamMemberPayload): Promise<TeamMember> => {
  try {
    const response = await api.post<{ data: TeamMember }>("/team-members", payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في إضافة العضو للفريق" };
  }
};

// --- دالة لتحديث عضو حالي ---
export const updateTeamMember = async (id: number, payload: Partial<TeamMemberPayload>): Promise<TeamMember> => {
  try {
    const response = await api.put<{ data: TeamMember }>(`/team-members/${id}`, payload);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في تحديث العضو" };
  }
};

// --- دالة لحذف عضو من الفريق ---
export const deleteTeamMember = async (id: number): Promise<void> => {
  try {
    await api.delete(`/team-members/${id}`);
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data || { message: "خطأ في إزالة العضو" };
  }
};
