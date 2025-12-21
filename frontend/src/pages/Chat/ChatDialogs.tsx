// src/pages/Chat/ChatDialogs.tsx (الكود الصحيح)

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User } from "@/api/users";
// 🟢 1. أزلنا استيراد 'Project' من هنا
import { NewConversationPayload } from "@/api/chat";

// 🟢 2. الحل: تعريف واجهة Project بشكل مبسط ومحلي هنا
interface Project {
  id: number;
  name: string;
}

interface ChatDialogsProps {
  isNewConversationOpen: boolean;
  onNewConversationOpenChange: (open: boolean) => void;
  onNewConversationSave: (payload: NewConversationPayload) => void;
  
  isAddMembersOpen: boolean;
  onAddMembersOpenChange: (open: boolean) => void;
  onAddMembersSave: (member_ids: number[]) => void;
  
  allUsers: User[];
  allProjects: Project[]; // ✅ الآن يستخدم الواجهة المحلية
  existingMemberIds: number[];
}

export const ChatDialogs = ({
  isNewConversationOpen, onNewConversationOpenChange, onNewConversationSave,
  isAddMembersOpen, onAddMembersOpenChange, onAddMembersSave,
  allUsers, allProjects, existingMemberIds
}: ChatDialogsProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  const handleSaveNewConversation = () => {
    if (selectedProjectId && selectedMemberIds.length > 0) {
      onNewConversationSave({
        project_id: parseInt(selectedProjectId),
        member_ids: selectedMemberIds,
      });
      setSelectedMemberIds([]); // Reset
    }
  };

  const handleSaveAddMembers = () => {
    if (selectedMemberIds.length > 0) {
      onAddMembersSave(selectedMemberIds);
      setSelectedMemberIds([]); // Reset
    }
  };

  return (
    <>
      {/* New Conversation Dialog */}
      <Dialog open={isNewConversationOpen} onOpenChange={onNewConversationOpenChange}>
        <DialogContent>
          <DialogHeader><DialogTitle>إنشاء محادثة جديدة</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>اختر المشروع</Label>
              <Select onValueChange={setSelectedProjectId}>
                <SelectTrigger><SelectValue placeholder="اختر مشروعًا..." /></SelectTrigger>
                <SelectContent>
                  {allProjects.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>اختر الأعضاء</Label>
              <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                {allUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`user-${user.id}`}
                      onChange={(e) => {
                        const id = user.id;
                        setSelectedMemberIds(prev => 
                          e.target.checked ? [...prev, id] : prev.filter(mid => mid !== id)
                        );
                      }}
                    />
                    <label htmlFor={`user-${user.id}`}>{user.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onNewConversationOpenChange(false)}>إلغاء</Button>
            <Button onClick={handleSaveNewConversation}>إنشاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Members Dialog */}
      <Dialog open={isAddMembersOpen} onOpenChange={onAddMembersOpenChange}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة أعضاء للمحادثة</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label>اختر الأعضاء الجدد</Label>
            <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
              {allUsers.filter(u => !existingMemberIds.includes(u.id)).map(user => (
                 <div key={user.id} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`add-user-${user.id}`}
                      onChange={(e) => {
                        const id = user.id;
                        setSelectedMemberIds(prev => 
                          e.target.checked ? [...prev, id] : prev.filter(mid => mid !== id)
                        );
                      }}
                    />
                    <label htmlFor={`add-user-${user.id}`}>{user.name}</label>
                  </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onAddMembersOpenChange(false)}>إلغاء</Button>
            <Button onClick={handleSaveAddMembers}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
