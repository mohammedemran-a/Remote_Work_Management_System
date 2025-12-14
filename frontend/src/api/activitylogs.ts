// src/api/activitylogs.ts
import { api } from "./axios";

// ==================== TypeScript Interfaces ====================
export interface ActivityLogUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogMeta {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip?: string;
  agent?: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string;
  type: string;
  target: string | number | null;
  meta: ActivityLogMeta | null;
  created_at: string;
  updated_at: string;
  user: ActivityLogUser | null;
}

export interface PaginatedActivityLogs {
  current_page: number;
  data: ActivityLog[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// ==================== جلب سجلات الأنشطة ====================
export const getActivityLogs = async (
  search: string = "",
  type: string = "all",
  page: number = 1
): Promise<PaginatedActivityLogs> => {
  try {
    const response = await api.get<PaginatedActivityLogs>("/activity-logs", {
      params: { search, type, page },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching activity logs:", error);
    throw new Error("فشل في جلب سجلات الأنشطة.");
  }
};

// ==================== حذف سجل واحد ====================
export const deleteActivityLog = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/activity-logs/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error deleting activity log ${id}:`, error);
    throw new Error("فشل في حذف السجل.");
  }
};

// ==================== حذف سجلات متعددة ====================
export const deleteMultipleActivityLogs = async (
  ids: number[]
): Promise<{ message: string }> => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("يرجى تمرير قائمة صحيحة من معرفات السجلات.");
  }

  try {
    const response = await api.delete<{ message: string }>(`/activity-logs`, { data: { ids } });
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting multiple activity logs:", error);
    throw new Error("فشل في حذف السجلات.");
  }
};
