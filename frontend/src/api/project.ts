// src/api/project.ts
import { api as axiosInstance } from "./axios";


export interface ProjectPayload {
  name: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
  manager_id: number;
}

export const getProjects = () => {
  return axiosInstance.get("/projects");
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
