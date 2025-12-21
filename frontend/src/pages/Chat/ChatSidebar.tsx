// src/pages/Chat/ChatSidebar.tsx

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users } from "lucide-react";
import { Conversation } from "@/api/chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  loading: boolean;
}

export const ChatSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  searchText,
  onSearchChange,
  loading,
}: ChatSidebarProps) => {
  return (
    <div className="w-80 border-l border-border flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">المحادثات</h2>
          <Button size="icon" variant="ghost" onClick={onNewConversation}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المحادثات..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading && <p className="p-4 text-center text-muted-foreground">جاري تحميل المحادثات...</p>}
        {!loading && conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
              currentConversationId === conversation.id ? "bg-accent" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback><Users className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                  {conversation.unread_count > 0 && (
                    <Badge className="mr-2">{conversation.unread_count}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{conversation.project.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.last_message?.content || "لا توجد رسائل بعد"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
