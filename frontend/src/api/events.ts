// src/api/events.ts

// --- استيراد axiosInstance من ملف الإعدادات المركزي ---
// هذا يفترض أن لديك ملف axios.ts أو axios.js كما في بقية المشروع
import { api as axiosInstance } from "./axios";

// --- واجهة (Interface) لتحديد شكل بيانات الحدث عند الإرسال ---
// هذه هي البيانات التي نرسلها إلى Laravel لإنشاء حدث جديد
export interface EventPayload {
  title: string;
  date: string; // يجب أن يكون نصًا بتنسيق 'yyyy-MM-dd'
  time?: string;
  duration?: string;
  type: string;
  location?: string;
  attendees?: string[];
  description?: string;
}

/**
 * دالة لجلب كل الأحداث من الخادم
 * @returns {Promise} - وعد يحتوي على استجابة axios
 */
export const getEvents = () => {
  // إرسال طلب GET إلى '/events' (سيتم دمج العنوان الأساسي من إعدادات axios)
  return axiosInstance.get("/events");
};

/**
 * دالة لإنشاء حدث جديد في الخادم
 * @param {EventPayload} data - كائن يحتوي على بيانات الحدث الجديد
 * @returns {Promise} - وعد يحتوي على استجابة axios
 */
export const createEvent = (data: EventPayload) => {
  // إرسال طلب POST إلى '/events' مع بيانات الحدث
  return axiosInstance.post("/events", data);
};

/**
 * دالة لتحديث حدث موجود في الخادم (للمستقبل)
 * @param {number} id - معرّف الحدث
 * @param {Partial<EventPayload>} data - كائن يحتوي على البيانات المراد تحديثها
 * @returns {Promise} - وعد يحتوي على استجابة axios
 */
export const updateEvent = (id: number, data: Partial<EventPayload>) => {
  return axiosInstance.put(`/events/${id}`, data);
};

/**
 * دالة لحذف حدث من الخادم (للمستقبل)
 * @param {number} id - معرّف الحدث
 * @returns {Promise} - وعد يحتوي على استجابة axios
 */
export const deleteEvent = (id: number) => {
  return axiosInstance.delete(`/events/${id}`);
};
