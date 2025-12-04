import { api as axiosInstance } from "./axios";

export interface TaskPayload {
  title: string;
  description?: string | null;
  status: "جديدة" | "قيد التنفيذ" | "مكتملة" | "متأخرة";
  priority: "عالية" | "متوسطة" | "منخفضة";
  assigned_to: number;
  project_id: number;
  due_date?: string | null;
}

export interface TaskResponse extends TaskPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export const getTasks = async (): Promise<TaskResponse[]> => {
  const res = await axiosInstance.get<TaskResponse[]>("/tasks");
  return res.data;
};

export const createTask = async (
  data: TaskPayload
): Promise<TaskResponse> => {
  const res = await axiosInstance.post<TaskResponse>("/tasks", data);
  return res.data;
};

export const updateTask = async ({
  id,
  data,
}: {
  id: number;
  data: TaskPayload;
}): Promise<TaskResponse> => {
  const res = await axiosInstance.put<TaskResponse>(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};
