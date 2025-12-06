import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  project: string;
  downloads: number;
  shared: boolean;
}

export const useFilesState = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "document",
    project: "",
    shared: false
  });

  const files: FileItem[] = [
    {
      id: 1,
      name: "تصميم الواجهة الرئيسية.figma",
      type: "design",
      size: "2.5 MB",
      uploadDate: "2024-01-10",
      uploadedBy: "فاطمة علي",
      project: "تطوير موقع الشركة",
      downloads: 15,
      shared: true
    },
    {
      id: 2,
      name: "متطلبات المشروع.pdf",
      type: "document",
      size: "1.2 MB",
      uploadDate: "2024-01-08",
      uploadedBy: "أحمد محمد",
      project: "تطوير موقع الشركة",
      downloads: 8,
      shared: false
    },
    {
      id: 3,
      name: "عرض تقديمي للعميل.pptx",
      type: "presentation",
      size: "5.8 MB",
      uploadDate: "2024-01-12",
      uploadedBy: "سارة أحمد",
      project: "تطبيق الهاتف المحمول",
      downloads: 3,
      shared: true
    },
    {
      id: 8,
      name: "تقرير الأداء الشهري.xlsx",
      type: "spreadsheet",
      size: "1.5 MB",
      uploadDate: "2024-01-14",
      uploadedBy: "نور الدين",
      project: "تقارير الإدارة",
      downloads: 20,
      shared: true
    }
  ];

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || file.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, file) => {
    const sizeInMB = parseFloat(file.size.replace(/[^\d.]/g, ""));
    return sum + (file.size.includes("KB") ? sizeInMB / 1024 : sizeInMB);
  }, 0);

  const handleOpenDialog = (file?: FileItem) => {
    if (file) {
      setSelectedFile(file);
      setFormData({
        name: file.name,
        type: file.type,
        project: file.project,
        shared: file.shared
      });
    } else {
      setSelectedFile(null);
      setFormData({
        name: "",
        type: "document",
        project: "",
        shared: false
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveFile = () => {
    if (!formData.name || !formData.project) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(false);
    toast({
      title: selectedFile ? "تم التحديث" : "تم الرفع",
      description: selectedFile
        ? "تم تحديث بيانات الملف بنجاح"
        : "تم رفع الملف بنجاح"
    });
  };

  const handleDeleteFile = (fileId: number) => {
    setFileToDelete(fileId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false);
    toast({
      title: "تم الحذف",
      description: "تم حذف الملف بنجاح"
    });
  };

  return {
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
    files,
    filteredFiles,
    totalSize,
    handleOpenDialog,
    handleSaveFile,
    handleDeleteFile,
    confirmDelete
  };
};
