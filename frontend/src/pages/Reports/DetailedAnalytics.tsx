// src/pages/Reports/DetailedAnalytics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart3, FileText, Users, FolderOpen, Clock } from "lucide-react";
import { ReportStats } from "./useReportsState";

interface Props {
  // دمج الخصائص لضمان عدم وجود أخطاء في TypeScript
  stats: ReportStats & { budgetUtilization?: number; tasksOverdue?: number };
}

export const DetailedAnalytics = ({ stats }: Props) => {
  // قيم افتراضية في حال لم تأتِ من الباك اند بعد
  const budget = stats.budgetUtilization || 75;
  const overdue = stats.tasksOverdue || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* قسم توزيع حالة المهام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" /> توزيع حالة المهام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <div className="flex justify-between items-center">
              <span>مكتملة</span>
              <span className="font-bold text-green-600">{stats.completedTasks}</span>
            </div>
            <Progress value={(stats.completedTasks / stats.totalTasks) * 100} className="h-2" />
            <div className="flex justify-between items-center">
              <span>قيد التنفيذ</span>
              <span className="font-bold text-blue-600">{stats.inProgressTasks}</span>
            </div>
            <Progress value={(stats.inProgressTasks / stats.totalTasks) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* قسم استغلال الميزانية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> استغلال الميزانية
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-4xl font-bold">{budget}%</p>
          <Progress value={budget} className="h-3" />
        </CardContent>
      </Card>

      {/* قسم التقارير السريعة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> تقارير سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
           <button className="w-full text-right p-2 hover:bg-secondary rounded flex items-center gap-2">
             <FileText className="h-4 w-4" /> تصدير تقرير الأداء
           </button>
           <button className="w-full text-right p-2 hover:bg-secondary rounded flex items-center gap-2">
             <Users className="h-4 w-4" /> إنتاجية الفريق
           </button>
        </CardContent>
      </Card>
    </div>
  );
};