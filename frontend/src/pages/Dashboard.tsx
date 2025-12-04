import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  FolderOpen, 
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "المشاريع النشطة", value: "12", icon: FolderOpen, color: "text-blue-600" },
    { title: "المهام المكتملة", value: "48", icon: CheckCircle, color: "text-green-600" },
    { title: "المهام المتأخرة", value: "5", icon: AlertTriangle, color: "text-red-600" },
    { title: "أعضاء الفريق", value: "24", icon: Users, color: "text-purple-600" },
  ];

  const recentProjects = [
    { name: "تطوير موقع الشركة", progress: 75, status: "نشط", dueDate: "2024-01-15" },
    { name: "تطبيق الهاتف المحمول", progress: 45, status: "نشط", dueDate: "2024-02-20" },
    { name: "حملة التسويق الرقمي", progress: 90, status: "مكتمل", dueDate: "2024-01-10" },
    { name: "نظام إدارة المخزون", progress: 30, status: "نشط", dueDate: "2024-03-01" },
  ];

  const recentTasks = [
    { title: "مراجعة التصميم النهائي", assignee: "أحمد محمد", status: "مكتملة", priority: "عالية" },
    { title: "اختبار الوحدة للواجهة", assignee: "فاطمة علي", status: "قيد التنفيذ", priority: "متوسطة" },
    { title: "كتابة التوثيق الفني", assignee: "محمد خالد", status: "متأخرة", priority: "منخفضة" },
    { title: "إعداد بيئة الإنتاج", assignee: "سارة أحمد", status: "جديدة", priority: "عالية" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتملة":
      case "مكتمل":
        return "bg-green-100 text-green-800";
      case "قيد التنفيذ":
      case "نشط":
        return "bg-blue-100 text-blue-800";
      case "متأخرة":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "bg-red-100 text-red-800";
      case "متوسطة":
        return "bg-yellow-100 text-yellow-800";
      case "منخفضة":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-lg text-muted-foreground">نظرة شاملة على حالة المشاريع والمهام</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              المشاريع الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{project.name}</h4>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>التقدم: {project.progress}%</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.dueDate}
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              المهام الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">المسند إلى: {task.assignee}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
              <FolderOpen className="h-6 w-6 text-primary" />
              <span className="font-medium">إنشاء مشروع جديد</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="font-medium">إضافة مهمة جديدة</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium">إنشاء تقرير</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;