import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share, 
  MoreVertical,
  File,
  FileText,
  FileImage,
  FileVideo,
  FolderOpen,
  Grid,
  List,
  Calendar,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

interface FileItem {
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

const Files = () => {
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

  const files = [
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
      id: 4,
      name: "كود المصدر النسخة 1.zip",
      type: "archive",
      size: "12.3 MB",
      uploadDate: "2024-01-05",
      uploadedBy: "محمد خالد",
      project: "نظام إدارة المخزون",
      downloads: 25,
      shared: false
    },
    {
      id: 5,
      name: "لقطات شاشة التطبيق.png",
      type: "image",
      size: "800 KB",
      uploadDate: "2024-01-11",
      uploadedBy: "عمر حسن",
      project: "تطبيق الهاتف المحمول",
      downloads: 12,
      shared: true
    },
    {
      id: 6,
      name: "فيديو توضيحي للمنتج.mp4",
      type: "video",
      size: "25.7 MB",
      uploadDate: "2024-01-13",
      uploadedBy: "ليلى محمود",
      project: "حملة التسويق الرقمي",
      downloads: 7,
      shared: true
    },
    {
      id: 7,
      name: "قاعدة البيانات التصميمية.sql",
      type: "database",
      size: "3.1 MB",
      uploadDate: "2024-01-09",
      uploadedBy: "محمد خالد",
      project: "نظام إدارة المخزون",
      downloads: 5,
      shared: false
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
      case "presentation":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "image":
        return <FileImage className="h-8 w-8 text-green-600" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-purple-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "image":
        return "bg-green-100 text-green-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "design":
        return "bg-pink-100 text-pink-800";
      case "archive":
        return "bg-orange-100 text-orange-800";
      case "database":
        return "bg-red-100 text-red-800";
      case "spreadsheet":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case "document":
        return "مستند";
      case "image":
        return "صورة";
      case "video":
        return "فيديو";
      case "design":
        return "تصميم";
      case "archive":
        return "أرشيف";
      case "database":
        return "قاعدة بيانات";
      case "spreadsheet":
        return "جدول بيانات";
      case "presentation":
        return "عرض تقديمي";
      default:
        return "ملف";
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, file) => {
    const sizeInMB = parseFloat(file.size.replace(/[^\d.]/g, ''));
    return sum + (file.size.includes('KB') ? sizeInMB / 1024 : sizeInMB);
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
      description: selectedFile ? "تم تحديث بيانات الملف بنجاح" : "تم رفع الملف بنجاح"
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

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">الملفات</h1>
          <p className="text-lg text-muted-foreground">إدارة ومشاركة ملفات المشاريع</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2" onClick={() => handleOpenDialog()}>
            <Upload className="h-4 w-4" />
            رفع ملف
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{files.length}</p>
              <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} MB</p>
              <p className="text-sm text-muted-foreground">المساحة المستخدمة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {files.filter(f => f.shared).length}
              </p>
              <p className="text-sm text-muted-foreground">ملفات مشتركة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {files.reduce((sum, f) => sum + f.downloads, 0)}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي التحميلات</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث في الملفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع الملف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="document">مستندات</SelectItem>
            <SelectItem value="image">صور</SelectItem>
            <SelectItem value="video">فيديو</SelectItem>
            <SelectItem value="design">تصميم</SelectItem>
            <SelectItem value="archive">أرشيف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{file.name}</h4>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 ml-2" />
                          تحميل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(file)}>
                          تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 ml-2" />
                          مشاركة
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFile(file.id)}>حذف</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge className={getFileTypeColor(file.type)} variant="outline">
                      {getFileTypeLabel(file.type)}
                    </Badge>
                    {file.shared && (
                      <Badge variant="secondary">مشترك</Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {file.uploadedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {file.uploadDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {file.downloads} تحميل
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate">
                    {file.project}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-right p-4 font-medium">الملف</th>
                    <th className="text-right p-4 font-medium">النوع</th>
                    <th className="text-right p-4 font-medium">الحجم</th>
                    <th className="text-right p-4 font-medium">المشروع</th>
                    <th className="text-right p-4 font-medium">رفع بواسطة</th>
                    <th className="text-right p-4 font-medium">التاريخ</th>
                    <th className="text-right p-4 font-medium">التحميلات</th>
                    <th className="text-right p-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            {file.shared && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                مشترك
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getFileTypeColor(file.type)} variant="outline">
                          {getFileTypeLabel(file.type)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{file.size}</td>
                      <td className="p-4 text-sm text-muted-foreground">{file.project}</td>
                      <td className="p-4 text-sm text-muted-foreground">{file.uploadedBy}</td>
                      <td className="p-4 text-sm text-muted-foreground">{file.uploadDate}</td>
                      <td className="p-4 text-sm text-muted-foreground">{file.downloads}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 ml-2" />
                              تحميل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDialog(file)}>
                              تعديل البيانات
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 ml-2" />
                              مشاركة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFile(file.id)}>حذف</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد ملفات</h3>
          <p className="mt-2 text-muted-foreground">لم يتم العثور على ملفات تطابق معايير البحث</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
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
                <Label htmlFor="file">الملف *</Label>
                <Input
                  id="file"
                  type="file"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  الحد الأقصى لحجم الملف: 50 ميجابايت
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fileName">اسم الملف *</Label>
              <Input
                id="fileName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسم الملف"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileType">نوع الملف</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="project">المشروع *</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="اسم المشروع المرتبط بالملف"
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="checkbox"
                id="shared"
                checked={formData.shared}
                onChange={(e) => setFormData({ ...formData, shared: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="shared" className="cursor-pointer">
                مشاركة الملف مع الفريق
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveFile}>
              {selectedFile ? "حفظ التعديلات" : "رفع الملف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الملف نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Files;