// src/pages/Reports/TaskStatusPieChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TaskStatusData {
  name: string;
  value: number;
  color: string;
}

interface TaskStatusPieChartProps {
  data: TaskStatusData[];
}

export const TaskStatusPieChart = ({ data }: TaskStatusPieChartProps) => {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader><CardTitle className="text-lg font-bold">توزيع حالة المهام</CardTitle></CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%" paddingAngle={5}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" verticalAlign="bottom" />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
