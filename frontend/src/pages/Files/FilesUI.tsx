import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Search,
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
  User,
  Lock,
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
import { ProjectFile } from "@/api/projectFiles";

/* ================= Permissions Props ================= */
interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  viewMode: string;
  setViewMode: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  files: ProjectFile[];
  filteredFiles: ProjectFile[];
  totalSize: number;
  loading: boolean;
  handleOpenDialog: (file?: ProjectFile) => void;
  handleDeleteFile: (id: number) => void;
  downloadFile: (id: number, name: string) => void;
  hasPermission: (permission: string) => boolean;
}

/* ================= Helpers ================= */
const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
    case "doc":
    case "docx":
    case "presentation":
      return <FileText className="h-8 w-8 text-blue-600" />;
    case "jpg":
    case "png":
    case "image":
      return <FileImage className="h-8 w-8 text-green-600" />;
    case "mp4":
    case "video":
      return <FileVideo className="h-8 w-8 text-purple-600" />;
    default:
      return <File className="h-8 w-8 text-gray-600" />;
  }
};

const getFileTypeColor = (type: string) => {
  switch (type) {
    case "pdf":
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-800";
    case "jpg":
    case "png":
      return "bg-green-100 text-green-800";
    case "mp4":
      return "bg-purple-100 text-purple-800";
    case "zip":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getFileTypeLabel = (type: string) => {
  switch (type) {
    case "pdf":
      return "PDF";
    case "doc":
    case "docx":
      return "مستند";
    case "jpg":
    case "png":
      return "صورة";
    case "mp4":
      return "فيديو";
    case "zip":
      return "أرشيف";
    default:
      return type.toUpperCase();
  }
};

const formatSize = (size: number) => {
  if (!size) return "0 MB";
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

/* ================= Component ================= */
const FilesUI = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filterType,
  setFilterType,
  files,
  filteredFiles,
  totalSize,
  loading,
  handleOpenDialog,
  handleDeleteFile,
  downloadFile,
  hasPermission,
}: Props) => {
  if (!loading && !hasPermission("files_view")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">
          ليس لديك صلاحية عرض صفحة الملفات
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">الملفات</h1>
          <p className="text-lg text-muted-foreground">
            إدارة ومشاركة ملفات المشاريع
          </p>
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

          {/* Upload Permission */}
          {hasPermission("files_create") && (
            <Button
              className="flex items-center gap-2"
              onClick={() => handleOpenDialog()}
            >
              <Upload className="h-4 w-4" />
              رفع ملف
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{files.length}</p>
            <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalSize.toFixed(1)} MB</p>
            <p className="text-sm text-muted-foreground">المساحة المستخدمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {files.filter((f) => f.shared).length}
            </p>
            <p className="text-sm text-muted-foreground">ملفات مشتركة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {files.reduce((sum, f) => sum + f.downloads, 0)}
            </p>
            <p className="text-sm text-muted-foreground">إجمالي التحميلات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />
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
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">مستندات</SelectItem>
            <SelectItem value="jpg">صور</SelectItem>
            <SelectItem value="mp4">فيديو</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-muted-foreground">
          جاري تحميل الملفات...
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <h4 className="font-medium text-sm truncate">
                        {file.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {(hasPermission("files_edit") ||
                    hasPermission("files_delete")) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => downloadFile(file.id, file.name)}
                        >
                          <Download className="ml-2 h-4 w-4" /> تحميل
                        </DropdownMenuItem>

                        {hasPermission("files_edit") && (
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(file)}
                          >
                            تعديل البيانات
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>
                          <Share className="ml-2 h-4 w-4" /> مشاركة
                        </DropdownMenuItem>

                        {hasPermission("files_delete") && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            حذف
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex gap-2">
                  <Badge className={getFileTypeColor(file.type)}>
                    {getFileTypeLabel(file.type)}
                  </Badge>
                  {file.shared && <Badge variant="secondary">مشترك</Badge>}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {file.uploader?.name || "غير معروف"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(file.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {file.downloads} تحميل
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    {file.project?.name || "بدون مشروع"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">لا توجد ملفات</h3>
          <p className="mt-2 text-muted-foreground">
            لم يتم العثور على ملفات تطابق البحث
          </p>
        </div>
      )}
    </>
  );
};

export default FilesUI;
