// src/pages/Reports/OverviewStats.tsx

import { Card, CardContent } from "@/components/ui/card";
import { ReportStats } from "./useReportsState";
import { ListChecks, Timer, TrendingUp, CheckCircle } from "lucide-react";

interface OverviewStatsProps {
  stats: ReportStats;
}

const summaryItems = [
  { title: "إجمالي المهام", icon: ListChecks, key: "totalTasks", color: "text-blue-500" },
  { title: "المهام المكتملة", icon: CheckCircle, key: "completedTasks", color: "text-green-500" },
  { title: "قيد التنفيذ", icon: Timer, key: "inProgressTasks", color: "text-yellow-500" },
  { title: "معدل الإنجاز", icon: TrendingUp, key: "completionRate", color: "text-purple-500", isPercentage: true },
];

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof ReportStats];
        return (
          <Card key={item.title}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <p className="text-2xl font-bold">{value}{item.isPercentage && "%"}</p>
              </div>
              <div className={`p-3 rounded-full bg-muted ${item.color}`}><Icon className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
