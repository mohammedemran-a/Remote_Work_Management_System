// src/pages/Projects.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  ProjectPayload,
} from "@/api/project";
import { useUsersStore } from "@/store/useUsersStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Calendar,
  Users,
  MoreVertical,
  FolderOpen,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
  manager_id: number;
  manager_name: string;
  tasks: number;
  completedTasks: number;
  teamMembers: number;
}

interface ApiTask {
  id: number;
}

interface ApiUser {
  id: number;
}

interface ProjectAPIResponse {
  id: number;
  name?: string;
  description?: string;
  status: string;
  tasks?: ApiTask[] | number;
  users?: ApiUser[];
  tasks_count?: number;
  users_count?: number;
  completedTasks?: number;
  start_date?: string;
  end_date?: string;
  manager_id: number;
  manager?: { name?: string };
  teamMembers?: number;
}

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const [supervisorSearch, setSupervisorSearch] = useState("");
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "نشط",
    start_date: "",
    end_date: "",
    manager_id: 0,
  });

  const { users, loadUsers, loading: usersLoading } = useUsersStore();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const projectsData: ProjectAPIResponse[] = await getProjects();

      // ✅====== التعديل المطلوب هنا ======✅
      // تحقق إذا كان المستخدم لديه صلاحية عرض جميع المشاريع
      const canViewAll = hasPermission("projects_view_all");

      // فلترة البيانات بناءً على الصلاحية
      const filteredData = canViewAll
        ? projectsData // إذا كان لديه الصلاحية، اعرض كل المشاريع
        : projectsData.filter((p) => p.manager_id === currentUserId); // وإلا، اعرض فقط المشاريع التي يشرف عليها

      return filteredData.map((p) => {
        const tasksCount =
          p.tasks_count ?? (Array.isArray(p.tasks) ? p.tasks.length : p.tasks ?? 0);
        const teamMembersCount =
          p.users_count ?? (Array.isArray(p.users) ? p.users.length : p.teamMembers ?? 0);
        const completedTasksCount = p.completedTasks ?? 0;

        return {
          id: p.id,
          name: p.name || "",
          description: p.description || "",
          status: p.status || "نشط",
          tasks: Number(tasksCount),
          completedTasks: Number(completedTasksCount),
          progress:
            tasksCount > 0
              ? Math.round((completedTasksCount / tasksCount) * 100)
              : 0,
          start_date: p.start_date || "",
          end_date: p.end_date || "",
          manager_id: p.manager_id,
          manager_name: p.manager?.name || "",
          teamMembers: Number(teamMembersCount),
        };
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectPayload) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "تم الإضافة", description: "تم إنشاء المشروع بنجاح" });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectPayload> }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "تم التحديث", description: "تم تعديل المشروع بنجاح" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "تم الحذف", description: "تم حذف المشروع بنجاح" });
      setIsDeleteDialogOpen(false);
    },
  });

  const filteredProjects = projects.filter((project) => {
    const name = project.name ?? "";
    const description = project.description ?? "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleOpenDialog = (project?: Project) => {
    if (!hasPermission(project ? "projects_edit" : "projects_create") && !project)
      return;

    if (project) {
      setSelectedProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        manager_id: project.manager_id,
      });
      setSupervisorSearch(project.manager_name);
    } else {
      setSelectedProject(null);
      setFormData({
        name: "",
        description: "",
        status: "نشط",
        start_date: "",
        end_date: "",
        manager_id: currentUserId, // افتراضيًا المستخدم الحالي كمشرف
      });
      setSupervisorSearch("");
    }
    setShowSupervisorDropdown(false);
    setIsDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!formData.name || !formData.description || !formData.manager_id) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const payload: ProjectPayload = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      manager_id: formData.manager_id,
    };

    if (selectedProject) {
      if (!hasPermission("projects_edit")) return;
      updateMutation.mutate({ id: selectedProject.id, data: payload });
    } else {
      if (!hasPermission("projects_create")) return;
      createMutation.mutate(payload);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    if (!hasPermission("projects_delete")) return;
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) deleteMutation.mutate(projectToDelete);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800";
      case "مكتمل":
        return "bg-blue-100 text-blue-800";
      case "مؤجل":
        return "bg-yellow-100 text-yellow-800";
      case "مؤرشف":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">جار تحميل المشاريع...</p>
      </div>
    );
  }

  if (isError) return <p>حدث خطأ أثناء جلب المشاريع.</p>;

  if (!hasPermission("projects_view")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">ليس لديك صلاحية عرض المشاريع</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* --- العنوان + زر إضافة مشروع --- */}
      {hasPermission("projects_create") && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">المشاريع</h1>
            <p className="text-lg text-muted-foreground">
              إدارة وتتبع جميع مشاريع الشركة
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="h-4 w-4" /> مشروع جديد
          </Button>
        </div>
      )}

      {/* --- فلاتر البحث --- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        <div className="flex gap-2">
          {["all", "نشط", "مكتمل", "مؤجل", "مؤرشف"].map((status) => (
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

      {/* --- شبكة المشاريع --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              لا توجد مشاريع
            </h3>
            <p className="mt-2 text-muted-foreground">
              لم يتم العثور على مشاريع تطابق معايير البحث
            </p>
          </div>
        )}
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                {(hasPermission("projects_edit") ||
                  hasPermission("projects_delete")) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {hasPermission("projects_edit") && (
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(project)}
                        >
                          تعديل
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        عرض التفاصيل
                      </DropdownMenuItem>
                      {hasPermission("projects_delete") && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          حذف
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{project.end_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{project.teamMembers} أعضاء</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  المهام: {project.completedTasks}/{project.tasks}
                </span>
                <span className="text-muted-foreground">
                  {project.tasks > 0
                    ? Math.round((project.completedTasks / project.tasks) * 100)
                    : 0}
                  % مكتمل
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Dialog إضافة/تعديل مشروع --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
            </DialogTitle>
            <DialogDescription>
              {selectedProject
                ? "قم بتعديل بيانات المشروع"
                : "قم بإدخال تفاصيل المشروع الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* --- اسم المشروع --- */}
            <div className="space-y-2">
              <Label htmlFor="name">اسم المشروع *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* --- الوصف --- */}
            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* --- حالة المشروع --- */}
            <div className="space-y-2">
              <Label htmlFor="status">حالة المشروع</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                  <SelectItem value="مؤجل">مؤجل</SelectItem>
                  <SelectItem value="مؤرشف">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- اختيار المشرف --- */}
            <div className="space-y-2 relative">
              <Label htmlFor="supervisor">المشرف *</Label>
              <Input
                id="supervisor"
                value={supervisorSearch}
                onChange={(e) => {
                  setSupervisorSearch(e.target.value);
                  setShowSupervisorDropdown(true);
                  if (!e.target.value)
                    setFormData({ ...formData, manager_id: 0 });
                }}
                onFocus={() => setShowSupervisorDropdown(true)}
              />
              {showSupervisorDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {users
                    .filter((s) =>
                      s.name
                        .toLowerCase()
                        .includes(supervisorSearch.toLowerCase())
                    )
                    .map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          "px-3 py-2 cursor-pointer hover:bg-accent flex items-center justify-between",
                          formData.manager_id === s.id && "bg-accent"
                        )}
                        onClick={() => {
                          setFormData({ ...formData, manager_id: s.id });
                          setSupervisorSearch(s.name);
                          setShowSupervisorDropdown(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            formData.manager_id === s.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>{s.name}</span>
                      </div>
                    ))}
                  {users.filter((s) =>
                    s.name
                      .toLowerCase()
                      .includes(supervisorSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="px-3 py-2 text-muted-foreground">
                      لم يتم العثور على مشرف
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- تواريخ البدء والانتهاء --- */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">تاريخ البدء</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">تاريخ الانتهاء</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveProject}>
              {selectedProject ? "حفظ التعديلات" : "إضافة المشروع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Alert Delete --- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              هل أنت متأكد؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيتم حذف المشروع نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDelete}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
