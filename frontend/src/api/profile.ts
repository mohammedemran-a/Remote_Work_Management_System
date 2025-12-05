import { api } from "./axios";

export const updateProfile = async (data: unknown) => {
  const response = await api.put("/user/update-profile", data);
  return response.data;
};

export const updatePassword = async (current_password: string, new_password: string) => {
  const response = await api.put("/user/update-password", {
    current_password,
    new_password,
  });
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const form = new FormData();
  form.append("avatar", file);

  const response = await api.post("/user/update-avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
