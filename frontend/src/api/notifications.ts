// src/api/notifications.ts

import { api } from "./axios";

// ---------------------------------------------
// Get all notifications
// ---------------------------------------------
export const getAllNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// ---------------------------------------------
// Get unread notifications only
// ---------------------------------------------
export const getUnreadNotifications = async () => {
  const response = await api.get("/notifications/unread");
  return response.data;
};

// ---------------------------------------------
// Mark single notification as read
// ---------------------------------------------
export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.post(`/notifications/${notificationId}/read`);
  return response.data;
};

// ---------------------------------------------
// Mark all notifications as read
// ---------------------------------------------
export const markAllNotificationsAsRead = async () => {
  const response = await api.post("/notifications/read-all");
  return response.data;
};
