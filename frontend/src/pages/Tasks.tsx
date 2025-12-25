
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask, TaskPayload, TaskResponse } from "@/api/task";
import { getProjects, ProjectPayload } from "@/api/project";
import { useUsersStore } from "@/store/useUsersStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Kanban, MoreVertical, CheckCircle2, Clock, AlertTriangle, Calendar, User as UserIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Tasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { users, loadUsers } = useUsersStore();
  const { hasPermission } = useAuthStore();

  const [projects, setProjects] = useState<(ProjectPayload & { id: number })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<TaskPayload>({
    title: "",
    description: "",
    status: "جديدة",
    priority: "متوسطة",
    assigned_to: 1,
    project_id: 1,
    due_date: ""
  });
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ جلب المهام (يعرض فقط إذا كانت لدى المستخدم صلاحية)
  const { data: tasks = [] } = useQuery<TaskResponse[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: hasPermission("tasks_view")
  });

  // ✅ جلب المشاريع
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.map(p => ({ ...p, id: p.id ?? 0 })));
      } catch (err) {
        toast({ title: "خطأ", description: "تعذر جلب المشاريع", variant: "destructive" });
      }
    };
    fetchProjects();
  }, [toast]);

  // ✅ جلب المستخدمين
  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ✅ إضافة
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "تمت إضافة المهمة" });
      setOpen(false);
    }
  });

  // ✅ تحديث
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "تم تحديث المهمة" });
      setOpen(false);
      setEditId(null);
    }
  });

  // ✅ حذف
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "تم حذف المهمة" });
      setDeleteId(null);
    }
  });

  // ✅ فلترة + بحث غير حساس لحالة الأحرف
  const filteredTasks = useMemo(() => tasks.filter(t => 
    (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) &&
    (filterStatus === "all" || t.status === filterStatus)
  ), [tasks, searchTerm, filterStatus]);

  // تقسيم المهام للـ Kanban + وضع متأخرة تلقائيًا
  const tasksByStatus = useMemo(() => {
    const statuses = ["جديدة", "قيد التنفيذ", "مكتملة", "متأخرة"];
    const result: Record<string, TaskResponse[]> = {};
    statuses.forEach(status => { result[status] = []; });
    filteredTasks.forEach(task => {
      const today = new Date().toISOString().split("T")[0];
      const statusKey = task.status !== "مكتملة" && task.due_date < today ? "متأخرة" : task.status;
      result[statusKey].push(task);
    });
    return result;
  }, [filteredTasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتملة": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "قيد التنفيذ": return <Clock className="w-4 h-4 text-blue-600" />;
      case "متأخرة": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority){
      case "عالية": return "bg-red-100 text-red-800";
      case "متوسطة": return "bg-yellow-100 text-yellow-800";
      case "منخفضة": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const openCreate = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      status: "جديدة",
      priority: "متوسطة",
      assigned_to: users[0]?.id ?? 1,
      project_id: projects[0]?.id ?? 1,
      due_date: ""
    });
    setOpen(true);
  };

  const openEdit = (task: TaskResponse) => {
    setEditId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to,
      project_id: task.project_id,
      due_date: task.due_date ?? ""
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editId) {
      if (!hasPermission("tasks_edit")) return toast({ title: "خطأ", description: "لا تمتلك صلاحية تعديل المهام", variant: "destructive" });
      updateMutation.mutate({ id: editId, data: form });
    } else {
      if (!hasPermission("tasks_create")) return toast({ title: "خطأ", description: "لا تمتلك صلاحية إنشاء المهام", variant: "destructive" });
      createMutation.mutate(form);
    }
  };

  // إذا لم يكن لدى المستخدم صلاحية عرض المهام
  if (!hasPermission("tasks_view")) {
    return <div className="text-center py-12 text-muted-foreground">
      <h3 className="text-lg font-medium">لا تمتلك صلاحية عرض المهام</h3>
    </div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* العنوان وأزرار العرض */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المهام</h1>
          <p className="text-muted-foreground">إدارة جميع المهام</p>
        </div>
        {hasPermission("tasks_create") && (
          <div className="flex gap-2">
            <Button variant={viewMode === "kanban" ? "default" : "outline"} onClick={() => setViewMode("kanban")}><Kanban className="w-4 h-4" /></Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>قائمة</Button>
            <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" />مهمة جديدة</Button>
          </div>
        )}
      </div>

      {/* البحث + فلترة */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pr-9" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48"><SelectValue placeholder="فلترة الحالة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="جديدة">جديدة</SelectItem>
            <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
            <SelectItem value="مكتملة">مكتملة</SelectItem>
            <SelectItem value="متأخرة">متأخرة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(tasksByStatus).map(([status, tks]) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{status}</h3>
              <Badge variant="secondary">{tks.length}</Badge>
            </div>
            <div className="space-y-2">
              {tks.map(task => (
                <Card key={task.id} className="p-3 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">{getStatusIcon(task.status)}<h4 className="font-medium text-sm">{task.title}</h4></div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      <div className="flex gap-2 mt-1"><Badge className={getPriorityColor(task.priority)} variant="outline">{task.priority}</Badge></div>
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        <UserIcon className="w-3 h-3" /> {users.find(u => u.id === task.assigned_to)?.name ?? "غير محدد"}
                        <Calendar className="w-3 h-3 ml-1" /> {task.due_date}
                      </div>
                    </div>
                    {(hasPermission("tasks_edit") || hasPermission("tasks_delete")) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-3 h-3" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {hasPermission("tasks_edit") && <DropdownMenuItem onClick={() => openEdit(task)}>تعديل</DropdownMenuItem>}
                          {hasPermission("tasks_delete") && <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(task.id)}>حذف</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>}

      {/* List View */}
      {viewMode === "list" && filteredTasks.length > 0 && filteredTasks.map(task => (
        <Card 
          key={task.id} 
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                {/* عنوان المهمة، الحالة والأولوية */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <h3 className="font-semibold text-foreground">{task.title}</h3>
                  <Badge>{task.status}</Badge>
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    {task.priority}
                  </Badge>
                </div>

                {/* وصف المهمة */}
                <p className="text-muted-foreground">{task.description}</p>

                {/* معلومات إضافية: المستخدم، الموعد، المشروع */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{users.find(u => u.id === task.assigned_to)?.name ?? "غير محدد"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{task.due_date ? `موعد التسليم: ${task.due_date}` : "لم يتم تحديد موعد"}</span>
                  </div>
                  <div>
                    <span>المشروع: {projects.find(p => p.id === task.project_id)?.name ?? "غير محدد"}</span>
                  </div>
                </div>
              </div>

              {/* قائمة الخيارات */}
              {(hasPermission("tasks_edit") || hasPermission("tasks_delete")) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {hasPermission("tasks_edit") && <DropdownMenuItem onClick={() => openEdit(task)}>تعديل</DropdownMenuItem>}
                    {hasPermission("tasks_delete") && <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(task.id)}>حذف</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {filteredTasks.length === 0 && <div className="text-center py-12 text-muted-foreground">
        <h3 className="text-lg font-medium">لا توجد مهام</h3>
        <p>لم يتم العثور على مهام تطابق معايير البحث</p>
      </div>}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editId ? "تعديل المهمة" : "إضافة مهمة"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>العنوان</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>الحالة</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as TaskPayload["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جديدة">جديدة</SelectItem>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتملة">مكتملة</SelectItem>
                    <SelectItem value="متأخرة">متأخرة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>الأولوية</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as TaskPayload["priority"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عالية">عالية</SelectItem>
                    <SelectItem value="متوسطة">متوسطة</SelectItem>
                    <SelectItem value="منخفضة">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>المسؤول</Label>
              <Select value={String(form.assigned_to)} onValueChange={v => setForm({ ...form, assigned_to: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{users.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>المشروع</Label>
              <Select value={String(form.project_id)} onValueChange={v => setForm({ ...form, project_id: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{projects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>تاريخ التسليم</Label><Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
          </div>
                    <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={handleSubmit}>{editId ? "تحديث" : "حفظ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog لتأكيد الحذف */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيتم حذف المهمة نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (hasPermission("tasks_delete") && deleteId) {
                  deleteMutation.mutate(deleteId);
                } else {
                  toast({ title: "خطأ", description: "لا تمتلك صلاحية حذف المهام", variant: "destructive" });
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Tasks;
