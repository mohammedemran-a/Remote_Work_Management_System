// src/pages/Files/useFilesState.tsx

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getProjectFiles,
  uploadProjectFile,
  updateProjectFile,
  deleteProjectFile,
  downloadProjectFile,
  ProjectFile,
  ProjectFilePayload,
} from "@/api/projectFiles";
import { useAuthStore } from "@/store/useAuthStore";

export const useFilesState = () => {
  const { toast } = useToast();
  // ✅ جلب الدالة والصلاحيات والمستخدم الحالي من useAuthStore
  const { hasPermission, user } = useAuthStore();

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [formData, setFormDataState] = useState({
    name: "",
    type: "document",
    project_id: 0,
    shared: false,
  });

  const setFormData = (data: Partial<typeof formData>) =>
    setFormDataState((prev) => ({ ...prev, ...data }));

  /**
   * 📥 جلب الملفات مع تطبيق الصلاحيات
   */
  const fetchFiles = useCallback(async () => {
    // لا تقم بالجلب إذا لم يكن المستخدم موجودًا أو لا يملك صلاحية العرض
    if (!user || !hasPermission("files_view")) {
      setFiles([]);
      return;
    }

    try {
      setLoading(true);
      const allFiles = (await getProjectFiles()).data;

      // ✅====== التعديل المطلوب هنا ======✅
      const canViewAll = hasPermission("files_view_all");

      if (canViewAll) {
        // إذا كان لديه صلاحية عرض الكل، اعرض جميع الملفات
        setFiles(allFiles);
      } else {
        // وإلا، قم بفلترة الملفات لعرض ملفات المشاريع التي هو عضو فيها فقط
        // نفترض أن `user.projects` يحتوي على IDs المشاريع التي ينتمي إليها المستخدم
        const userProjectIds = user.projects?.map(p => p.id) || [];
        const userFiles = allFiles.filter(file => userProjectIds.includes(file.project_id));
        setFiles(userFiles);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الملفات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, hasPermission, toast]); // ✅ إضافة user و hasPermission إلى الاعتماديات

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // ✅ استدعاء fetchFiles عند التغيير

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;

  /**
   * 🪟 فتح نافذة الإضافة / التعديل
   */
  const handleOpenDialog = (file?: ProjectFile) => {
    if (file) {
      if (!hasPermission("files_edit")) {
        toast({
          title: "غير مصرح لك",
          description: "لا تملك صلاحية تعديل الملفات",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setFormData({
        name: file.name,
        type: file.type || "document",
        project_id: file.project_id,
        shared: file.shared,
      });
    } else {
      if (!hasPermission("files_create")) {
        toast({
          title: "غير مصرح لك",
          description: "لا تملك صلاحية رفع ملفات",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(null);
      setFormData({
        name: "",
        type: "document",
        project_id: 0,
        shared: false,
      });
    }

    setUploadedFile(null);
    setIsDialogOpen(true);
  };

  /**
   * 💾 حفظ الملف
   */
  const handleSaveFile = async () => {
    if (!formData.project_id) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مشروع",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedFile) {
        if (!hasPermission("files_edit")) return;

        await updateProjectFile(selectedFile.id, {
          name: formData.name,
          shared: formData.shared,
        });

        toast({ title: "تم التحديث بنجاح" });
      } else {
        if (!hasPermission("files_create")) return;

        if (!uploadedFile) {
          toast({
            title: "خطأ",
            description: "يرجى اختيار ملف",
            variant: "destructive",
          });
          return;
        }

        const payload: ProjectFilePayload = {
          file: uploadedFile,
          project_id: formData.project_id,
          shared: formData.shared,
          name: formData.name || uploadedFile.name,
        };

        await uploadProjectFile(payload);
        toast({ title: "تم رفع الملف بنجاح" });
      }

      setIsDialogOpen(false);
      fetchFiles();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    }
  };

  /**
   * 🗑️ طلب حذف ملف
   */
  const handleDeleteFile = (id: number) => {
    if (!hasPermission("files_delete")) {
      toast({
        title: "غير مصرح لك",
        description: "لا تملك صلاحية حذف الملفات",
        variant: "destructive",
      });
      return;
    }

    setFileToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  /**
   * ✅ تأكيد الحذف
   */
  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      await deleteProjectFile(fileToDelete);
      toast({ title: "تم حذف الملف" });
      fetchFiles();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الملف",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  /**
   * ⬇️ تحميل ملف
   */
  const downloadFile = async (id: number, name: string) => {
    const res = await downloadProjectFile(id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return {
    files,
    loading,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    filterType,
    setFilterType,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedFile,
    formData,
    setFormData,
    uploadedFile,
    setUploadedFile,
    filteredFiles,
    totalSize,
    handleOpenDialog,
    handleSaveFile,
    handleDeleteFile,
    confirmDelete,
    downloadFile,
    hasPermission,
  };
};
