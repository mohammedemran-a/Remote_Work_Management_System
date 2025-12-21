// src/pages/Chat/ChatHeader.tsx (الكود الصحيح)

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreVertical, Users, Phone, Video } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// 🟢 1. قم بتغيير هذا السطر
import { Conversation } from "@/api/chat"; // ✅ استورد الواجهة من المصدر الصحيح

interface ChatHeaderProps {
  conversation: Conversation | undefined;
  onAddMembers: () => void;
}

export const ChatHeader = ({ conversation, onAddMembers }: ChatHeaderProps) => {
  if (!conversation) {
    // يعرض header فارغًا إذا لم يتم تحديد محادثة
    return <div className="h-16 border-b border-border flex items-center px-6 bg-card"></div>;
  }

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-lg">{conversation.name}</h1>
          {/* 🟢 2. قمنا بتحديث المنطق ليعتمد على البيانات الحقيقية */}
          <p className="text-xs text-muted-foreground">
            {conversation.users.length} أعضاء
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost"><Phone className="h-5 w-5" /></Button>
        <Button size="icon" variant="ghost"><Video className="h-5 w-5" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost"><MoreVertical className="h-5 w-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>تفاصيل المحادثة</DropdownMenuItem>
            <DropdownMenuItem onClick={onAddMembers}>إضافة أعضاء</DropdownMenuItem>
            <DropdownMenuItem>كتم الإشعارات</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">مغادرة المحادثة</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
