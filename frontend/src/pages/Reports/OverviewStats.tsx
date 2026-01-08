// src/pages/Reports/OverviewStats.tsx

import { Card, CardContent } from "@/components/ui/card";
import { ReportStats } from "./useReportsState";
import { ListChecks, FolderOpen, TrendingUp, CheckCircle } from "lucide-react";

interface OverviewStatsProps {
  stats: ReportStats;
}

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  const summaryItems = [
    { 
      title: "إجمالي المهام", 
      icon: ListChecks, 
      value: stats.totalTasks, 
      color: "text-blue-500",
      sub: "كل المهام" 
    },
    { 
      title: "المشاريع النشطة", 
      icon: FolderOpen, 
      value: stats.activeProjects, 
      color: "text-orange-500",
      sub: "مشاريع قيد العمل" 
    },
    { 
      title: "المهام المكتملة", 
      icon: CheckCircle, 
      value: stats.completedTasks, 
      color: "text-green-500",
      sub: "+15% هذا الشهر" 
    },
    { 
      title: "معدل الإنجاز", 
      icon: TrendingUp, 
      value: `${stats.completionRate}%`, 
      color: "text-purple-500",
      sub: "الأداء العام" 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="border-none shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <div className={`p-3 rounded-xl bg-secondary/50 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};