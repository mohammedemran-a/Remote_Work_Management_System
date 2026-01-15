// src/api/task.ts

import { api as axiosInstance } from "./axios";
import { User } from "./users"; // تأكد من أن هذا الاستيراد صحيح ويعمل

// ========================================================================
// ✅ 1. الواجهات (Interfaces) - مع الإصلاح النهائي
// ========================================================================

export type TaskStatus = "جديدة" | "قيد التنفيذ" | "قيد المراجعة" | "مكتملة" | "متأخرة";

export interface TaskPayload {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: "عالية" | "متوسطة" | "منخفضة";
  assigned_to: number;
  project_id: number;
  due_date?: string | null;
}

// واجهة الاستجابة من الـ API
export interface TaskResponse extends TaskPayload {
  id: number;
  created_at: string;
  updated_at: string;
  review_notes?: string | null;

  // ✅✅✅====== هذا هو السطر الحاسم الذي كان ناقصًا ======✅✅✅
  // هذا يخبر TypeScript أن الـ API يرسل كائن المستخدم المسؤول مع المهمة
  assignee: User | null;
}

// واجهة بيانات مراجعة المهمة التي يتم إرسالها
export interface ReviewTaskPayload {
  action: 'approve' | 'reject';
  notes?: string;
}


// ========================================================================
// ✅ 2. الدوال الأساسية (CRUD) - لا تحتاج لتعديل
// ========================================================================

export const getTasks = async (): Promise<TaskResponse[]> => {
  const res = await axiosInstance.get<{ data: TaskResponse[] }>("/tasks");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const createTask = async (data: Partial<TaskPayload>): Promise<TaskResponse> => {
  const res = await axiosInstance.post<{ task: TaskResponse }>("/tasks", data);
  return res.data.task;
};

export const updateTask = async ({ id, data }: { id: number; data: Partial<TaskPayload> }): Promise<TaskResponse> => {
  const res = await axiosInstance.put<{ task: TaskResponse }>(`/tasks/${id}`, data);
  return res.data.task;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};


// ========================================================================
// ✅ 3. الدوال الإضافية - لا تحتاج لتعديل
// ========================================================================

export const getProjectTeamMembers = async (projectId: number): Promise<User[]> => {
  const res = await axiosInstance.get<User[]>(`/projects/${projectId}/team-members`);
  return res.data;
};

export const submitTaskForReview = async (taskId: number): Promise<TaskResponse> => {
  const res = await axiosInstance.post<{ task: TaskResponse }>(`/tasks/${taskId}/submit-review`);
  return res.data.task;
};

export const reviewTask = async ({ taskId, payload }: { taskId: number; payload: ReviewTaskPayload }): Promise<TaskResponse> => {
  const res = await axiosInstance.post<{ task: TaskResponse }>(`/tasks/${taskId}/review`, payload);
  return res.data.task;
};
