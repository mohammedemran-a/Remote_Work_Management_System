// src/pages/Reports/ProjectProgress.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge"; // ✅ 1. استيراد مكون الـ Badge
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils"; // ✅ 2. استيراد أداة cn للمساعدة في دمج الكلاسات
import { ProjectProgressData } from "./useReportsState";

interface ProjectProgressProps {
  data: ProjectProgressData[];
}

// ✅ 3. دالة للحصول على ألوان شريط التقدم (نفس المنطق)
const getProgressColor = (status: string): string => {
  switch (status) {
    case "مكتمل": return "bg-green-500";
    case "متأخر": return "bg-red-500";
    case "مؤجل": return "bg-amber-500";
    case "قيد التنفيذ": return "bg-blue-500";
    default: return "bg-slate-400";
  }
};

// ✅ 4. دالة جديدة للحصول على ألوان الـ Badge (نفس منطق صفحة المهام)
const getBadgeColor = (status: string): string => {
  switch (status) {
    case "مكتمل": return "bg-green-100 text-green-800 border-green-200";
    case "متأخر": return "bg-red-100 text-red-800 border-red-200";
    case "مؤجل": return "bg-amber-100 text-amber-800 border-amber-200";
    case "قيد التنفيذ": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const ProjectProgress = ({ data }: ProjectProgressProps) => {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Activity className="h-5 w-5 text-slate-400" /> تقدم المشاريع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {data && data.length > 0 ? (
            data.map((project) => (
              <div key={project.id}>
                <div className="mb-2 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">{project.name}</span>
                  {/* ✅ 5. استخدام مكون Badge لعرض الحالة بشكل ملون */}
                  <Badge className={cn("text-xs", getBadgeColor(project.status))}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* ✅ 6. إصلاح طريقة تلوين شريط التقدم */}
                  <Progress 
                    value={project.completion} 
                    className={cn("h-3 flex-1", getProgressColor(project.status))}
                  />
                  <span className="w-12 text-right font-bold text-sm text-slate-600">
                    {project.completion}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد بيانات لعرض تقدم المشاريع.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
