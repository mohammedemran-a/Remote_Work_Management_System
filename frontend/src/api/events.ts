import { api as axiosInstance } from "./axios";
import axios, { AxiosError } from "axios";

export interface EventPayload {
  title: string;
  date: string;
  time?: string;
  duration?: string;
  type: string;
  location?: string;
  attendees?: string[];
  description?: string;
}

// --- دالة لجلب كل الأحداث ---
export const getEvents = async () => {
  try {
    const response = await axiosInstance.get("/events");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching events:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

// --- دالة لإنشاء حدث جديد ---
export const createEvent = async (data: EventPayload) => {
  try {
    const response = await axiosInstance.post("/events", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating event:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

// --- دالة لتحديث حدث موجود ---
export const updateEvent = async (id: number, data: Partial<EventPayload>) => {
  try {
    const response = await axiosInstance.put(`/events/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error updating event ${id}:`, error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

// --- دالة لحذف حدث ---
export const deleteEvent = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting event ${id}:`, error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
    throw error;
  }
};
