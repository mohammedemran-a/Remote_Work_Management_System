// src/pages/Reports/ProjectProgress.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from "./useReportsState";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ProjectProgressProps {
  tasksByStatusData: ChartData[];
}

const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6"];

export const ProjectProgress = ({ tasksByStatusData }: ProjectProgressProps) => {
  return (
    <Card>
      <CardHeader><CardTitle>تقدم المشاريع (حالة المهام)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={tasksByStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {tasksByStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
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
