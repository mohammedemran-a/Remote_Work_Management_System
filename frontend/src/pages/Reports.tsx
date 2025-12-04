import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  PieChart,
  Activity
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const projectStats = [
    { name: "تطوير موقع الشركة", completion: 75, tasksCompleted: 9, totalTasks: 12, status: "نشط" },
    { name: "تطبيق الهاتف المحمول", completion: 45, tasksCompleted: 9, totalTasks: 20, status: "نشط" },
    { name: "حملة التسويق الرقمي", completion: 100, tasksCompleted: 15, totalTasks: 15, status: "مكتمل" },
    { name: "نظام إدارة المخزون", completion: 30, tasksCompleted: 5, totalTasks: 18, status: "مؤجل" },
    { name: "تحديث البنية التحتية", completion: 60, tasksCompleted: 5, totalTasks: 8, status: "نشط" }
  ];

  const teamPerformance = [
    { name: "أحمد محمد", completedTasks: 12, pendingTasks: 3, efficiency: 85, department: "التطوير" },
    { name: "فاطمة علي", completedTasks: 15, pendingTasks: 2, efficiency: 92, department: "التصميم" },
    { name: "محمد خالد", completedTasks: 8, pendingTasks: 5, efficiency: 70, department: "التطوير" },
    { name: "سارة أحمد", completedTasks: 10, pendingTasks: 1, efficiency: 88, department: "إدارة المشاريع" },
    { name: "عمر حسن", completedTasks: 6, pendingTasks: 4, efficiency: 65, department: "الجودة" }
  ];

  const monthlyStats = {
    projectsCompleted: 3,
    projectsInProgress: 5,
    projectsOverdue: 2,
    tasksCompleted: 48,
    tasksPending: 15,
    tasksOverdue: 5,
    teamEfficiency: 82,
    budgetUtilization: 67
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800";
      case "مكتمل":
        return "bg-blue-100 text-blue-800";
      case "مؤجل":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return "text-green-600";
    if (efficiency >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">التقارير</h1>
          <p className="text-lg text-muted-foreground">تحليل الأداء والإنتاجية</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوعي</SelectItem>
              <SelectItem value="month">شهري</SelectItem>
              <SelectItem value="quarter">ربع سنوي</SelectItem>
              <SelectItem value="year">سنوي</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المشاريع المكتملة</p>
                <p className="text-3xl font-bold text-foreground">{monthlyStats.projectsCompleted}</p>
                <p className="text-xs text-green-600">+20% من الشهر الماضي</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المشاريع النشطة</p>
                <p className="text-3xl font-bold text-foreground">{monthlyStats.projectsInProgress}</p>
                <p className="text-xs text-blue-600">مستقر</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المهام المكتملة</p>
                <p className="text-3xl font-bold text-foreground">{monthlyStats.tasksCompleted}</p>
                <p className="text-xs text-green-600">+15% من الشهر الماضي</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">كفاءة الفريق</p>
                <p className="text-3xl font-bold text-foreground">{monthlyStats.teamEfficiency}%</p>
                <p className="text-xs text-green-600">+5% من الشهر الماضي</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              تقدم المشاريع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStats.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {project.tasksCompleted}/{project.totalTasks} مهام مكتملة
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{project.completion}%</span>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={project.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              أداء الفريق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.completedTasks} مكتملة • {member.pendingTasks} قيد التنفيذ
                    </p>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${getEfficiencyColor(member.efficiency)}`}>
                      {member.efficiency}%
                    </p>
                    <p className="text-xs text-muted-foreground">الكفاءة</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع حالة المهام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">مكتملة</span>
                </div>
                <span className="text-sm font-medium">{monthlyStats.tasksCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">قيد التنفيذ</span>
                </div>
                <span className="text-sm font-medium">{monthlyStats.tasksPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">متأخرة</span>
                </div>
                <span className="text-sm font-medium">{monthlyStats.tasksOverdue}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              استغلال الميزانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{monthlyStats.budgetUtilization}%</p>
                <p className="text-sm text-muted-foreground">من الميزانية المخصصة</p>
              </div>
              <Progress value={monthlyStats.budgetUtilization} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>متبقي: ${(100 - monthlyStats.budgetUtilization) * 10}K</span>
                <span>مستخدم: ${monthlyStats.budgetUtilization * 10}K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تقارير سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 ml-2" />
                تقرير الأداء الشهري
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="h-4 w-4 ml-2" />
                تقرير إنتاجية الفريق
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FolderOpen className="h-4 w-4 ml-2" />
                تقرير حالة المشاريع
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Clock className="h-4 w-4 ml-2" />
                تقرير المهام المتأخرة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            الاتجاهات والتحليلات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">إنتاجية متزايدة</h4>
              <p className="text-sm text-green-600 mt-1">
                زيادة 15% في إكمال المهام هذا الشهر
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">كفاءة الفريق</h4>
              <p className="text-sm text-blue-600 mt-1">
                متوسط كفاءة الفريق 82% هذا الشهر
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-800">نقاط التحسين</h4>
              <p className="text-sm text-orange-600 mt-1">
                5 مهام متأخرة تحتاج لمتابعة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;