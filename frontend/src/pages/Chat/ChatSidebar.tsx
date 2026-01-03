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
    /* RTL + الشريط في اليمين */
    <div
      dir="rtl"
      className="w-80 border-r border-border flex flex-col bg-card h-full overflow-hidden shrink-0"
    >
      {/* ===== Header ===== */}
      <div className="p-4 border-b border-border flex-none">
        <div className="flex items-center justify-between mb-4 flex-row-reverse">
          <h2 className="text-xl font-bold text-right">المحادثات</h2>

          <Button size="icon" variant="ghost" onClick={onNewConversation}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* ===== Search ===== */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المحادثات..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-right"
          />
        </div>
      </div>

      {/* ===== Conversations ===== */}
      <ScrollArea className="flex-1">
        {loading && (
          <p className="p-4 text-center text-muted-foreground">
            جاري تحميل المحادثات...
          </p>
        )}

        {!loading &&
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                currentConversationId === conversation.id ? "bg-accent" : ""
              }`}
            >
              {/* RTL layout */}
              <div className="flex items-start gap-3 min-w-0 flex-row-reverse">
                <Avatar className="shrink-0">
                  <AvatarFallback>
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between mb-1 gap-2 flex-row-reverse">
                    <h3 className="font-semibold text-sm truncate">
                      {conversation.name}
                    </h3>

                    {conversation.unread_count > 0 && (
                      <Badge className="shrink-0 bg-primary text-primary-foreground">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {conversation.project?.name}
                  </p>

                  <p className="text-sm text-muted-foreground truncate italic">
                    {conversation.last_message
                      ? conversation.last_message.content
                      : "ابدأ المحادثة الآن..."}
                  </p>
                </div>
              </div>
            </div>
          ))}

        {!loading && conversations.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            لا توجد محادثات تطابق بحثك
          </p>
        )}
      </ScrollArea>
    </div>
  );
};
