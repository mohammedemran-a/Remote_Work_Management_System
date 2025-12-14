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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";

interface Member {
  id: number;
  name: string;
  role: string;
}

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (memberIds: number[]) => void;
  existingMemberIds?: number[];
}

// Mock data
const allMembers: Member[] = [
  { id: 1, name: "أحمد محمد", role: "مطور" },
  { id: 2, name: "فاطمة علي", role: "مصممة" },
  { id: 3, name: "محمد خالد", role: "مدير مشروع" },
  { id: 4, name: "سارة أحمد", role: "محللة" },
  { id: 5, name: "عمر حسن", role: "مطور" },
  { id: 6, name: "نورة سعيد", role: "اختبار" },
  { id: 7, name: "خالد العلي", role: "مطور" },
  { id: 8, name: "ليلى محمود", role: "مصممة" },
];

const AddMembersDialog = ({
  open,
  onOpenChange,
  onAdd,
  existingMemberIds = [],
}: AddMembersDialogProps) => {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");

  // Filter out existing members
  const availableMembers = allMembers.filter(
    (member) => !existingMemberIds.includes(member.id)
  );

  // Filter by search text
  const filteredMembers = availableMembers.filter((member) =>
    member.name.includes(searchText)
  );

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAdd = () => {
    if (selectedMembers.length > 0) {
      onAdd(selectedMembers);
      setSelectedMembers([]);
      setSearchText("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedMembers([]);
    setSearchText("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة أعضاء</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن عضو..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <Label>اختر الأعضاء للإضافة</Label>
            <ScrollArea className="h-[250px] border rounded-md p-2">
              {filteredMembers.length > 0 ? (
                <div className="space-y-2">
                  {filteredMembers.map((member) => (
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  لا يوجد أعضاء متاحين للإضافة
                </div>
              )}
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
          <Button onClick={handleAdd} disabled={selectedMembers.length === 0}>
            إضافة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog;
