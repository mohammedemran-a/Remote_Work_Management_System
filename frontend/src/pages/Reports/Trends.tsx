// src/pages/Reports/Trends.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertTriangle } from "lucide-react";
import { ReportStats } from "./useReportsState";

interface TrendsProps {
  stats: ReportStats;
}

export const Trends = ({ stats }: TrendsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> الاتجاهات والتحليلات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-400">إنتاجية ممتازة</h4>
              <p className="text-sm text-green-600/80">تم إكمال {stats.completedTasks} مهمة بنجاح.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-400">كفاءة التشغيل</h4>
              <p className="text-sm text-blue-600/80">معدل الإنجاز العام {stats.completionRate}%</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-400">مهام تحت التنفيذ</h4>
              <p className="text-sm text-orange-600/80">لديك {stats.inProgressTasks} مهمة نشطة حالياً.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};