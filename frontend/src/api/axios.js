import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// منع إرسال التوكن في register/login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // فقط أضف التوكن للطلبات التي تحتاج auth
  if (token && config.url !== "/register" && config.url !== "/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});