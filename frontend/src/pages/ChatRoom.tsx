import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  ArrowRight,
  MoreVertical,
  Users,
  Image as ImageIcon,
  File,
  Download,
  Phone,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
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

interface ConversationData {
  id: number;
  name: string;
  project: string;
  projectId: number;
  online: boolean;
  lastSeen: string;
  memberIds: number[];
  membersCount: number;
}

// Mock conversations data - in real app this would come from API/database
const mockConversationsData: Record<string, ConversationData> = {
  "1": {
    id: 1,
    name: "فريق التصميم",
    project: "مشروع تطبيق الموبايل",
    projectId: 1,
    online: true,
    lastSeen: "متصل الآن",
    memberIds: [1, 2, 3],
    membersCount: 3,
  },
  "2": {
    id: 2,
    name: "فريق التطوير",
    project: "مشروع الموقع الإلكتروني",
    projectId: 2,
    online: false,
    lastSeen: "آخر ظهور منذ 5 دقائق",
    memberIds: [1, 4, 5],
    membersCount: 3,
  },
  "3": {
    id: 3,
    name: "اجتماع الدعم الفني",
    project: "مشروع تطبيق الموبايل",
    projectId: 1,
    online: true,
    lastSeen: "متصل الآن",
    memberIds: [2, 3, 6],
    membersCount: 3,
  },
};

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [conversation, setConversation] = useState<ConversationData | null>(null);

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
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
  ]);

  useEffect(() => {
    // Load conversation data
    if (id) {
      // Check localStorage for dynamically created conversations
      const storedConversations = localStorage.getItem("chat_conversations");
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        const found = parsed.find((c: ConversationData) => c.id.toString() === id);
        if (found) {
          setConversation(found);
          // Update page title
          document.title = `${found.name} - المحادثات`;
          return;
        }
      }
      
      // Fall back to mock data
      const mockData = mockConversationsData[id];
      if (mockData) {
        setConversation(mockData);
        document.title = `${mockData.name} - المحادثات`;
      } else {
        // Conversation not found
        toast({
          title: "خطأ",
          description: "المحادثة غير موجودة",
          variant: "destructive",
        });
        navigate("/chat");
      }
    }
  }, [id, navigate, toast]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "أنت",
        content: messageText,
        timestamp: new Date().toLocaleTimeString("ar-SA", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        isCurrentUser: true,
        type: "text",
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "تحميل ملف",
      description: "سيتم تحميل الملف قريباً",
    });
  };

  const handleAddMembers = (memberIds: number[]) => {
    if (conversation) {
      setConversation({
        ...conversation,
        memberIds: [...conversation.memberIds, ...memberIds],
        membersCount: conversation.membersCount + memberIds.length,
      });
      toast({
        title: "تمت إضافة الأعضاء",
        description: `تم إضافة ${memberIds.length} عضو إلى المحادثة`,
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background" dir="rtl">
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigate("/chat")}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-lg">{conversation.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {conversation.online && (
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              )}
              {conversation.lastSeen} • {conversation.membersCount} أعضاء
            </p>
          </div>
        </div>
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

      {/* Project Badge */}
      <div className="px-6 py-2 bg-muted/50 border-b border-border">
        <p className="text-sm text-muted-foreground">
          المشروع: <span className="font-medium text-foreground">{conversation.project}</span>
        </p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-4xl mx-auto">
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
                } rounded-2xl p-4 shadow-sm`}
              >
                {!message.isCurrentUser && (
                  <p className="text-xs font-semibold mb-1 opacity-80">{message.sender}</p>
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
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
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

      {/* Add Members Dialog */}
      <AddMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        onAdd={handleAddMembers}
        existingMemberIds={conversation.memberIds}
      />
    </div>
  );
};

export default ChatRoom;
