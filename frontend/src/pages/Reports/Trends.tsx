//مكون الاتجاهات والتحليلات
// src/pages/Reports/Trends.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from "./useReportsState";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface TrendsProps {
  tasksByPriorityData: ChartData[];
}

const PRIORITY_COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16"];

export const Trends = ({ tasksByPriorityData }: TrendsProps) => {
  return (
    <Card>
      <CardHeader><CardTitle>اتجاهات المهام (حسب الأولوية)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={tasksByPriorityData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {tasksByPriorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
