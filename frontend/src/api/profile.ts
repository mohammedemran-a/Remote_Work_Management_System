// src/api/profile.ts
import { api } from "./axios";

// جلب البروفايل
export const getMyProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// تحديث البروفايل
export const updateMyProfile = async (
  data: FormData | { job_title?: string; status?: string; joined_at?: string }
) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.post("/profile/update", data, {
      headers: {
        "Content-Type": isFormData
          ? "multipart/form-data"
          : "application/json",
      },
    });

    return response.data;

  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
