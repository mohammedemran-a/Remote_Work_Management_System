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
  } = useChatState();

  return (
    /* الإصلاح الجذري: 
       1. إزالة fixed و top-64 لأنها تسبب تداخلاً مع شريط الموقع.
       2. استخدام flex-1 لتأخذ الحاوية ما تبقى من عرض الشاشة بجانب شريط الموقع.
       3. استخدام h-[calc(100vh-64px)] لضمان الالتزام بطول الشاشة فقط.
    */
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