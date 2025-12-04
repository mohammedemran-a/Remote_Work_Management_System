import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight,
  Calendar, 
  Users, 
  CheckCircle2,
  Clock,
  User,
  FileText,
  TrendingUp
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // بيانات المشروع التجريبية - في التطبيق الحقيقي ستأتي من API
  const projects = [
    {
      id: 1,
      name: "تطوير موقع الشركة",
      description: "إنشاء موقع إلكتروني متجاوب وحديث للشركة يتضمن جميع الأقسام والخدمات مع لوحة تحكم إدارية متكاملة",
      status: "نشط",
      progress: 75,
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      supervisor: "1",
      supervisorName: "أحمد محمد",
      teamMembers: 5,
      tasks: 12,
      completedTasks: 9
    },
    {
      id: 2,
      name: "تطبيق الهاتف المحمول",
      description: "تطوير تطبيق iOS و Android للعملاء",
      status: "نشط",
      progress: 45,
      startDate: "2024-01-10",
      endDate: "2024-02-20",
      supervisor: "2",
      supervisorName: "فاطمة علي",
      teamMembers: 8,
      tasks: 20,
      completedTasks: 9
    },
    {
      id: 3,
      name: "حملة التسويق الرقمي",
      description: "استراتيجية تسويق شاملة عبر وسائل التواصل",
      status: "مكتمل",
      progress: 100,
      startDate: "2023-12-01",
      endDate: "2024-01-10",
      supervisor: "3",
      supervisorName: "محمد خالد",
      teamMembers: 4,
      tasks: 15,
      completedTasks: 15
    },
    {
      id: 4,
      name: "نظام إدارة المخزون",
      description: "تطوير نظام إدارة المخزون والمبيعات",
      status: "مؤجل",
      progress: 30,
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      supervisor: "4",
      supervisorName: "سارة أحمد",
      teamMembers: 6,
      tasks: 18,
      completedTasks: 5
    },
    {
      id: 5,
      name: "تحديث البنية التحتية",
      description: "ترقية الخوادم وتحسين الأمان",
      status: "نشط",
      progress: 60,
      startDate: "2024-01-05",
      endDate: "2024-01-25",
      supervisor: "5",
      supervisorName: "عمر حسن",
      teamMembers: 3,
      tasks: 8,
      completedTasks: 5
    },
    {
      id: 6,
      name: "برنامج تدريب الموظفين",
      description: "تطوير برنامج تدريبي شامل للموظفين الجدد",
      status: "مؤرشف",
      progress: 100,
      startDate: "2023-11-01",
      endDate: "2023-12-15",
      supervisor: "1",
      supervisorName: "أحمد محمد",
      teamMembers: 2,
      tasks: 10,
      completedTasks: 10
    }
  ];

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]" dir="rtl">
        <h2 className="text-2xl font-bold text-foreground mb-4">المشروع غير موجود</h2>
        <Button onClick={() => navigate("/projects")}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للمشاريع
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "مكتمل":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "مؤجل":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "مؤرشف":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          العودة للمشاريع
        </Button>
      </div>

      {/* Project Title and Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-foreground">{project.name}</h1>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{project.description}</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            التقدم العام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">نسبة الإنجاز</span>
              <span className="text-2xl font-bold text-primary">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">المهام المكتملة</p>
                <p className="text-2xl font-bold">{project.completedTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">المهام المتبقية</p>
                <p className="text-2xl font-bold">{project.tasks - project.completedTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المهام</p>
                <p className="text-2xl font-bold">{project.tasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات المشروع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                المشرف
              </span>
              <span className="font-medium">{project.supervisorName}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                عدد أعضاء الفريق
              </span>
              <span className="font-medium">{project.teamMembers} عضو</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                تاريخ البدء
              </span>
              <span className="font-medium">{project.startDate}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                تاريخ الانتهاء
              </span>
              <span className="font-medium">{project.endDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Project Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">معدل الإنجاز</span>
              <span className="font-medium text-lg">
                {Math.round((project.completedTasks / project.tasks) * 100)}%
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">عدد الأيام المتبقية</span>
              <span className="font-medium text-lg">
                {Math.ceil(
                  (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">المهام لكل عضو</span>
              <span className="font-medium text-lg">
                {(project.tasks / project.teamMembers).toFixed(1)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">الحالة</span>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">الوصف الكامل</h3>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">ملاحظات</h3>
              <p className="text-muted-foreground">
                المشروع يسير وفق الخطة المحددة بدون أي تأخيرات كبيرة. الفريق ملتزم ويعمل بجد لإنجاز المهام في الوقت المحدد.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
