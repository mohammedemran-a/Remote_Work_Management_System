// src/pages/Chat/useChatState.ts

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  addMembersToConversation,
  Conversation,
  Message,
  NewConversationPayload,
  NewMessagePayload,
} from "@/api/chat";
import { User, fetchUsers } from "@/api/users";
import { getProjects } from "@/api/project";

interface Project {
  id: number;
  name: string;
}

const CURRENT_USER_ID = 1;

export const useChatState = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadInitialData = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const [convosData, usersData, projectsResponse] = await Promise.all([
        getConversations(),
        fetchUsers(),
        getProjects(),
      ]);

      // 🟢 التعديل هنا: جلب الرسالة الأخيرة لكل محادثة عند التحميل الأول
      const conversationsWithLastMessages = await Promise.all(
        (convosData || []).map(async (conv: Conversation) => {
          // إذا كانت الرسالة الأخيرة غير موجودة في بيانات المحادثة، نجلبها
          if (!conv.last_message) {
            try {
              const msgs = await getMessages(conv.id);
              if (msgs && msgs.length > 0) {
                return { ...conv, last_message: msgs[msgs.length - 1] };
              }
            } catch (e) {
              console.error("Error fetching last message for convo", conv.id, e);
            }
          }
          return conv;
        })
      );

      setConversations(conversationsWithLastMessages);
      setAllUsers(usersData || []);
      setAllProjects(projectsResponse);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب البيانات الأولية للدردشة.", variant: "destructive" });
      setConversations([]);
      setAllUsers([]);
      setAllProjects([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!currentConversationId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const messagesData = await getMessages(currentConversationId);
        setMessages(messagesData || []);

        if (messagesData && messagesData.length > 0) {
          const lastMsg = messagesData[messagesData.length - 1];
          setConversations(prev => 
            prev.map(conv => 
              conv.id === currentConversationId 
                ? { ...conv, last_message: lastMsg } 
                : conv
            )
          );
        }
      } catch (error) {
        toast({ title: "خطأ", description: "فشل في جلب الرسائل.", variant: "destructive" });
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [currentConversationId, toast]);

  const handleSendMessage = async (payload: NewMessagePayload) => {
    if (!currentConversationId) return;
    try {
      const newMessage = await sendMessage(currentConversationId, payload);
      setMessages(prev => [...prev, newMessage]);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, last_message: newMessage } 
            : conv
        )
      );
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إرسال الرسالة.", variant: "destructive" });
    }
  };

  const handleCreateConversation = async (payload: NewConversationPayload) => {
    try {
      const newConversation = await createConversation(payload);
      setConversations(prev => [newConversation, ...prev]);
      setIsNewConversationOpen(false);
      toast({ title: "نجاح", description: "تم إنشاء المحادثة بنجاح." });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إنشاء المحادثة.", variant: "destructive" });
    }
  };

  const handleAddMembers = async (member_ids: number[]) => {
    if (!currentConversationId) return;
    try {
      const updatedConversation = await addMembersToConversation(currentConversationId, member_ids);
      setConversations(prev => prev.map(c => c.id === currentConversationId ? updatedConversation : c));
      setIsAddMembersOpen(false);
      toast({ title: "نجاح", description: "تم إضافة الأعضاء بنجاح." });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إضافة الأعضاء.", variant: "destructive" });
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (c.project && c.project.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  return {
    conversations: filteredConversations,
    messages,
    currentConversation,
    allUsers,
    allProjects,
    currentUserId: CURRENT_USER_ID,
    loadingConversations,
    loadingMessages,
    isNewConversationOpen,
    setIsNewConversationOpen,
    isAddMembersOpen,
    setIsAddMembersOpen,
    searchText,
    setSearchText,
    setCurrentConversationId,
    handleSendMessage,
    handleCreateConversation,
    handleAddMembers,
  };
};