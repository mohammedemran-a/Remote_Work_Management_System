// src/pages/Files/useFilesState.tsx
import { useEffect, useState } from "react";
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

export const useFilesState = () => {
  const { toast } = useToast();

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

  // بيانات النموذج
  const [formData, setFormDataState] = useState({
    name: "",
    type: "document", // هذا الحقل اختياري، فقط للعرض
    project_id: 0,
    shared: false,
  });

  // دالة لتحديث جزئي للنموذج
  const setFormData = (data: Partial<typeof formData>) =>
    setFormDataState(prev => ({ ...prev, ...data }));

  // =========================
  // جلب الملفات
  // =========================
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await getProjectFiles();
      setFiles(res.data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الملفات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // فلترة الملفات
  // =========================
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;

  // =========================
  // فتح نافذة رفع أو تعديل
  // =========================
  const handleOpenDialog = (file?: ProjectFile) => {
    if (file) {
      setSelectedFile(file);
      setFormData({
        name: file.name,
        type: file.type || "document",
        project_id: file.project_id,
        shared: file.shared,
      });
    } else {
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

  // =========================
  // حفظ أو رفع ملف
  // =========================
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
        // تعديل الملف
        await updateProjectFile(selectedFile.id, {
          name: formData.name,
          shared: formData.shared,
        });
        toast({ title: "تم التحديث بنجاح" });
      } else {
        // رفع ملف جديد
        if (!uploadedFile) {
          toast({
            title: "خطأ",
            description: "يرجى اختيار ملف",
            variant: "destructive",
          });
          return;
        }

        // إعداد FormData للرفع
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

  // =========================
  // حذف ملف
  // =========================
  const handleDeleteFile = (id: number) => {
    setFileToDelete(id);
    setIsDeleteDialogOpen(true);
  };

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

  // =========================
  // تحميل ملف
  // =========================
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
    fileToDelete,
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
  };
};
