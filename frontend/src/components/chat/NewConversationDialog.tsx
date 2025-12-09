import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
  role: string;
}

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (projectId: number, memberIds: number[]) => void;
}

// Mock data
const mockProjects: Project[] = [
  { id: 1, name: "مشروع تطبيق الموبايل" },
  { id: 2, name: "مشروع الموقع الإلكتروني" },
  { id: 3, name: "مشروع نظام إدارة المخزون" },
  { id: 4, name: "مشروع التجارة الإلكترونية" },
];

const mockMembers: Member[] = [
  { id: 1, name: "أحمد محمد", role: "مطور" },
  { id: 2, name: "فاطمة علي", role: "مصممة" },
  { id: 3, name: "محمد خالد", role: "مدير مشروع" },
  { id: 4, name: "سارة أحمد", role: "محللة" },
  { id: 5, name: "عمر حسن", role: "مطور" },
  { id: 6, name: "نورة سعيد", role: "اختبار" },
];

const NewConversationDialog = ({
  open,
  onOpenChange,
  onSave,
}: NewConversationDialogProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = () => {
    if (selectedProject && selectedMembers.length > 0) {
      onSave(parseInt(selectedProject), selectedMembers);
      setSelectedProject("");
      setSelectedMembers([]);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedProject("");
    setSelectedMembers([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء محادثة جديدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Select */}
          <div className="space-y-2">
            <Label>اختر المشروع</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="اختر مشروعاً..." />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Members MultiSelect */}
          <div className="space-y-2">
            <Label>اختر الأعضاء</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="space-y-2">
                {mockMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleMemberToggle(member.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {selectedMembers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                تم اختيار {selectedMembers.length} عضو
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedProject || selectedMembers.length === 0}
          >
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
