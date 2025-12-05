// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Calendar, User, MoreVertical, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export interface UITask {
//   id: number;
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   assigneeName: string;
//   assigneeId?: number;
//   projectName: string;
//   projectId?: number;
//   dueDate?: string;
//   createdDate?: string;
//   tags: string[];
// }

// interface TaskCardProps {
//   task: UITask;
//   variant: "list" | "kanban";
//   onEdit: (task: UITask) => void;
//   onDelete: (taskId: number) => void;
// }

// export const getStatusColor = (status: string) => {
//   switch (status) {
//     case "مكتملة":
//       return "bg-green-100 text-green-800";
//     case "قيد التنفيذ":
//       return "bg-blue-100 text-blue-800";
//     case "متأخرة":
//       return "bg-red-100 text-red-800";
//     case "جديدة":
//       return "bg-gray-100 text-gray-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export const getPriorityColor = (priority: string) => {
//   switch (priority) {
//     case "عالية":
//       return "bg-red-100 text-red-800";
//     case "متوسطة":
//       return "bg-yellow-100 text-yellow-800";
//     case "منخفضة":
//       return "bg-green-100 text-green-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export const getStatusIcon = (status: string) => {
//   switch (status) {
//     case "مكتملة":
//       return <CheckCircle2 className="h-4 w-4 text-green-600" />;
//     case "قيد التنفيذ":
//       return <Clock className="h-4 w-4 text-blue-600" />;
//     case "متأخرة":
//       return <AlertTriangle className="h-4 w-4 text-red-600" />;
//     default:
//       return <Clock className="h-4 w-4 text-gray-600" />;
//   }
// };

// const TaskCard = ({ task, variant, onEdit, onDelete }: TaskCardProps) => {
//   if (variant === "kanban") {
//     return (
//       <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
//         <div className="space-y-3">
//           <div className="flex items-start justify-between">
//             <h4 className="font-medium text-sm">{task.title}</h4>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-6 w-6">
//                   <MoreVertical className="h-3 w-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => onEdit(task)}>تعديل</DropdownMenuItem>
//                 <DropdownMenuItem>تعيين</DropdownMenuItem>
//                 <DropdownMenuItem className="text-red-600" onClick={() => onDelete(task.id)}>حذف</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <p className="text-xs text-muted-foreground line-clamp-2">
//             {task.description}
//           </p>

//           <div className="flex items-center justify-between">
//             <Badge className={getPriorityColor(task.priority)} variant="outline">
//               {task.priority}
//             </Badge>
//             <div className="flex items-center gap-1 text-xs text-muted-foreground">
//               <Calendar className="h-3 w-3" />
//               {task.dueDate ?? "—"}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Avatar className="h-6 w-6">
//               <AvatarFallback className="text-xs">
//                 {task.assigneeName ? task.assigneeName.split(" ").map(n => n[0]).slice(0,2).join('') : "?"}
//               </AvatarFallback>
//             </Avatar>
//             <span className="text-xs text-muted-foreground">{task.assigneeName || "غير محدد"}</span>
//           </div>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between">
//           <div className="space-y-3 flex-1">
//             <div className="flex items-center gap-3">
//               {getStatusIcon(task.status)}
//               <h3 className="font-semibold text-foreground">{task.title}</h3>
//               <Badge className={getStatusColor(task.status)}>
//                 {task.status}
//               </Badge>
//               <Badge className={getPriorityColor(task.priority)} variant="outline">
//                 {task.priority}
//               </Badge>
//             </div>

//             <p className="text-muted-foreground">{task.description}</p>

//             <div className="flex items-center gap-6 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 <span>{task.assigneeName || "غير محدد"}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 <span>موعد التسليم: {task.dueDate ?? "—"}</span>
//               </div>
//               <div>
//                 <span>المشروع: {task.projectName || "—"}</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               {task.tags.map((tag, index) => (
//                 <Badge key={index} variant="secondary" className="text-xs">
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => onEdit(task)}>تعديل المهمة</DropdownMenuItem>
//               <DropdownMenuItem>تغيير الحالة</DropdownMenuItem>
//               <DropdownMenuItem>إضافة تعليق</DropdownMenuItem>
//               <DropdownMenuItem className="text-red-600" onClick={() => onDelete(task.id)}>حذف</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default TaskCard;
