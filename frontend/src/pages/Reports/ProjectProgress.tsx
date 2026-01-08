// src/pages/Reports/ProjectProgress.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ProjectProgressData } from "./useReportsState";

interface ProjectProgressProps {
  data: ProjectProgressData[]; 
}

// ألوان ديناميكية بناءً على الإنجاز
const getBarColor = (completion: number) => {
  if (completion >= 80) return "hsl(142, 76%, 36%)"; // أخضر
  if (completion >= 50) return "hsl(217, 91%, 60%)"; // أزرق
  return "hsl(0, 84%, 60%)"; // أحمر
};

export const ProjectProgress = ({ data }: ProjectProgressProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> تقدم المشاريع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(v: number) => [`${v}%`, 'نسبة الإنجاز']}
                contentStyle={{ direction: 'rtl', borderRadius: '8px' }}
              />
              <Bar dataKey="completion" radius={[0, 4, 4, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.completion)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};