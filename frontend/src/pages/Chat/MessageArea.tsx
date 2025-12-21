// src/pages/Chat/MessageArea.tsx (الكود الصحيح)

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, File, Download } from "lucide-react";
// 🟢 1. قم بتغيير هذا السطر
import { Message } from "@/api/chat"; // ✅ استورد الواجهة من المصدر الصحيح

interface MessageAreaProps {
  messages: Message[];
  currentUserId: number; // 🟢 2. أضفنا هذا لتحديد اتجاه الرسالة
}

export const MessageArea = ({ messages, currentUserId }: MessageAreaProps) => {
  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          // 🟢 3. قمنا بتحديث المنطق ليعتمد على user_id بدلاً من isCurrentUser
          <div key={message.id} className={`flex ${message.user_id === currentUserId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${message.user_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-secondary"} rounded-2xl p-4`}>
              
              {/* 🟢 4. قمنا بتحديث المنطق ليعتمد على بيانات المستخدم الحقيقية */}
              {message.user_id !== currentUserId && <p className="text-xs font-semibold mb-1">{message.user.name}</p>}
              
              <p className="text-sm">{message.content}</p>
              
              {/* ملاحظة: منطق عرض الصور والملفات يحتاج إلى تعديل لاحقًا ليعتمد على البيانات الحقيقية */}
              
              {/* 🟢 5. قمنا بتحديث المنطق لعرض التاريخ الحقيقي */}
              <p className="text-xs opacity-70 mt-2 text-right">{new Date(message.created_at).toLocaleTimeString('ar-SA')}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
