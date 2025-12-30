import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/api/users";
import { Team } from "@/api/team";
import { Project } from "@/api/project";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

/* ================= TYPES ================= */

interface TeamFormData {
  name: string;
  description: string;
  leader_id: number | null;
  member_ids: number[];
  project_ids: number[];
}

interface Props {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;

  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;

  formData: TeamFormData;
  setFormData: (data: TeamFormData) => void;

  handleSaveMember: () => void;
  confirmDelete: () => void;

  availableUsers: User[];
  allProjects: Project[];
  selectedMember: Team | null;
}

/* ================= COMPONENT ================= */

export const TeamDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  formData,
  setFormData,
  handleSaveMember,
  confirmDelete,
  availableUsers = [],
  allProjects = [],
  selectedMember,
}: Props) => {
  const safeUsers = Array.isArray(availableUsers) ? availableUsers : [];
  const safeProjects = Array.isArray(allProjects) ? allProjects : [];

  const handleSelectChange = (
    id: string,
    field: "member_ids" | "project_ids"
  ) => {
    const numId = parseInt(id, 10);
    if (!formData[field].includes(numId)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], numId],
      });
    }
  };

  const removeItem = (
    id: number,
    field: "member_ids" | "project_ids"
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== id),
    });
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent
          className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-2xl">
              {selectedMember
                ? "تحديث بيانات الفريق"
                : "إنشاء فريق عمل جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 text-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم الفريق</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>قائد الفريق</Label>
                <Select
                  value={formData.leader_id?.toString() ?? ""}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      leader_id: Number(val),
                    })
                  }
                >
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر القائد" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {safeUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>وصف الفريق</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="text-right"
              />
            </div>

            {/* أعضاء الفريق */}
            <div className="space-y-3 border-t pt-4">
              <Label className="font-bold">أعضاء الفريق</Label>
              <Select
                onValueChange={(val) =>
                  handleSelectChange(val, "member_ids")
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="أضف عضواً..." />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {safeUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.member_ids.map((id) => {
                  const user = safeUsers.find((u) => u.id === id);
                  return (
                    user && (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="flex items-center gap-2 p-2"
                      >
                        {user.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            removeItem(id, "member_ids")
                          }
                        />
                      </Badge>
                    )
                  );
                })}
              </div>
            </div>

            {/* المشاريع */}
            <div className="space-y-3 border-t pt-4">
              <Label className="font-bold">المشاريع المرتبطة</Label>
              <Select
                onValueChange={(val) =>
                  handleSelectChange(val, "project_ids")
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="اربط مشروعاً..." />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {safeProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.project_ids.map((id) => {
                  const proj = safeProjects.find((p) => p.id === id);
                  return (
                    proj && (
                      <Badge
                        key={id}
                        variant="outline"
                        className="flex items-center gap-2 p-2 border-primary"
                      >
                        {proj.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            removeItem(id, "project_ids")
                          }
                        />
                      </Badge>
                    )
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-row-reverse border-t pt-4">
            <Button onClick={handleSaveMember} className="px-8 bg-primary">
              حفظ البيانات
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا الفريق؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white"
            >
              حذف
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
