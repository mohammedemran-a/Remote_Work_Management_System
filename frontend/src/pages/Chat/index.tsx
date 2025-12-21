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
    <div className="h-screen flex bg-background" dir="rtl">
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
        // 🟢 التعديل الوحيد هنا: غيرنا 'members' إلى 'users'
        existingMemberIds={currentConversation?.users?.map(m => m.id) || []}
      />
    </div>
  );
};

export default ChatPage;
