// src/pages/Files/FilesDialogs.tsx

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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ProjectFile } from "@/api/projectFiles";
import { useEffect, useState } from "react";
import { getProjects } from "@/api/project";

// =============
/// Types
// =============
interface Project {
  id: number;
  name: string;
}

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (v: boolean) => void;

  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (v: boolean) => void;

  selectedFile: ProjectFile | null;

  formData: {
    name: string;
    type: string;
    project_id: number;
    shared: boolean;
  };

  setFormData: (
    data: Partial<{
      name: string;
      type: string;
      project_id: number;
      shared: boolean;
    }>
  ) => void;

  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;

  handleSaveFile: () => void;
  confirmDelete: () => void;

  hasPermission: (permission: string) => boolean; // 👈 أضيفت فقط
}

// =============================
//  COMPONENT
// =============================
const FilesDialogs = ({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedFile,
  formData,
  setFormData,
  uploadedFile,
  setUploadedFile,
  handleSaveFile,
  confirmDelete,
  hasPermission,
}: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  // 🔐 صلاحيات الحفظ
  const isSaveDisabled = selectedFile
    ? !hasPermission("files_edit")
    : !hasPermission("files_create");

  return (
    <>
      {/* ========== MAIN DIALOG ========= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedFile ? "تعديل بيانات الملف" : "رفع ملف جديد"}
            </DialogTitle>
            <DialogDescription>
              {selectedFile
                ? "قم بتعديل معلومات الملف"
                : "قم بإدخال معلومات الملف الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* === Upload File === */}
            {!selectedFile && (
              <div className="space-y-2">
                <Label>الملف *</Label>
                <Input
                  type="file"
                  disabled={!hasPermission("files_create")}
                  onChange={(e) =>
                    e.target.files && setUploadedFile(e.target.files[0])
                  }
                />
              </div>
            )}

            {/* === File Name === */}
            <div className="space-y-2">
              <Label>اسم الملف *</Label>
              <Input
                value={formData.name}
                disabled={isSaveDisabled}
                onChange={(e) => setFormData({ name: e.target.value })}
              />
            </div>

            {/* === File Type === */}
            <div className="space-y-2">
              <Label>نوع الملف</Label>
              <Select
                value={formData.type}
                disabled={isSaveDisabled}
                onValueChange={(value) => setFormData({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الملف" />
                </SelectTrigger>
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

            {/* === Project === */}
            <div className="space-y-2">
              <Label>المشروع *</Label>
              <Select
                value={formData.project_id.toString()}
                disabled={isSaveDisabled}
                onValueChange={(value) =>
                  setFormData({ project_id: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* === Shared === */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={isSaveDisabled}
                checked={formData.shared}
                onChange={(e) => setFormData({ shared: e.target.checked })}
              />
              <Label>مشاركة الملف مع الفريق</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>

            {/* 🔐 زر الحفظ */}
            <Button onClick={handleSaveFile} disabled={isSaveDisabled}>
              {selectedFile ? "حفظ التعديلات" : "رفع الملف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== DELETE DIALOG ========= */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الملف نهائياً ولا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>

            {/* 🔐 زر الحذف */}
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={!hasPermission("files_delete")}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FilesDialogs;
