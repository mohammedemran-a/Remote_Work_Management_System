// src/api/dashboard.ts
import { api } from "./axios";

export interface DashboardStat {
  title: string;
  value: number;
}

export interface RecentProject {
  id: number;
  name: string;
  progress: number;
  status: string;
  dueDate: string | null;
}

export interface RecentTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: string;
}

export interface DashboardResponse {
  stats: DashboardStat[];
  recentProjects: RecentProject[];
  recentTasks: RecentTask[];
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const { data } = await api.get("/dashboard");
  return data;
};
