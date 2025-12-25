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
import { useAuthStore } from "@/store/useAuthStore"; // 1. استيراد useAuthStore

export const useFilesState = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuthStore(); // 2. الحصول على دالة التحقق من الصلاحيات

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

  const fetchFiles = async () => {
    if (!hasPermission("files_view")) { // 3. التحقق من صلاحية العرض
      toast({
        title: "غير مصرح لك",
        description: "ليس لديك صلاحية عرض الملفات.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
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

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;

  const handleOpenDialog = (file?: ProjectFile) => {
    if (file) {
      if (!hasPermission("files_edit")) { // 4. التحقق من صلاحية التعديل
        toast({ title: "غير مصرح لك", description: "لا تملك صلاحية تعديل الملفات.", variant: "destructive" });
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
      if (!hasPermission("files_create")) { // 5. التحقق من صلاحية الإنشاء
        toast({ title: "غير مصرح لك", description: "لا تملك صلاحية رفع ملفات جديدة.", variant: "destructive" });
        return;
      }
      setSelectedFile(null);
      setFormData({ name: "", type: "document", project_id: 0, shared: false });
    }
    setUploadedFile(null);
    setIsDialogOpen(true);
  };

  const handleSaveFile = async () => {
    // الصلاحيات تم التحقق منها في handleOpenDialog
    if (!formData.project_id) {
      toast({ title: "خطأ", description: "يرجى اختيار مشروع", variant: "destructive" });
      return;
    }

    try {
      if (selectedFile) {
        await updateProjectFile(selectedFile.id, {
          name: formData.name,
          shared: formData.shared,
        });
        toast({ title: "تم التحديث بنجاح" });
      } else {
        if (!uploadedFile) {
          toast({ title: "خطأ", description: "يرجى اختيار ملف", variant: "destructive" });
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
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" });
    }
  };

  const handleDeleteFile = (id: number) => {
    if (!hasPermission("files_delete")) { // 6. التحقق من صلاحية الحذف
      toast({ title: "غير مصرح لك", description: "لا تملك صلاحية حذف الملفات.", variant: "destructive" });
      return;
    }
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
      toast({ title: "خطأ", description: "فشل حذف الملف", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

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
    hasPermission, // 7. تمرير الدالة للواجهة
  };
};
