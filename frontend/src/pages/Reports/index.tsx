// src/pages/Reports/index.tsx

import { useState } from "react";
import { useReportsState } from "./useReportsState";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

// --- استيراد المكونات الفرعية ---
import { OverviewStats } from "./OverviewStats";
import { ProjectProgress } from "./ProjectProgress";
import { TaskStatusPieChart } from "./TaskStatusPieChart";
import { QuickReports } from "./QuickReports";
import { Trends } from "./Trends";
import {TeamPerformance} from "./TeamPerformance";

const ReportsPage = () => {
  // ✅ 1. جلب كل القوائم اللازمة من الهوك
  const { 
    loading, 
    stats, 
    projectProgress, 
    taskStatusData, 
    teamPerformance,
    overdueTasksList, // القائمة الفعلية
    projects,
    tasks 
  } = useReportsState();
  
  const [period, setPeriod] = useState("monthly");

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse text-muted-foreground font-bold">
        جاري جلب بيانات التقارير...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* 1. العنوان والفلترة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">التقارير</h1>
          <p className="text-sm text-muted-foreground font-medium">تحليل الأداء والإنتاجية</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] bg-white border-slate-200 shadow-sm">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="quarterly">ربع سنوي</SelectItem>
              <SelectItem value="yearly">سنوي</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportToExcel(tasks, "التقرير_الشامل_للمهام")} className="gap-2 shadow-sm">
            <Download className="h-4 w-4" /> تصدير التقرير
          </Button>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات */}
      <OverviewStats stats={stats} projects={projects} />

      {/* 3. تقدم المشاريع */}
      <ProjectProgress data={projectProgress} />

      {/* 4. التقارير السريعة وتوزيع المهام */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* ✅ 2. تمرير القوائم الكاملة إلى المكون */}
          <QuickReports 
            overdueTasks={overdueTasksList} 
            projectsData={projectProgress}
            teamPerformanceData={teamPerformance}
          />
        </div>
        <TaskStatusPieChart data={taskStatusData} />
      </div>
      
      {/* 5. الاتجاهات والتحليلات */}
      <Trends stats={stats} />

      {/* 6. أداء الفريق */}
      <TeamPerformance members={teamPerformance} />

    </div>
  );
};

export default ReportsPage;
