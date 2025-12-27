// src/api/team.ts
import { api } from "./axios";
import { AxiosError } from "axios";
import { User } from "./users"; 
import { Project } from "./project"; // ✅ الربط الصحيح بالملف أعلاه

/* ================= TYPES ================= */

export interface Team {
  id: number;
  name: string;
  description: string | null;
  leader_id: number;
  leader?: User;         
  members?: User[];      
  projects?: Project[]; // ✅ استخدام الواجهة المستوردة
  created_at?: string;
}

export interface TeamPayload {
  name: string;
  description?: string;
  leader_id: number;
  project_ids?: number[]; 
  member_ids?: number[];
  
}

export interface AddMemberPayload {
  team_id: number;
  user_id: number;
  role_in_team: 'Supervisor' | 'Member';
  status: string;
}

/* ================= API FUNCTIONS ================= */

const handleApiError = (error: any, defaultMessage: string) => {
  const err = error as AxiosError<{ message: string }>;
  return err.response?.data || { message: defaultMessage };
};

export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get<Team[]>("/teams");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "خطأ في جلب الفرق");
  }
};

export const createTeam = async (payload: TeamPayload): Promise<Team> => {
  try {
    const response = await api.post<Team>("/teams", payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "خطأ في إنشاء الفريق");
  }
};

export const addMemberToTeam = async (payload: AddMemberPayload): Promise<any> => {
  try {
    const response = await api.post("/team-members", payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "خطأ في إضافة العضو للفريق");
  }
};

export const deleteTeam = async (id: number): Promise<void> => {
  try {
    await api.delete(`/teams/${id}`);
  } catch (error) {
    throw handleApiError(error, "خطأ في حذف الفريق");
  }
};