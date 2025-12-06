import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileItem } from "./useFilesState";

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (v: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (v: boolean) => void;
  selectedFile: FileItem | null;
  formData: {
    name: string;
    type: string;
    project: string;
    shared: boolean;
  };
  setFormData: (data: unknown) => void;
  handleSaveFile: () => void;
  confirmDelete: () => void;
}

const FilesDialogs = ({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedFile,
  formData,
  setFormData,
  handleSaveFile,
  confirmDelete,
}: Props) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{selectedFile ? "تعديل بيانات الملف" : "رفع ملف جديد"}</DialogTitle>
            <DialogDescription>
              {selectedFile ? "قم بتعديل معلومات الملف" : "قم بإدخال معلومات الملف الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!selectedFile && (
              <div className="space-y-2">
                <Label>الملف *</Label>
                <Input type="file" />
              </div>
            )}

            <div className="space-y-2">
              <Label>اسم الملف *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>نوع الملف</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">مستند</SelectItem>
                  <SelectItem value="image">صورة</SelectItem>
                  <SelectItem value="video">فيديو</SelectItem>
                  <SelectItem value="design">تصميم</SelectItem>
                  <SelectItem value="archive">أرشيف</SelectItem>
                  <SelectItem value="database">قاعدة بيانات</SelectItem>
                  <SelectItem value="spreadsheet">جدول بيانات</SelectItem>
                  <SelectItem value="presentation">عرض تقديمي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المشروع *</Label>
              <Input value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.shared} onChange={(e) => setFormData({ ...formData, shared: e.target.checked })} />
              <Label>مشاركة الملف مع الفريق</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveFile}>{selectedFile ? "حفظ التعديلات" : "رفع الملف"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف الملف نهائياً ولا يمكن التراجع.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FilesDialogs;
