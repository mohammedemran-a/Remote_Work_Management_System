import { api } from "./axios";

export interface Settings {
  [key: string]: string | number | boolean | File | null | undefined;
}

// ==========================
// 📌 جلب الإعدادات
// ==========================
export const getSettings = async (): Promise<Record<string, string | boolean>> => {
  const response = await api.get<Record<string, string | boolean>>("/settings");
  return response.data;
};

// ==========================
// 📌 تحديث الإعدادات
// ==========================
export const updateSettings = async (data: Settings) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // تحويل القيم boolean إلى "true"/"false"
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    formData.append(key, String(value));
  });

  const response = await api.post("/settings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data as { message: string };
};
