// src/api/projectFiles.ts
import { api as axiosInstance } from "./axios";

// =============================
// TYPES
// =============================
export interface ProjectFilePayload {
  file?: File;            // الملف نفسه عند الرفع
  project_id: number;
  shared?: boolean;
  name?: string;          // لتحديث الاسم أو للرفع
  type?: string;          // نوع الملف عند الرفع
}

export interface ProjectFile {
  id: number;
  name: string;
  path: string;
  type?: string; 
  size: number;
  project_id: number;
  uploaded_by: number;
  shared: boolean;
  downloads: number;
  created_at: string;
  updated_at: string;

  // معلومات المستخدم الذي رفع الملف
  uploader?: {
    id: number;
    name: string;
    email?: string;
  };
}

// =============================
// API FUNCTIONS
// =============================
export const getProjectFiles = (projectId?: number) => {
  const params = projectId ? { project_id: projectId } : {};
  return axiosInstance.get<ProjectFile[]>("/project-files", { params });
};

export const getProjectFile = (id: number) => {
  return axiosInstance.get<ProjectFile>(`/project-files/${id}`);
};

export const uploadProjectFile = (data: ProjectFilePayload) => {
  const formData = new FormData();

  if (data.file) formData.append("file", data.file);
  formData.append("project_id", data.project_id.toString());
  if (data.shared !== undefined) formData.append("shared", data.shared ? "1" : "0");
  if (data.name) formData.append("name", data.name);
  if (data.type) formData.append("type", data.type);

  return axiosInstance.post("/project-files", formData);
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
