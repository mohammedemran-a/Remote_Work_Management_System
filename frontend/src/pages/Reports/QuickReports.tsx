// src/pages/Reports/QuickReports.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, FolderOpen, Clock } from "lucide-react";
import * as XLSX from 'xlsx';
import { TaskResponse } from "@/api/task";
import { ProjectProgressData, TeamMemberPerformance } from "./useReportsState"; // استيراد الواجهات

// ✅ 1. تحديث الواجهة لتستقبل كل البيانات اللازمة
interface QuickReportsProps {
  overdueTasks: TaskResponse[];
  projectsData: ProjectProgressData[];
  teamPerformanceData: TeamMemberPerformance[];
}

// دالة مساعدة عامة للتصدير
const exportToExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) {
    alert("لا توجد بيانات لتصديرها.");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// ✅ 2. تحديث ActionItem ليقبل خاصية disabled
const ActionItem = ({ label, icon, badge, onClick, disabled }: { 
  label: string; 
  icon: React.ReactNode; 
  badge?: number; 
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <Button 
    variant="ghost" 
    className="w-full justify-between h-14 rounded-xl px-4 border border-slate-50 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled} // تطبيق خاصية التعطيل
  >
    <div className="flex items-center gap-3">
      <span className="p-2 bg-white rounded-lg border border-slate-100">{icon}</span>
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    {badge !== undefined && badge > 0 ? (
      <Badge variant="destructive" className="rounded-full">{badge}</Badge>
    ) : null}
  </Button>
);

export const QuickReports = ({ overdueTasks, projectsData, teamPerformanceData }: QuickReportsProps) => {
  
  // --- دوال التصدير ---

  const handleExportOverdueTasks = () => {
    const simplifiedData = overdueTasks.map(task => ({
      'عنوان المهمة': task.title,
      'المسؤول': task.assignee?.name || 'غير محدد',
      'تاريخ التسليم': task.due_date,
      'الحالة': task.status,
    }));
    exportToExcel(simplifiedData, "تقرير_المهام_المتأخرة");
  };

  const handleExportProjects = () => {
    const simplifiedData = projectsData.map(p => ({
      'اسم المشروع': p.name,
      'نسبة الإنجاز': `${p.completion}%`,
      'الحالة': p.status,
    }));
    exportToExcel(simplifiedData, "تقرير_حالة_المشاريع");
  };

  const handleExportTeam = () => {
    const simplifiedData = teamPerformanceData.map(m => ({
      'اسم العضو': m.user.name,
      'المهام المسندة': m.tasksAssigned,
      'المهام المكتملة': m.tasksCompleted,
      'الكفاءة': `${m.efficiency}%`,
    }));
    exportToExcel(simplifiedData, "تقرير_إنتاجية_الفريق");
  };

  const handleExportMonthly = () => alert("تقرير الأداء الشهري لم يتم تفعيله بعد.");

  // --- تعريف التقارير مع دوالها ---
  const reports = [
    { label: "تقرير الأداء الشهري", icon: <FileText className="text-slate-400" />, onClick: handleExportMonthly, disabled: true },
    { label: "تقرير إنتاجية الفريق", icon: <Users className="text-slate-400" />, onClick: handleExportTeam },
    { label: "تقرير حالة المشاريع", icon: <FolderOpen className="text-slate-400" />, onClick: handleExportProjects },
  ];

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader><CardTitle className="text-lg font-bold">تقارير سريعة</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {reports.map(r => <ActionItem key={r.label} label={r.label} icon={r.icon} onClick={r.onClick} disabled={r.disabled} />)}
        <ActionItem 
          label="تقرير المهام المتأخرة" 
          icon={<Clock className="text-slate-400" />} 
          badge={overdueTasks.length}
          onClick={handleExportOverdueTasks}
          // ✅ 3. تعطيل الزر إذا كان عدد المهام المتأخرة صفرًا
          disabled={overdueTasks.length === 0}
        />
      </CardContent>
    </Card>
  );
};
