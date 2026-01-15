// src/pages/Reports/Trends.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertTriangle } from "lucide-react";
import { ReportStats } from "./useReportsState";

interface TrendsProps {
  stats: ReportStats;
}

const TrendItem = ({ title, value, icon, bgColor, textColor }: any) => (
  <div className={`p-4 rounded-lg ${bgColor}`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full bg-white/60 ${textColor}`}>{icon}</div>
      <div>
        <p className={`font-bold ${textColor}`}>{title}</p>
        <p className={`text-sm font-medium ${textColor}/80`}>{value}</p>
      </div>
    </div>
  </div>
);

export const Trends = ({ stats }: TrendsProps) => {
  return (
    <Card className="col-span-full border-none shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-slate-400" /> الاتجاهات والتحليلات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrendItem
            title="إنتاجية متزايدة"
            value={`زيادة ${stats.completedTasks} في إكمال المهام هذا الشهر`}
            icon={<TrendingUp />}
            bgColor="bg-emerald-50"
            textColor="text-emerald-700"
          />
          <TrendItem
            title="كفاءة الفريق"
            value={`متوسط كفاءة الفريق ${stats.completionRate}% هذا الشهر`}
            icon={<Users />}
            bgColor="bg-blue-50"
            textColor="text-blue-700"
          />
          <TrendItem
            title="نقاط التحسين"
            value={`${stats.tasksOverdue} مهام متأخرة تحتاج لمتابعة`}
            icon={<AlertTriangle />}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
        </div>
      </CardContent>
    </Card>
  );
};
