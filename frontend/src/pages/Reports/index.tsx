// src/pages/Reports/index.tsx
import { useState } from "react";
import { useReportsState } from "./useReportsState";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend } from "recharts";
import { BarChart3, TrendingUp, Download, CheckCircle, Activity, FileText, Users, FolderOpen, Clock, AlertTriangle } from "lucide-react";

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { loading, stats, projectProgress, taskStatusData, tasks, projects } = useReportsState();

  if (loading) return <div className="p-10 text-center animate-pulse">جاري إعداد التقارير الحقيقية...</div>;

  // دالة تصدير ملف إكسل
  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // 1. تقرير الأداء العام للمشاريع
  const handleExportProjects = () => {
    const report = projectProgress.map(p => ({
      "اسم المشروع": p.name,
      "نسبة الإنجاز": `${p.completion}%`,
      "حالة المشروع": p.status
    }));
    exportToExcel(report, "تقرير_أداء_المشاريع");
  };

  // 2. تقرير المهام المتأخرة
  const handleExportOverdue = () => {
    const overdue = tasks
      .filter(t => t.status === "متأخرة")
      .map(t => ({
        "عنوان المهمة": t.title,
        "المشروع": projects.find(p => p.id === t.project_id)?.name || "غير محدد",
        "الأولوية": t.priority,
        "تاريخ الاستحقاق": t.due_date
      }));
    exportToExcel(overdue, "سجل_المهام_المتأخرة");
  };

  const getBarColor = (completion: number) => {
    if (completion >= 80) return "hsl(142, 76%, 36%)";
    if (completion >= 50) return "hsl(217, 91%, 60%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <div className="space-y-8 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحليلات</h1>
          <p className="text-muted-foreground mt-1">بيانات مستخرجة من {projects.length} مشاريع و {tasks.length} مهام</p>
        </div>
        <Button onClick={handleExportProjects} className="gap-2">
          <Download className="h-4 w-4" /> تصدير التقرير الشامل
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatItem title="المشاريع" value={stats.activeProjects} icon={<FolderOpen className="text-blue-500" />} />
        <StatItem title="إنجاز المهام" value={`${stats.completionRate}%`} icon={<CheckCircle className="text-green-500" />} />
        <StatItem title="قيد التنفيذ" value={stats.inProgressTasks} icon={<Activity className="text-orange-500" />} />
        <StatItem title="متأخرة" value={stats.tasksOverdue} icon={<AlertTriangle className="text-red-500" />} />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>تقدم المشاريع الحالية</CardTitle></CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgress} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="completion" radius={[0, 4, 4, 0]} maxBarSize={30}>
                  {projectProgress.map((e, i) => <Cell key={i} fill={getBarColor(e.completion)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Reports Section - الربط الفعلي هنا */}
        <Card>
          <CardHeader><CardTitle>تقارير سريعة</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <ReportButton 
              icon={<FileText className="h-4 w-4 text-blue-500" />} 
              label="تقرير الأداء العام (Excel)" 
              onClick={handleExportProjects}
            />
            <ReportButton 
              icon={<Clock className="h-4 w-4 text-red-500" />} 
              label={`المهام المتأخرة (${stats.tasksOverdue})`} 
              onClick={handleExportOverdue}
              disabled={stats.tasksOverdue === 0}
            />
            <ReportButton 
              icon={<Users className="h-4 w-4 text-purple-500" />} 
              label="توزيع إنتاجية المهام" 
              onClick={() => exportToExcel(tasks, "جميع_المهام")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Distribution & Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>توزيع حالات المهام</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={taskStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {taskStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900/50">
          <CardHeader><CardTitle>ملخص الاتجاهات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <TrendRow icon={<TrendingUp className="text-green-500" />} title="الإنتاجية" desc={`معدل الإنجاز الحالي هو ${stats.completionRate}%`} />
             <TrendRow icon={<AlertTriangle className="text-orange-500" />} title="المتابعة" desc={`يوجد ${stats.inProgressTasks} مهمة تحتاج لتدخل سريع`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sub-components
const StatItem = ({ title, value, icon }: any) => (
  <Card><CardContent className="p-4 flex items-center justify-between">
    <div><p className="text-sm text-muted-foreground">{title}</p><p className="text-2xl font-bold">{value}</p></div>
    <div className="p-2 bg-slate-100 rounded-full">{icon}</div>
  </CardContent></Card>
);

const ReportButton = ({ icon, label, onClick, disabled }: any) => (
  <Button variant="outline" className="w-full justify-start gap-2 h-12" onClick={onClick} disabled={disabled}>
    {icon} {label}
  </Button>
);

const TrendRow = ({ icon, title, desc }: any) => (
  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
    {icon} <div><h4 className="font-bold text-sm">{title}</h4><p className="text-xs text-muted-foreground">{desc}</p></div>
  </div>
);

export default ReportsPage;