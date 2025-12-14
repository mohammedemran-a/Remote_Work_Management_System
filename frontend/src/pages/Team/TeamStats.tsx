//مكون الكروت الإحصائية العلوية
// src/pages/Team/TeamStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, BarChart2, CheckCircle } from "lucide-react";
import { TeamMember } from "@/api/team";

// --- 1. تعريف واجهة الخصائص (Props) ---
interface TeamStatsProps {
  teamMembers: TeamMember[];
  departments: string[];
}

// --- 2. تحديث المكون ليستقبل الخصائص ---
const TeamStats = ({ teamMembers, departments }: TeamStatsProps) => {
  
  // --- 3. حساب الإحصائيات بناءً على الخصائص المستلمة ---
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'نشط').length;
  const totalDepartments = departments.length;
  
  // حساب متوسط الأداء (مع التأكد من عدم القسمة على صفر)
  const averageEfficiency = totalMembers > 0 
    ? Math.round(teamMembers.reduce((acc, m) => acc + m.efficiency, 0) / totalMembers)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الأعضاء</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            {activeMembers} عضو نشط حاليًا
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الأقسام</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDepartments}</div>
          <p className="text-xs text-muted-foreground">إجمالي عدد الأقسام في الفريق</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">متوسط الأداء</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageEfficiency}%</div>
          <p className="text-xs text-muted-foreground">متوسط كفاءة جميع الأعضاء</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الأعضاء النشطون</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{activeMembers}</div>
          <p className="text-xs text-muted-foreground">عدد الأعضاء المتاحين حاليًا</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStats;
