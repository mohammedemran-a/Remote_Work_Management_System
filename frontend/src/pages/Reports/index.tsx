// src/pages/Reports/index.tsx

import { useReportsState } from "./useReportsState";
import { OverviewStats } from "./OverviewStats";
import { ProjectProgress } from "./ProjectProgress";
import { Trends } from "./Trends";
import { TeamPerformance } from "./TeamPerformance";
// 🔴 تم حذف استيراد DateRangePicker لأنه غير موجود

const ReportsPage = () => {
  // 🟢 استدعاء كل البيانات من الـ Hook، حتى لو لم نستخدمها كلها الآن
  const {
    loading,
    stats,
    teamPerformance,
    tasksByStatus,
    tasksByPriority,
    // dateRange,  // يمكننا تجاهل هذه مؤقتًا
    // setDateRange, // يمكننا تجاهل هذه مؤقتًا
  } = useReportsState();

  if (loading) {
    return <div className="text-center py-20">جاري تحميل بيانات التقارير...</div>;
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">لوحة التقارير</h1>
          <p className="text-muted-foreground">
            نظرة شاملة على أداء الفريق وإنتاجية المهام.
          </p>
        </div>
        {/* 🔴 تم حذف مكون DateRangePicker من هنا */}
      </div>

      {/* المكونات التالية ستعمل بشكل صحيح لأنها تستقبل البيانات الصحيحة */}
      <OverviewStats stats={stats} />

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectProgress tasksByStatusData={tasksByStatus} />
        <Trends tasksByPriorityData={tasksByPriority} />
      </div>
      
      <TeamPerformance members={teamPerformance} />
    </div>
  );
};

export default ReportsPage;
