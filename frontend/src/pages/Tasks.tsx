import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// --- استيراد الأدوات والمكونات ---
import {
  getTasks, deleteTask, getProjectTeamMembers, submitTaskForReview, reviewTask, updateTask, createTask, TaskResponse, TaskStatus,
} from "@/api/task";
import { getProjects, Project } from "@/api/project";
import { User } from "@/api/users";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// ✅ 1. استيراد أيقونة التقويم
import { Plus, Search, MoreVertical, CheckCircle2, Clock, Send, MessageSquareWarning, ThumbsUp, ThumbsDown, Loader2, Calendar as CalendarIcon } from "lucide-react";

// --- الواجهات ---
interface TaskFormData {
  title: string; description: string; priority: "عالية" | "متوسطة" | "منخفضة"; project_id: number | null; assigned_to: number | null; due_date: string; status?: TaskStatus;
}

interface TaskCardProps {
  task: TaskResponse;
  projects: Project[];
  currentUser: User | null;
  hasPermission: (permission: string) => boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSubmitReview: () => void;
  onReject: () => void;
  reviewMutation: any;
}

// ===================================================================================
// 🎭 المكون الرئيسي للصفحة: TasksPage
// ===================================================================================
const TasksPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskResponse | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [reviewTaskData, setReviewTaskData] = useState<{ task: TaskResponse; action: 'approve' | 'reject' } | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: hasPermission("tasks_view"),
  });

  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: hasPermission("tasks_view"),
  });

  // ✅ 2. التحقق مما إذا كان المستخدم الحالي مديرًا لأي مشروع
  const isAnyManager = useMemo(() => {
    if (!user || !projects.length) return false;
    return projects.some(p => p.manager_id === user.id);
  }, [user, projects]);

  const submitReviewMutation = useMutation({
    mutationFn: submitTaskForReview,
    onSuccess: () => {
      toast({ title: "تم إرسال المهمة للمراجعة" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast({ title: "خطأ", description: "فشل إرسال المهمة للمراجعة", variant: "destructive" }),
  });

  const reviewTaskMutation = useMutation({
    mutationFn: reviewTask,
    onSuccess: (data, variables) => {
      const message = variables.payload.action === 'approve' ? "تمت الموافقة على المهمة بنجاح" : "تم رفض المهمة";
      toast({ title: message });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setReviewTaskData(null);
      setRejectionNotes("");
    },
    onError: () => toast({ title: "خطأ", description: "فشلت عملية المراجعة", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({ title: "تم حذف المهمة" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleteTaskId(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل حذف المهمة", variant: "destructive" }),
  });

  const canViewAllTasks = useCallback(() => hasPermission("tasks_view_all"), [hasPermission]);

  const filteredTasks = useMemo(() => {
    if (!user) return [];
    const canViewAll = canViewAllTasks();
    
    return tasks.filter(task => {
      const matchesUser = canViewAll || task.assigned_to === user.id;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      return matchesUser && matchesSearch && matchesStatus;
    });
  }, [tasks, user, searchTerm, filterStatus, canViewAllTasks]);

  const handleOpenForm = useCallback((task: TaskResponse | null) => {
    setEditTask(task);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (deleteTaskId && hasPermission("tasks_delete")) {
      deleteMutation.mutate(deleteTaskId);
    }
  }, [deleteTaskId, hasPermission, deleteMutation]);

  const handleReview = useCallback(() => {
    if (!reviewTaskData || reviewTaskData.action !== 'reject') return;
    const { task } = reviewTaskData;
    
    if (!rejectionNotes.trim()) {
      toast({ title: "خطأ", description: "يجب كتابة سبب الرفض", variant: "destructive" });
      return;
    }
    
    reviewTaskMutation.mutate({ taskId: task.id, payload: { action: 'reject', notes: rejectionNotes } });
  }, [reviewTaskData, rejectionNotes, reviewTaskMutation, toast]);

  if (isTasksLoading || isProjectsLoading) {
    return <div className="p-10 text-center">جاري تحميل البيانات...</div>;
  }

  if (!hasPermission("tasks_view")) {
    return <div className="p-10 text-center">ليس لديك صلاحية عرض المهام.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold">المهام</h1><p className="text-muted-foreground">إدارة وتتبع جميع المهام</p></div>
        {/* ✅ 3. تعديل شرط إظهار زر "مهمة جديدة" */}
        {isAnyManager && hasPermission("tasks_create") && (
          <Button onClick={() => handleOpenForm(null)} className="gap-2">
            <Plus /> مهمة جديدة
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="بحث في المهام..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" /></div>
        <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل الحالات</SelectItem><SelectItem value="جديدة">جديدة</SelectItem><SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem><SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem><SelectItem value="مكتملة">مكتملة</SelectItem></SelectContent></Select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              projects={projects}
              currentUser={user}
              hasPermission={hasPermission}
              onEdit={() => handleOpenForm(task)}
              onDelete={() => setDeleteTaskId(task.id)}
              onSubmitReview={() => submitReviewMutation.mutate(task.id)}
              onReject={() => setReviewTaskData({ task, action: 'reject' })}
              reviewMutation={reviewTaskMutation}
            />
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground"><h3 className="text-lg font-medium">لا توجد مهام</h3><p>لم يتم العثور على مهام تطابق معايير البحث الحالية.</p></div>
        )}
      </div>

      {isFormOpen && (<TaskFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} task={editTask} projects={projects} />)}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}><AlertDialogContent dir="rtl"><AlertDialogHeader><AlertDialogTitle>تأكيد الحذف</AlertDialogTitle></AlertDialogHeader><AlertDialogDescription>هل أنت متأكد من رغبتك في حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <Dialog open={!!reviewTaskData && reviewTaskData.action === 'reject'} onOpenChange={() => setReviewTaskData(null)}><DialogContent dir="rtl"><DialogHeader><DialogTitle>رفض المهمة</DialogTitle></DialogHeader><div className="py-4 space-y-2"><Label htmlFor="rejection-notes">سبب الرفض</Label><Textarea id="rejection-notes" value={rejectionNotes} onChange={(e) => setRejectionNotes(e.target.value)} placeholder="اكتب ملاحظات واضحة للعضو..." /></div><DialogFooter><Button variant="outline" onClick={() => setReviewTaskData(null)}>إلغاء</Button><Button onClick={handleReview} disabled={reviewTaskMutation.isPending}>تأكيد الرفض</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
};

// ===================================================================================
// 🃏 مكون بطاقة المهمة: TaskCard
// ===================================================================================
const TaskCard = ({ task, projects, currentUser, hasPermission, onEdit, onDelete, onSubmitReview, onReject, reviewMutation }: TaskCardProps) => {
  const project = useMemo(() => projects.find(p => p.id === task.project_id), [projects, task.project_id]);
  const isMyTask = task.assigned_to === currentUser?.id;
  const isManager = project?.manager_id === currentUser?.id;

  const getStatusInfo = (status: TaskStatus): { color: string; icon: React.ElementType; label: string } => {
    switch (status) {
      case "جديدة": return { color: "bg-gray-100 text-gray-800", icon: Clock, label: "جديدة" };
      case "قيد التنفيذ": return { color: "bg-blue-100 text-blue-800", icon: Clock, label: "قيد التنفيذ" };
      case "قيد المراجعة": return { color: "bg-purple-100 text-purple-800", icon: Send, label: "قيد المراجعة" };
      case "مكتملة": return { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مكتملة" };
      default: return { color: "bg-gray-100 text-gray-800", icon: Clock, label: status };
    }
  };
  const statusInfo = getStatusInfo(task.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <Badge className={cn("gap-1.5", statusInfo.color)}><statusInfo.icon className="h-3.5 w-3.5" /> {statusInfo.label}</Badge>
          </div>
          
          {/* ✅ 4. إضافة قسم التواريخ */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>تاريخ البدء: {new Date(task.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>تاريخ التسليم: {new Date(task.due_date).toLocaleDateString('ar-EG')}</span>
              </div>
            )}
          </div>

          {task.description && <p className="text-sm text-muted-foreground pt-2 border-t">{task.description}</p>}
          {task.review_notes && (<div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-md flex gap-3"><MessageSquareWarning className="h-5 w-5 flex-shrink-0" /><div><h4 className="font-semibold">ملاحظات المراجعة:</h4><p className="text-sm">{task.review_notes}</p></div></div>)}
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-2"><span>المسؤول: {task.assignee?.name || "غير محدد"}</span></div>
            <div className="flex items-center gap-2"><span>المشروع: {project?.name || "غير محدد"}</span></div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isMyTask && task.status === 'قيد التنفيذ' && (
            <Button size="sm" className="gap-2 w-full" onClick={onSubmitReview}><Send className="h-4 w-4" /> إرسال للمراجعة</Button>
          )}
          {isManager && task.status === 'قيد المراجعة' && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2" onClick={onReject}><ThumbsDown className="h-4 w-4" /> رفض</Button>
              <Button 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700" 
                onClick={() => reviewMutation.mutate({ taskId: task.id, payload: { action: 'approve' } })}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                موافقة
              </Button>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to={`/tasks/${task.id}`} className="cursor-pointer">عرض التفاصيل</Link></DropdownMenuItem>
              {(isManager && (hasPermission("tasks_edit") || hasPermission("tasks_delete"))) && <DropdownMenuSeparator />}
              {isManager && hasPermission("tasks_edit") && <DropdownMenuItem onClick={onEdit} className="cursor-pointer">تعديل</DropdownMenuItem>}
              {isManager && hasPermission("tasks_delete") && <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">حذف</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

// ===================================================================================
// 📝 مكون نموذج المهمة: TaskFormDialog
// ===================================================================================
const TaskFormDialog = ({ isOpen, onClose, task, projects }: { isOpen: boolean; onClose: () => void; task: TaskResponse | null; projects: Project[] }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const currentUser = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || "", description: task?.description || "", priority: task?.priority || "متوسطة", project_id: task?.project_id || null, assigned_to: task?.assigned_to || null, due_date: task?.due_date || "", status: task?.status || "جديدة",
  });

  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  const project = useMemo(() => projects.find(p => p.id === formData.project_id), [projects, formData.project_id]);
  const isManager = project?.manager_id === currentUser?.id;

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!formData.project_id) {
        setTeamMembers([]);
        setFormData(f => ({ ...f, assigned_to: null }));
        return;
      }
      setIsLoadingTeamMembers(true);
      try {
        const members = await getProjectTeamMembers(formData.project_id);
        setTeamMembers(members);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        toast({ title: "خطأ", description: "فشل جلب أعضاء الفريق", variant: "destructive" });
        setTeamMembers([]);
      } finally {
        setIsLoadingTeamMembers(false);
      }
    };
    fetchTeamMembers();
  }, [formData.project_id, toast]);

  useEffect(() => {
    if (teamMembers.length === 0 || !task) return;
    const isAssigneeInNewTeam = teamMembers.some(member => member.id === task.assigned_to);
    if (!isAssigneeInNewTeam) {
      setFormData(f => ({ ...f, assigned_to: null }));
    } else {
      setFormData(f => ({ ...f, assigned_to: task.assigned_to }));
    }
  }, [teamMembers, task]);

  const mutation = useMutation({
    mutationFn: (data: TaskFormData) => task ? updateTask({ id: task.id, data }) : createTask(data),
    onSuccess: () => {
      toast({ title: task ? "تم تحديث المهمة" : "تم إنشاء المهمة" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: () => toast({ title: "خطأ", description: "فشلت العملية", variant: "destructive" }),
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.project_id || !formData.assigned_to) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول الإلزامية (العنوان، المشروع، المسؤول)", variant: "destructive" });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader><DialogTitle>{task ? "تعديل المهمة" : "مهمة جديدة"}</DialogTitle></DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2"><Label htmlFor="title">العنوان *</Label><Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="project">المشروع *</Label><Select value={formData.project_id ? String(formData.project_id) : ""} onValueChange={v => setFormData({ ...formData, project_id: Number(v) })}><SelectTrigger><SelectValue placeholder="اختر مشروعًا..." /></SelectTrigger><SelectContent>{projects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="assignee">المسؤول *</Label><Select value={formData.assigned_to ? String(formData.assigned_to) : ""} onValueChange={v => setFormData({ ...formData, assigned_to: Number(v) })} disabled={!formData.project_id || isLoadingTeamMembers}><SelectTrigger>{isLoadingTeamMembers ? <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جاري جلب الأعضاء...</div> : <SelectValue placeholder="اختر مسؤولاً..." />}</SelectTrigger><SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="description">الوصف</Label><Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="priority">الأولوية</Label><Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="عالية">عالية</SelectItem><SelectItem value="متوسطة">متوسطة</SelectItem><SelectItem value="منخفضة">منخفضة</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="due_date">تاريخ التسليم</Label><Input id="due_date" type="date" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} /></div></div>
          {task && isManager && (<div className="space-y-2"><Label htmlFor="status">حالة المهمة</Label><Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as TaskStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="جديدة">جديدة</SelectItem><SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem></SelectContent></Select></div>)}
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>إلغاء</Button><Button onClick={handleSubmit} disabled={mutation.isPending}>{mutation.isPending ? "جاري الحفظ..." : "حفظ"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TasksPage;
