// src/pages/Chat/index.tsx

import { useChatState } from "./useChatState";
import { ChatSidebar } from "./ChatSidebar";
import { ChatRoom } from "./ChatRoom";
import { ChatDialogs } from "./ChatDialogs";

const ChatPage = () => {
  const {
    conversations,
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
    // ✅ 1. استقبال دوال الحذف من الهوك
    handleDeleteMessages,
    isDeletingMessages,
  } = useChatState();

  return (
    <div 
      className="flex-1 flex bg-background overflow-hidden h-[calc(100vh-64px)] w-full" 
      dir="rtl"
    >
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id || null}
        onSelectConversation={setCurrentConversationId}
        onNewConversation={() => setIsNewConversationOpen(true)}
        searchText={searchText}
        onSearchChange={setSearchText}
        loading={loadingConversations}
      />

      <ChatRoom
        conversation={currentConversation}
        messages={messages}
        loading={loadingMessages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onAddMembers={() => setIsAddMembersOpen(true)}
        // ✅ 2. تمرير الدوال الجديدة إلى غرفة المحادثة
        onDeleteMessages={handleDeleteMessages}
        isDeleting={isDeletingMessages}
      />

      <ChatDialogs
        isNewConversationOpen={isNewConversationOpen}
        onNewConversationOpenChange={setIsNewConversationOpen}
        onNewConversationSave={handleCreateConversation}
        isAddMembersOpen={isAddMembersOpen}
        onAddMembersOpenChange={setIsAddMembersOpen}
        onAddMembersSave={handleAddMembers}
        allUsers={allUsers}
        allProjects={allProjects}
        existingMemberIds={currentConversation?.users?.map(m => m.id) || []}
      />
    </div>
  );
};

export default ChatPage;
