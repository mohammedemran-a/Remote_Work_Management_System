// src/pages/Projects.tsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project as ApiProject,
  ProjectPayload,
} from "@/api/project";
import { fetchUsers, User as ApiUser } from "@/api/users";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, MoreVertical, FolderOpen, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectViewData {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  manager: ApiUser | null;
  teamCount: number;
  totalTasks: number;
  completedTasks: number;
}

const ProjectsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ApiProject | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery<ApiProject[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // ✅✅✅ ====== الإصلاح النهائي والدقيق هنا ====== ✅✅✅
  const processedProjects = useMemo((): ProjectViewData[] => {
    // هذا هو النطاق الصحيح لـ useMemo
    if (!projectsData || !usersData || !user) {
      return []; // إذا كانت البيانات غير جاهزة، أرجع مصفوفة فارغة
    }

    const usersMap = new Map(usersData.map((u) => [u.id, u]));
    
    const canViewAll = hasPermission("projects_view_all");
    const visibleProjects = canViewAll
      ? projectsData
      : projectsData.filter(p => p.manager_id === user.id);

    return visibleProjects.map((p) => {
      const totalTasks = p.tasks_count ?? 0;
      const completedTasks = p.completedTasks ?? 0;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const status = progress === 100 ? "مكتمل" : p.status;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: status,
        progress: progress,
        startDate: p.start_date || "",
        endDate: p.end_date || "",
        manager: usersMap.get(p.manager_id) || null,
        teamCount: p.users_count ?? 0,
        totalTasks: totalTasks,
        completedTasks: completedTasks,
      };
    });
  }, [projectsData, usersData, user, hasPermission]); // مصفوفة الاعتماديات في مكانها الصحيح

  const filteredProjects = useMemo(() => {
    // هذا الـ useMemo يعتمد على `processedProjects` التي هي الآن دائمًا مصفوفة
    return processedProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [processedProjects, searchTerm, filterStatus]);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDialogOpen(false);
      setIsDeleteDialogOpen(false);
    },
  };

  const createMutation = useMutation({
    mutationFn: createProject,
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "تم الإنشاء بنجاح", description: "تمت إضافة المشروع الجديد." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: Partial<ProjectPayload> }) => updateProject(vars.id, vars.data),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "تم التحديث بنجاح", description: "تم حفظ تغييرات المشروع." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "تم الحذف بنجاح", description: "تم حذف المشروع بشكل دائم." });
    },
  });

  const handleOpenDialog = (projectId?: number) => {
    const project = projectsData?.find(p => p.id === projectId) || null;
    setProjectToEdit(project);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  if (isLoadingProjects || isLoadingUsers) {
    return <div className="p-8 text-center">جاري تحميل البيانات...</div>;
  }
  
  if (!user || !hasPermission("projects_view")) {
    return <div className="p-8 text-center text-red-600">ليس لديك صلاحية لعرض هذه الصفحة.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المشاريع</h1>
          <p className="text-muted-foreground">تتبع وإدارة جميع مشاريعك من مكان واحد.</p>
        </div>
        {hasPermission("projects_create") && (
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> مشروع جديد
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ابحث بالاسم أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "نشط", "مكتمل", "مؤجل"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
            >
              {status === "all" ? "الكل" : status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleOpenDialog(project.id)}
              onDelete={() => handleDeleteClick(project.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">لا توجد مشاريع</h3>
            <p className="mt-2 text-sm text-muted-foreground">لم يتم العثور على مشاريع تطابق بحثك.</p>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <ProjectDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          project={projectToEdit}
          users={usersData || []}
          createFn={createMutation.mutate}
          updateFn={updateMutation.mutate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteAlert
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => projectToDelete && deleteMutation.mutate(projectToDelete)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }: { project: ProjectViewData; onEdit: () => void; onDelete: () => void; }) => {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-800";
      case "مكتمل": return "bg-blue-100 text-blue-800";
      case "مؤجل": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge className={cn("font-semibold", getStatusClass(project.status))}>{project.status}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasPermission("projects_edit") && <DropdownMenuItem onClick={onEdit}>تعديل</DropdownMenuItem>}
              {hasPermission("projects_delete") && <DropdownMenuItem className="text-red-500" onClick={onDelete}>حذف</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="pt-2 cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>{project.name}</CardTitle>
        <p className="text-sm text-muted-foreground pt-1 line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">التقدم</span>
            <span className="font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">أنجزت {project.completedTasks} من {project.totalTasks} مهمة</p>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>ينتهي في: {project.endDate || "غير محدد"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{project.teamCount} أعضاء</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{project.manager?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{project.manager?.name}</p>
                    <p className="text-xs text-muted-foreground">مدير المشروع</p>
                </div>
            </div>
          <Button size="sm" onClick={() => navigate(`/projects/${project.id}`)}>عرض التفاصيل</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectDialog = ({ isOpen, onClose, project, users, createFn, updateFn, isLoading }: {
    isOpen: boolean;
    onClose: () => void;
    project: ApiProject | null;
    users: ApiUser[];
    createFn: (payload: ProjectPayload) => void;
    updateFn: (vars: { id: number; data: Partial<ProjectPayload> }) => void;
    isLoading: boolean;
}) => {
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status === 'مكتمل' ? 'نشط' : (project?.status || "نشط"),
    manager_id: project?.manager_id || (hasPermission("projects_assign_all") ? "" : user?.id),
    end_date: project?.end_date || "",
  });

  const handleSubmit = () => {
    const payload: ProjectPayload = { ...formData, manager_id: Number(formData.manager_id), start_date: new Date().toISOString().split('T')[0] };
    if (project) {
      updateFn({ id: project.id, data: payload });
    } else {
      createFn(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{project ? "تعديل المشروع" : "مشروع جديد"}</DialogTitle>
          <DialogDescription>أدخل تفاصيل المشروع. سيتم حساب التقدم تلقائيًا.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المشروع</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="مؤجل">مؤجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ التسليم</Label>
              <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
          </div>
          {hasPermission("projects_assign_all") && (
            <div className="space-y-2">
              <Label htmlFor="manager">مدير المشروع</Label>
              <Select value={String(formData.manager_id)} onValueChange={(value) => setFormData({ ...formData, manager_id: value })}>
                <SelectTrigger><SelectValue placeholder="اختر مدير المشروع" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "جاري الحفظ..." : "حفظ"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAlert = ({ isOpen, onClose, onConfirm, isLoading }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent dir="rtl">
      <AlertDialogHeader>
        <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
        <AlertDialogDescription>
          لا يمكن التراجع عن هذا الإجراء. سيتم حذف المشروع وجميع المهام المرتبطة به بشكل دائم.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
          {isLoading ? "جاري الحذف..." : "تأكيد الحذف"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ProjectsPage;
