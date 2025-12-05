// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { UITask } from "./TaskCard";

// export interface TaskFormData {
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   assigned_to?: number | ""; // id of user
//   project_id?: number | ""; // id of project
//   dueDate?: string;
//   tags: string; // comma separated
// }

// interface UserOption {
//   id: number;
//   name: string;
// }

// interface ProjectOption {
//   id: number;
//   name: string;
// }

// interface TaskDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   selectedTask: UITask | null;
//   formData: TaskFormData;
//   onFormChange: (data: TaskFormData) => void;
//   onSave: () => void;
//   users: UserOption[];
//   projects: ProjectOption[];
// }

// interface DeleteDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConfirm: () => void;
// }

// export const TaskFormDialog = ({
//   isOpen,
//   onOpenChange,
//   selectedTask,
//   formData,
//   onFormChange,
//   onSave,
//   users,
//   projects,
// }: TaskDialogProps) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
//         <DialogHeader>
//           <DialogTitle>{selectedTask ? "تعديل المهمة" : "إضافة مهمة جديدة"}</DialogTitle>
//           <DialogDescription>
//             {selectedTask ? "قم بتعديل بيانات المهمة" : "قم بإدخال تفاصيل المهمة الجديدة"}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">عنوان المهمة *</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
//               placeholder="أدخل عنوان المهمة"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">الوصف *</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
//               placeholder="أدخل وصف المهمة"
//               rows={3}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="status">الحالة</Label>
//               <Select value={formData.status} onValueChange={(value) => onFormChange({ ...formData, status: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="جديدة">جديدة</SelectItem>
//                   <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
//                   <SelectItem value="مكتملة">مكتملة</SelectItem>
//                   <SelectItem value="متأخرة">متأخرة</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="priority">الأولوية</Label>
//               <Select value={formData.priority} onValueChange={(value) => onFormChange({ ...formData, priority: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="عالية">عالية</SelectItem>
//                   <SelectItem value="متوسطة">متوسطة</SelectItem>
//                   <SelectItem value="منخفضة">منخفضة</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="assigned_to">المسؤول</Label>
//               <Select
//                 value={formData.assigned_to?.toString() ?? ""}
//                 onValueChange={(value) => onFormChange({ ...formData, assigned_to: value ? Number(value) : "" })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="">غير محدد</SelectItem>
//                   {users.map(u => (
//                     <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="project_id">المشروع</Label>
//               <Select
//                 value={formData.project_id?.toString() ?? ""}
//                 onValueChange={(value) => onFormChange({ ...formData, project_id: value ? Number(value) : "" })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="">غير محدد</SelectItem>
//                   {projects.map(p => (
//                     <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="dueDate">تاريخ التسليم</Label>
//             <Input
//               id="dueDate"
//               type="date"
//               value={formData.dueDate ?? ""}
//               onChange={(e) => onFormChange({ ...formData, dueDate: e.target.value })}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
//             <Input
//               id="tags"
//               value={formData.tags}
//               onChange={(e) => onFormChange({ ...formData, tags: e.target.value })}
//               placeholder="تصميم, برمجة, اختبار"
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             إلغاء
//           </Button>
//           <Button onClick={onSave}>
//             {selectedTask ? "حفظ التعديلات" : "إضافة المهمة"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export const TaskDeleteDialog = ({ isOpen, onOpenChange, onConfirm }: DeleteDialogProps) => {
//   return (
//     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
//       <AlertDialogContent dir="rtl">
//         <AlertDialogHeader>
//           <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
//           <AlertDialogDescription>
//             سيتم حذف المهمة نهائياً ولا يمكن التراجع عن هذا الإجراء.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>إلغاء</AlertDialogCancel>
//           <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
//             حذف
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };
