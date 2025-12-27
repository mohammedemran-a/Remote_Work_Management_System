import { api as axiosInstance } from "./axios";

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  manager_id: number;
  tasks_count?: number;
  users_count?: number;
  completedTasks?: number;
}

export interface ProjectPayload {
  name: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
  manager_id: number;
}

// تعديل لضمان إرجاع مصفوفة دائماً لتجنب خطأ .map is not a function
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get("/projects");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const getProject = (id: number) => {
  return axiosInstance.get(`/projects/${id}`);
};

export const createProject = (data: ProjectPayload) => {
  return axiosInstance.post("/projects", data);
};

export const updateProject = (id: number, data: Partial<ProjectPayload>) => {
  return axiosInstance.put(`/projects/${id}`, data);
};

export const deleteProject = (id: number) => {
  return axiosInstance.delete(`/projects/${id}`);
};