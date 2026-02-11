// src/api/chat.ts

import { api } from "./axios";
import { User } from "./users"; // تأكد من أن هذا الاستيراد صحيح

/* ================= TYPES ================= */

// 🟢 الحل: تعريف واجهة Project بشكل مبسط ومحلي هنا
// هذا التعريف يكفي لاحتياجات صفحة الدردشة فقط
interface Project {
  id: number;
  name: string;
}

// --- واجهات الدردشة ---

// الواجهة التي تصف شكل المحادثة كما تأتي من الـ API
export interface Conversation {
  id: number;
  name: string;
  project: Project; // ✅ الآن TypeScript يعرف ما هو Project
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
  // 🟢 التعديل الوحيد هنا
  users: User[];
  created_at: string;
  updated_at: string;
}

// الواجهة التي تصف شكل الرسالة كما تأتي من الـ API
export interface Message {
  id: number;
  conversation_id: number;
  user_id: number;
  content: string;
  type: "text" | "image" | "file";
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
  user: User; // معلومات المرسل
}

// واجهة الحمولة لإنشاء محادثة جديدة
export interface NewConversationPayload {
  project_id: number;
  member_ids: number[];
}

// واجهة الحمولة لإرسال رسالة جديدة
export interface NewMessagePayload {
  content: string;
  type?: "text" | "image" | "file";
  file?: File;
}

/* ================= API FUNCTIONS ================= */

// --- جلب كل المحادثات للمستخدم الحالي ---
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<{ data: Conversation[] }>("/conversations");
  return response.data.data;
};

// --- جلب كل الرسائل لمحادثة معينة ---
export const getMessages = async (conversationId: number): Promise<Message[]> => {
  const response = await api.get<{ data: Message[] }>(`/conversations/${conversationId}/messages`);
  return response.data.data;
};

// --- إرسال رسالة جديدة ---
export const sendMessage = async (conversationId: number, payload: NewMessagePayload): Promise<Message> => {
  const formData = new FormData();
  formData.append('content', payload.content);
  formData.append('type', payload.type || 'text');
  if (payload.file) {
    formData.append('file', payload.file);
  }

  const response = await api.post<{ data: Message }>(`/conversations/${conversationId}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

// --- إنشاء محادثة جديدة ---
export const createConversation = async (payload: NewConversationPayload): Promise<Conversation> => {
  const response = await api.post<{ data: Conversation }>("/conversations", payload);
  return response.data.data;
};

// --- إضافة أعضاء إلى محادثة ---
export const addMembersToConversation = async (conversationId: number, member_ids: number[]): Promise<Conversation> => {
  const response = await api.post<{ data: Conversation }>(`/conversations/${conversationId}/members`, { member_ids });
  return response.data.data;
};

// ✅✅✅====== دالة حذف الرسائل (واحدة أو متعددة) ======✅✅✅
/**
 * ترسل طلبًا لحذف رسالة واحدة أو أكثر.
 * @param messageIds مصفوفة من أرقام تعريف الرسائل المراد حذفها.
 * @returns Promise يتم حله عند نجاح الحذف.
 */
export const deleteMessages = async (messageIds: number[]): Promise<void> => {
  // نستخدم `api.delete` ونمرر `message_ids` في حقل `data`
  // هذا هو المعيار الشائع لإرسال جسم الطلب مع طلبات DELETE
await api.delete("/chat/messages", {
    data: { message_ids: messageIds },
  });
};
