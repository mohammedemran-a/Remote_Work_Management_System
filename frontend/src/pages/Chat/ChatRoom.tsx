// src/pages/Chat/ChatRoom.tsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, MoreVertical, Users, Phone, Video } from "lucide-react";
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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
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
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>اختر محادثة لبدء الدردشة</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback><Users /></AvatarFallback></Avatar>
          <div>
            <h1 className="font-bold text-lg">{conversation.name}</h1>
            <p className="text-xs text-muted-foreground">{conversation.users.length} أعضاء</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost"><Phone className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost"><Video className="h-5 w-5" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddMembers}>إضافة أعضاء</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        {loading && <p className="text-center">جاري تحميل الرسائل...</p>}
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.user_id === currentUserId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl ${message.user_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {message.user_id !== currentUserId && <p className="text-xs font-semibold mb-1">{message.user.name}</p>}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-2 text-right">{new Date(message.created_at).toLocaleTimeString('ar-SA')}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <Button size="icon" variant="ghost" className="mb-1"><Paperclip className="h-5 w-5" /></Button>
          <Input
            placeholder="اكتب رسالتك هنا..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="min-h-[44px]"
          />
          <Button onClick={handleSend} className="mb-1"><Send className="h-5 w-5 ml-2" />إرسال</Button>
        </div>
      </div>
    </div>
  );
};
