// src/pages/Team/TeamDialogs.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TeamMember } from "./useTeamState";
import { User } from "@/api/users"; // 🟢 استيراد الواجهة الموحدة

// --- تعريف الخصائص (Props) التي يستقبلها المكون ---
interface Props {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  formData: any;
  setFormData: (formData: any) => void;
  handleSaveMember: () => void;
  confirmDelete: () => void;
  availableUsers: User[];
  selectedMember: TeamMember | null;
}

export const TeamDialogs = ({
  isAddDialogOpen, setIsAddDialogOpen,
  isDeleteDialogOpen, setIsDeleteDialogOpen,
  formData, setFormData,
  handleSaveMember, confirmDelete,
  availableUsers, selectedMember,
}: Props) => {
  return (
    <>
      {/* ======================================= */}
      {/* ====== نافذة الإضافة والتعديل ====== */}
      {/* ======================================= */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{selectedMember ? "تعديل بيانات العضو" : "إضافة عضو جديد للفريق"}</DialogTitle>
            <DialogDescription>{selectedMember ? "قم بتعديل معلومات العضو" : "اختر مستخدمًا وأكمل بياناته لإضافته للفريق"}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* --- حقل اختيار المستخدم (يظهر فقط عند الإضافة) --- */}
            {!selectedMember && (
              <div className="space-y-2">
                <Label htmlFor="userId">اختر المستخدم *</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستخدم من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          {/* 🟢 عرض الدور الأول للمستخدم */}
                          <span className="text-xs text-muted-foreground">
                            {user.email} - {user.roles[0]?.name || 'بلا دور'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* --- عرض بيانات المستخدم عند التعديل --- */}
            {selectedMember && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedMember.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedMember.user.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- بقية حقول النموذج --- */}
            <div className="space-y-2">
              <Label htmlFor="department">القسم *</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="إدارة المشاريع">إدارة المشاريع</SelectItem>
                  <SelectItem value="التطوير">التطوير</SelectItem>
                  <SelectItem value="التصميم">التصميم</SelectItem>
                  <SelectItem value="الجودة">الجودة</SelectItem>
                  <SelectItem value="التسويق">التسويق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">الموقع *</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="المدينة، الدولة" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">تاريخ الانضمام *</Label>
                <Input id="joinDate" type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+966..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveMember}>{selectedMember ? "حفظ التعديلات" : "إضافة العضو"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================= */}
      {/* ====== نافذة تأكيد الحذف ====== */}
      {/* ======================================= */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إزالة هذا العضو من الفريق. هذا الإجراء لا يمكن التراجع عنه حاليًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              تأكيد الإزالة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamDialogs;
