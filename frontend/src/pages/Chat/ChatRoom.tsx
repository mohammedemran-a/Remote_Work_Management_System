// src/pages/Chat/ChatRoom.tsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, MoreVertical, Users } from "lucide-react"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Conversation, Message, NewMessagePayload } from "@/api/chat";

interface ChatRoomProps {
  conversation: Conversation | undefined;
  messages: Message[];
  loading: boolean;
  currentUserId: number;
  onSendMessage: (payload: NewMessagePayload) => void;
  onAddMembers: () => void;
}

export const ChatRoom = ({
  conversation,
  messages,
  loading,
  currentUserId,
  onSendMessage,
  onAddMembers,
}: ChatRoomProps) => {
  const [messageText, setMessageText] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      // استخدام 'auto' بدلاً من 'smooth' يحل مشاكل القفز أثناء التحميل
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'auto' });
    }
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage({ content: messageText, type: 'text' });
      setMessageText("");
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground bg-slate-50">
        <p>اختر محادثة لبدء الدردشة</p>
      </div>
    );
  }

  return (
    /* تغيير جوهري: 
       استخدام h-[calc(100vh-64px)] هنا مباشرة يضمن أن الغرفة 
       لن تزيد عن مساحة الشاشة حتى لو كان الأب (index.tsx) به مشكلة.
    */
    <div className="flex-1 flex flex-col overflow-hidden bg-background relative" style={{ height: 'calc(100vh - 64px)' }}>
      
      {/* 1. الرأس: ثابت في مكانه (absolute) لضمان عدم تحركه مع التمرير */}
      <div className="absolute top-0 w-full h-16 border-b border-border flex items-center justify-between px-6 bg-card z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="shrink-0"><AvatarFallback><Users className="h-4 w-4" /></AvatarFallback></Avatar>
          <div className="min-w-0">
            <h1 className="font-bold text-lg leading-none truncate">{conversation.name}</h1>
            <p className="text-xs text-muted-foreground mt-1">{conversation.users.length} أعضاء</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost"><MoreVertical className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddMembers}>إضافة أعضاء</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. منطقة الرسائل: محصورة بين الرأس والفوتر باستخدام padding */}
      <div className="flex-1 min-h-0 w-full pt-16 pb-20"> {/* pt-16 للرأس و pb-20 للفوتر */}
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="p-6 flex flex-col gap-4">
            {loading && <p className="text-center text-sm text-muted-foreground mb-4">جاري التحميل...</p>}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.user_id === currentUserId ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl ${message.user_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {message.user_id !== currentUserId && <p className="text-xs font-semibold mb-1 opacity-80">{message.user.name}</p>}
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  <p className="text-[10px] opacity-60 mt-1 text-left">
                    {new Date(message.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 3. الفوتر: ثابت في الأسفل تماماً (absolute) */}
      <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card z-10">
        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          <Button size="icon" variant="ghost" className="shrink-0"><Paperclip className="h-5 w-5" /></Button>
          <Input
            placeholder="اكتب رسالتك هنا..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 h-11"
          />
          <Button onClick={handleSend} className="shrink-0 px-6 h-11">
            <Send className="h-4 w-4 ml-2" />
            إرسال
          </Button>
        </div>
      </div>
    </div>
  );
};