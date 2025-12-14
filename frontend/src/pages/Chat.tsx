import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Search,
  MoreVertical,
  Users,
  Plus,
  Image as ImageIcon,
  File,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import NewConversationDialog from "@/components/chat/NewConversationDialog";
import AddMembersDialog from "@/components/chat/AddMembersDialog";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface Conversation {
  id: number;
  name: string;
  project: string;
  projectId: number;
  lastMessage: string;
  unreadCount: number;
  online: boolean;
  lastSeen: string;
  memberIds: number[];
}

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  // Mock data with projectId
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "فريق التصميم",
      project: "مشروع تطبيق الموبايل",
      projectId: 1,
      lastMessage: "تم الانتهاء من التصميم الأولي",
      unreadCount: 3,
      online: true,
      lastSeen: "متصل الآن",
      memberIds: [1, 2, 3],
    },
    {
      id: 2,
      name: "فريق التطوير",
      project: "مشروع الموقع الإلكتروني",
      projectId: 2,
      lastMessage: "يرجى مراجعة الكود",
      unreadCount: 0,
      online: false,
      lastSeen: "آخر ظهور منذ 5 دقائق",
      memberIds: [1, 4, 5],
    },
    {
      id: 3,
      name: "اجتماع الدعم الفني",
      project: "مشروع تطبيق الموبايل",
      projectId: 1,
      lastMessage: "موعد الاجتماع غداً الساعة 10 صباحاً",
      unreadCount: 1,
      online: true,
      lastSeen: "متصل الآن",
      memberIds: [2, 3, 6],
    },
  ]);

  const messages: Message[] = [
    {
      id: 1,
      sender: "أحمد محمد",
      content: "مرحباً، كيف حال المشروع؟",
      timestamp: "10:30 صباحاً",
      isCurrentUser: false,
      type: "text",
    },
    {
      id: 2,
      sender: "أنت",
      content: "بخير، أنا أعمل على التصميم الآن",
      timestamp: "10:32 صباحاً",
      isCurrentUser: true,
      type: "text",
    },
    {
      id: 3,
      sender: "أحمد محمد",
      content: "رائع! هل يمكنك مشاركة التصميم؟",
      timestamp: "10:35 صباحاً",
      isCurrentUser: false,
      type: "text",
    },
    {
      id: 4,
      sender: "أنت",
      content: "design-mockup.png",
      timestamp: "10:36 صباحاً",
      isCurrentUser: true,
      type: "image",
      fileUrl: "#",
      fileName: "design-mockup.png",
    },
    {
      id: 5,
      sender: "فاطمة علي",
      content: "التصميم جميل جداً!",
      timestamp: "10:40 صباحاً",
      isCurrentUser: false,
      type: "text",
    },
  ];

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Frontend only - simulate sending message
      setMessageText("");
    }
  };

  const handleFileUpload = () => {
    // Frontend only - simulate file upload
    console.log("تحميل ملف");
  };

  const handleNewConversation = (projectId: number, memberIds: number[]) => {
    const projectNames: Record<number, string> = {
      1: "مشروع تطبيق الموبايل",
      2: "مشروع الموقع الإلكتروني",
      3: "مشروع نظام إدارة المخزون",
      4: "مشروع التجارة الإلكترونية",
    };

    // Generate team name based on project
    const teamNames: Record<number, string> = {
      1: "فريق تطبيق الموبايل",
      2: "فريق الموقع الإلكتروني",
      3: "فريق إدارة المخزون",
      4: "فريق التجارة الإلكترونية",
    };

    const newId = Date.now(); // Unique ID based on timestamp
    const newConversation: Conversation = {
      id: newId,
      name: teamNames[projectId] || `فريق المشروع ${projectId}`,
      project: projectNames[projectId] || "مشروع غير معروف",
      projectId: projectId,
      lastMessage: "تم إنشاء المحادثة",
      unreadCount: 0,
      online: true,
      lastSeen: "متصل الآن",
      memberIds: memberIds,
    };

    // Save to localStorage for persistence
    const storedConversations = localStorage.getItem("chat_conversations");
    const existingConversations = storedConversations ? JSON.parse(storedConversations) : [];
    localStorage.setItem("chat_conversations", JSON.stringify([
      { ...newConversation, membersCount: memberIds.length },
      ...existingConversations
    ]));

    setConversations([newConversation, ...conversations]);
    
    toast({
      title: "تم إنشاء المحادثة",
      description: "جاري التوجيه إلى صفحة المحادثة...",
    });

    // Navigate to the new conversation page
    navigate(`/chat/${newId}`);
  };

  const handleAddMembers = (memberIds: number[]) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, memberIds: [...conv.memberIds, ...memberIds] }
          : conv
      )
    );
    toast({
      title: "تمت إضافة الأعضاء",
      description: `تم إضافة ${memberIds.length} عضو إلى المحادثة`,
    });
  };

  return (
    <div className="h-screen flex bg-background" dir="rtl">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">المحادثات</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsNewConversationOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المحادثات..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {conversations
            .filter((c) => c.name.includes(searchText) || c.project.includes(searchText))
            .map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                  selectedConversation === conversation.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <Users className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                      {conversation.unreadCount > 0 && (
                        <Badge className="mr-2">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{conversation.project}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{currentConversation?.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                {currentConversation?.online && (
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                )}
                {currentConversation?.lastSeen}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>تفاصيل المحادثة</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddMembersOpen(true)}>
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

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  } rounded-2xl p-4`}
                >
                  {!message.isCurrentUser && (
                    <p className="text-xs font-semibold mb-1">{message.sender}</p>
                  )}
                  
                  {message.type === "text" && <p className="text-sm">{message.content}</p>}
                  
                  {message.type === "image" && (
                    <div className="space-y-2">
                      <Card className="p-2 bg-background/50">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{message.fileName}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                  
                  {message.type === "file" && (
                    <Card className="p-3 bg-background/50">
                      <div className="flex items-center gap-2">
                        <File className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{message.fileName}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFileUpload}
              className="mb-1"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[44px]"
              />
            </div>
            <Button onClick={handleSendMessage} className="mb-1">
              <Send className="h-5 w-5 ml-2" />
              إرسال
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onSave={handleNewConversation}
      />

      <AddMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        onAdd={handleAddMembers}
        existingMemberIds={currentConversation?.memberIds || []}
      />
    </div>
  );
};

export default Chat;
