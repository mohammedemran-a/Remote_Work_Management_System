// src/pages/Reports/OverviewStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ReportStats } from "./useReportsState";
import { Project } from "@/api/project";
import { TrendingUp, CheckCircle2, Activity } from "lucide-react";

interface OverviewStatsProps {
  stats: ReportStats;
  projects: Project[];
}

const StatCard = ({ title, value, trend, icon }: { title: string, value: string | number, trend: string, icon: React.ReactNode }) => (
  <Card className="border-none shadow-sm bg-white">
    <CardContent className="p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className={`text-xs font-bold ${trend.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
          {trend}
        </p>
      </div>
      <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
    </CardContent>
  </Card>
);

export const OverviewStats = ({ stats, projects }: OverviewStatsProps) => {
  const activeProjects = projects.filter(p => p.status === 'نشط').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;

  const summaryItems = [
    { title: "كفاءة الفريق", value: `${stats.completionRate}%`, trend: "+5% من الشهر الماضي", icon: <TrendingUp className="text-emerald-500" /> },
    { title: "المهام المكتملة", value: stats.completedTasks, trend: "+15% من الشهر الماضي", icon: <CheckCircle2 className="text-emerald-500" /> },
    { title: "المشاريع النشطة", value: activeProjects, trend: "مستقر", icon: <Activity className="text-blue-500" /> },
    { title: "المشاريع المكتملة", value: completedProjects, trend: "+20% من الشهر الماضي", icon: <CheckCircle2 className="text-emerald-500" /> },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => <StatCard key={item.title} {...item} />)}
    </div>
  );
};
