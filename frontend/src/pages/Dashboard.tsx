import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  Users,
  FolderOpen,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/api/dashboard";

const Dashboard = () => {
  /* =========================
     React Query (v5)
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  /* =========================
     Helpers
  ========================= */

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

  /* =========================
     Loading / Error
  ========================= */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-center mt-10 text-red-600">حدث خطأ أثناء جلب البيانات</p>;
  }

  /* =========================
     Icons for Stats
  ========================= */

  const statIcons = [
    { icon: FolderOpen, color: "text-blue-600" },
    { icon: CheckCircle, color: "text-green-600" },
    { icon: AlertTriangle, color: "text-red-600" },
    { icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-lg text-muted-foreground">
          نظرة شاملة على حالة المشاريع والمهام
        </p>
      </div>

      {/* =========================
         Stats Cards
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => {
          const Icon = statIcons[index]?.icon;
          const color = statIcons[index]?.color;

          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  {Icon && <Icon className={`h-8 w-8 ${color}`} />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* =========================
         Projects + Tasks
      ========================= */}
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
              {data.recentProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      {project.name}
                    </h4>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>التقدم: {project.progress}%</span>
                    {project.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.dueDate}
                      </span>
                    )}
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
              {data.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">
                      {task.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      المسند إلى: {task.assignee}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================
         Quick Actions
      ========================= */}
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
