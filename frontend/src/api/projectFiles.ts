// src/api/projectFiles.ts
import { api as axiosInstance } from "./axios";

export interface ProjectFilePayload {
  file?: File;            // الملف نفسه عند الرفع
  project_id: number;
  shared?: boolean;
  name?: string;          // لتحديث الاسم
}

export interface ProjectFile {
  id: number;
  name: string;
  path: string;
  type: string;
  size: number;
  project_id: number;
  uploaded_by: number;
  shared: boolean;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export const getProjectFiles = (projectId?: number) => {
  const params = projectId ? { project_id: projectId } : {};
  return axiosInstance.get<ProjectFile[]>("/project-files", { params });
};

export const getProjectFile = (id: number) => {
  return axiosInstance.get<ProjectFile>(`/project-files/${id}`);
};

export const uploadProjectFile = (data: ProjectFilePayload) => {
  const formData = new FormData();

  if (data.file) {
    formData.append("file", data.file);
  }
  formData.append("project_id", data.project_id.toString());
  if (data.shared !== undefined) formData.append("shared", data.shared.toString());

  return axiosInstance.post("/project-files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProjectFile = (id: number, data: Partial<ProjectFilePayload>) => {
  return axiosInstance.put(`/project-files/${id}`, data);
};

export const deleteProjectFile = (id: number) => {
  return axiosInstance.delete(`/project-files/${id}`);
};

export const downloadProjectFile = (id: number) => {
  return axiosInstance.get(`/project-files/${id}/download`, {
    responseType: "blob", // مهم لتحميل الملف
  });
};
