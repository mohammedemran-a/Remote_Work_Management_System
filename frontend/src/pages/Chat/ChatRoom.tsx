// src/pages/Chat/ChatRoom.tsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, Paperclip, MoreVertical, Users, 
  Trash2, X, CheckSquare, Square, Loader2, ListChecks
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation, Message, NewMessagePayload } from "@/api/chat";

// (الواجهة تبقى كما هي)
interface ChatRoomProps {
  conversation: Conversation | undefined;
  messages: Message[];
  loading: boolean;
  currentUserId: number;
  onSendMessage: (payload: NewMessagePayload) => void;
  onAddMembers: () => void;
  onDeleteMessages: (messageIds: number[]) => void;
  isDeleting: boolean;
}

export const ChatRoom = ({
  conversation,
  messages,
  loading,
  currentUserId,
  onSendMessage,
  onAddMembers,
  onDeleteMessages,
  isDeleting,
}: ChatRoomProps) => {
  const [messageText, setMessageText] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    cancelSelectionMode();
  }, [conversation?.id]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage({ content: messageText, type: "text" });
      setMessageText("");
    }
  };

  // --- دوال منطق الحذف ---
  const startSelectionMode = () => {
    setSelectionMode(true);
  };

  const handleToggleSelection = (messageId: number) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedMessages(new Set());
  };

  const handleSelectAll = () => {
    const allMyMessageIds = messages
      .filter(m => m.user_id === currentUserId)
      .map(m => m.id);
    setSelectedMessages(new Set(allMyMessageIds));
  };

  const handleDelete = () => {
    if (selectedMessages.size === 0) {
      toast({ title: "لم يتم تحديد أي رسائل", variant: "default" });
      return;
    }
    const idsToDelete = Array.from(selectedMessages);
    onDeleteMessages(idsToDelete);
    cancelSelectionMode();
  };
  // --- نهاية دوال الحذف ---

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground bg-slate-50">
        <p>اختر محادثة لبدء الدردشة</p>
      </div>
    );
  }

  return (
    // ✅✅✅====== هذا هو الإصلاح الجذري: إزالة `relative` ======✅✅✅
    <div
      className="flex-1 flex flex-col overflow-hidden bg-background" // تمت إزالة `relative`
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* شريط الأدوات العلوي: الآن هو الذي يحتاج إلى `relative` ليعمل `absolute` بشكل صحيح */}
      <div className="relative w-full h-16 z-10">
        {selectionMode ? (
          // شريط الحذف
          <div className="absolute top-0 w-full h-16 border-b border-border flex items-center justify-between px-6 bg-card">
            <Button variant="ghost" size="icon" onClick={cancelSelectionMode}><X className="h-5 w-5" /></Button>
            <span className="font-bold text-sm">{selectedMessages.size} رسائل محددة</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleSelectAll}>تحديد الكل</Button>
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        ) : (
          // الشريط العادي
          <div className="absolute top-0 w-full h-16 border-b border-border flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="shrink-0"><AvatarFallback><Users className="h-4 w-4" /></AvatarFallback></Avatar>
              <div className="min-w-0">
                <h1 className="font-bold text-lg">{conversation.name}</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2">{conversation.users.length} أعضاء</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onAddMembers}>إضافة أعضاء</DropdownMenuItem>
                  <DropdownMenuItem onClick={startSelectionMode}>
                    <ListChecks className="h-4 w-4 ml-2" />
                    تحديد الرسائل
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 min-h-0 w-full pb-20"> {/* إزالة pt-16 */}
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="p-6 flex flex-col gap-4">
            {loading && <p className="text-center text-sm text-muted-foreground mb-4">جاري التحميل...</p>}
            {messages.map((message) => {
              const isMyMessage = message.user_id === currentUserId;
              const isSelected = selectedMessages.has(message.id);
              return (
                <div
                  key={message.id}
                  className={`flex items-center gap-3 transition-colors ${isMyMessage ? "justify-end" : "justify-start"} ${isSelected ? "bg-blue-50 dark:bg-blue-900/50 rounded-lg" : ""}`}
                  onClick={selectionMode && isMyMessage ? () => handleToggleSelection(message.id) : undefined}
                >
                  {selectionMode && isMyMessage && (
                    <div className="flex items-center h-full px-2">
                      {isSelected ? <CheckSquare className="text-blue-600" /> : <Square className="text-slate-400" />}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${isMyMessage ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                  >
                    {!isMyMessage && <p className="text-xs font-semibold mb-1 opacity-80">{message.user.name}</p>}
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    <p className="text-[10px] opacity-60 mt-1 text-left">{new Date(message.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* حقل إدخال الرسالة: الآن هو الذي يحتاج إلى `relative` */}
      <div className="relative w-full z-10">
        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <Button size="icon" variant="ghost" className="shrink-0"><Paperclip className="h-5 w-5" /></Button>
            <Input placeholder="اكتب رسالتك هنا..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 h-11" />
            <Button onClick={handleSend} className="shrink-0 px-6 h-11"><Send className="h-4 w-4 ml-2" /> إرسال</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
