// src/pages/Chat/useChatState.ts

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  addMembersToConversation,
  deleteMessages,
  Conversation,
  Message,
  NewConversationPayload,
  NewMessagePayload,
} from "@/api/chat";
import { User, fetchUsers } from "@/api/users";
import { getProjects } from "@/api/project";

/* ================= TYPES ================= */
interface Project {
  id: number;
  name: string;
}

/* ================= CONSTANTS ================= */
const QUERY_KEYS = {
  conversations: ["conversations"],
  messages: (conversationId: number) => ["messages", conversationId],
  users: ["users"],
  projects: ["projects"],
};

const CACHE_TIME = 1000 * 60 * 10; // 10 دقائق
const STALE_TIME = 1000 * 60 * 2; // دقيقتان

/* ================= HOOK ================= */
export const useChatState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const currentUserId = currentUser?.id || 0;

  // --- حالات الواجهة ---
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ============== REACT QUERY: جلب المحادثات ============== */
  const {
    data: conversations = [],
    isLoading: loadingConversations,
  } = useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: getConversations,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /* ============== REACT QUERY: جلب الرسائل ============== */
  const {
    data: messages = [],
    isLoading: loadingMessages,
  } = useQuery({
    queryKey: QUERY_KEYS.messages(currentConversationId || 0),
    queryFn: () => currentConversationId ? getMessages(currentConversationId) : Promise.resolve([]),
    enabled: !!currentConversationId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  /* ============== REACT QUERY: جلب المستخدمين ============== */
  const {
    data: allUsers = [],
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  /* ============== REACT QUERY: جلب المشاريع ============== */
  const {
    data: allProjects = [],
    isLoading: loadingProjects,
  } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  /* ============== MUTATION: إرسال رسالة ============== */
  const sendMutation = useMutation({
    mutationFn: ({ conversationId, payload }: { conversationId: number; payload: NewMessagePayload }) =>
      sendMessage(conversationId, payload),
    onSuccess: (newMessage) => {
      // تحديث قائمة الرسائل
      queryClient.setQueryData(
        QUERY_KEYS.messages(currentConversationId || 0),
        (old: Message[] = []) => [...old, newMessage]
      );

      // تحديث آخر رسالة في المحادثات
      queryClient.setQueryData(
        QUERY_KEYS.conversations,
        (old: Conversation[] = []) =>
          old.map(conv =>
            conv.id === currentConversationId
              ? { ...conv, last_message: newMessage }
              : conv
          )
      );
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إرسال الرسالة.", variant: "destructive" });
    },
  });

  /* ============== MUTATION: إنشاء محادثة ============== */
  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      // إضافة المحادثة الجديدة إلى القائمة
      queryClient.setQueryData(
        QUERY_KEYS.conversations,
        (old: Conversation[] = []) => [newConversation, ...old]
      );

      setIsNewConversationOpen(false);
      toast({ title: "نجاح", description: "تم إنشاء المحادثة بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إنشاء المحادثة.", variant: "destructive" });
    },
  });

  /* ============== MUTATION: إضافة أعضاء ============== */
  const addMembersMutation = useMutation({
    mutationFn: ({ conversationId, memberIds }: { conversationId: number; memberIds: number[] }) =>
      addMembersToConversation(conversationId, memberIds),
    onSuccess: (updatedConversation) => {
      // تحديث المحادثة المحدثة
      queryClient.setQueryData(
        QUERY_KEYS.conversations,
        (old: Conversation[] = []) =>
          old.map(c => c.id === updatedConversation.id ? updatedConversation : c)
      );

      setIsAddMembersOpen(false);
      toast({ title: "نجاح", description: "تم إضافة الأعضاء بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إضافة الأعضاء.", variant: "destructive" });
    },
  });

  /* ============== MUTATION: حذف الرسائل ============== */
  const deleteMutation = useMutation({
    mutationFn: deleteMessages,
    onSuccess: (_, messageIds) => {
      // إزالة الرسائل المحذوفة من القائمة
      queryClient.setQueryData(
        QUERY_KEYS.messages(currentConversationId || 0),
        (old: Message[] = []) =>
          old.filter(message => !messageIds.includes(message.id))
      );

      toast({ title: "نجاح", description: "تم حذف الرسائل المحددة." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف الرسائل.", variant: "destructive" });
    },
  });

  /* ============== HANDLERS ============== */
  const handleSendMessage = async (payload: NewMessagePayload) => {
    if (!currentConversationId) return;
    sendMutation.mutate({ conversationId: currentConversationId, payload });
  };

  const handleCreateConversation = async (payload: NewConversationPayload) => {
    createMutation.mutate(payload);
  };

  const handleAddMembers = async (member_ids: number[]) => {
    if (!currentConversationId) return;
    addMembersMutation.mutate({ conversationId: currentConversationId, memberIds: member_ids });
  };

  const handleDeleteMessages = async (messageIds: number[]) => {
    if (messageIds.length === 0) return;
    deleteMutation.mutate(messageIds);
  };

  /* ============== FILTERING ============== */
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (c.project && c.project.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  /* ============== MANUAL REFETCH (للملف الشخصي) ============== */
  const refetchChat = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
  };

  return {
    conversations: filteredConversations,
    messages,
    currentConversation,
    allUsers,
    allProjects,
    currentUserId,
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
    handleDeleteMessages,
    isDeletingMessages: deleteMutation.isPending,
    isSendingMessage: sendMutation.isPending,
    isCreatingConversation: createMutation.isPending,
    isAddingMembers: addMembersMutation.isPending,
    refetchChat, // للملف الشخصي
  };
};
