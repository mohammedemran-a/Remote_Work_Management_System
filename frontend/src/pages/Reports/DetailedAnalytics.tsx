//مكون التحليلات التفصيلية
// src/pages/Reports/DetailedAnalytics.tsx

// --- استيراد المكونات اللازمة ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// --- 👇 هذا هو السطر الذي يجب إضافته ---
import { PieChart, BarChart3, FileText, FolderOpen, Clock, Users } from "lucide-react";

// --- استيراد الواجهة من الملف المجاور ---
import { MonthlyStats } from "./useReportsState";

// --- تعريف الخصائص (Props) ---
interface Props {
  stats: MonthlyStats;
}

export const DetailedAnalytics = ({ stats }: Props) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* ... كرت توزيع حالة المهام ... */}
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
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm">مكتملة</span></div>
            <span className="text-sm font-medium">{stats.tasksCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm">قيد التنفيذ</span></div>
            <span className="text-sm font-medium">{stats.tasksPending}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-sm">متأخرة</span></div>
            <span className="text-sm font-medium">{stats.tasksOverdue}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* ... كرت استغلال الميزانية ... */}
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
            <p className="text-3xl font-bold text-foreground">{stats.budgetUtilization}%</p>
            <p className="text-sm text-muted-foreground">من الميزانية المخصصة</p>
          </div>
          <Progress value={stats.budgetUtilization} className="h-3" />
        </div>
      </CardContent>
    </Card>

    {/* ... كرت تقارير سريعة ... */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          تقارير سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="sm"><FileText className="h-4 w-4 ml-2" />تقرير الأداء الشهري</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><Users className="h-4 w-4 ml-2" />تقرير إنتاجية الفريق</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><FolderOpen className="h-4 w-4 ml-2" />تقرير حالة المشاريع</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><Clock className="h-4 w-4 ml-2" />تقرير المهام المتأخرة</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
