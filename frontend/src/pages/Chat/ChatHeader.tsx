// src/pages/Chat/ChatHeader.tsx

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MoreVertical,
  Users,
  Phone,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation } from "@/api/chat";

interface ChatHeaderProps {
  conversation: Conversation | undefined;
  onAddMembers: () => void;
}

export const ChatHeader = ({
  conversation,
  onAddMembers,
}: ChatHeaderProps) => {
  if (!conversation) {
    return (
      <div className="h-16 border-b border-border flex items-center px-6 bg-card" />
    );
  }

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      {/* الجزء الأيسر (كما كان قبل الربط) */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>

        {/* ⭐ التعديل الوحيد هنا */}
        <div className="max-w-[260px]">
          <h1
            className="font-bold text-lg truncate"
            title={conversation.name}
          >
            {conversation.name}
          </h1>

          <p className="text-xs text-muted-foreground truncate">
            {conversation.users.length} أعضاء
          </p>
        </div>
      </div>

      {/* الجزء الأيمن (كما هو بدون تغيير) */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Phone className="h-5 w-5" />
        </Button>

        <Button size="icon" variant="ghost">
          <Video className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>تفاصيل المحادثة</DropdownMenuItem>
            <DropdownMenuItem onClick={onAddMembers}>
              إضافة أعضاء
            </DropdownMenuItem>
            <DropdownMenuItem>كتم الإشعارات</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              مغادرة المحادثة
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
