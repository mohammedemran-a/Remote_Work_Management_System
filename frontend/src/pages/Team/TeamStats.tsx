// src/pages/Team/TeamStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layout, ShieldCheck, PieChart } from "lucide-react";
import { Team } from "@/api/team";

// --- تحديث واجهة الخصائص لتستقبل الفرق ---
interface TeamStatsProps {
  teamMembers: Team[]; // مصفوفة الفرق
}

const TeamStats = ({ teamMembers }: TeamStatsProps) => {
  
  // --- حساب الإحصائيات الجديدة ---
  const totalTeams = teamMembers.length;
  
  // حساب إجمالي المشاريع الفريدة المرتبطة بكل الفرق
  const totalProjects = new Set(
    teamMembers.flatMap(team => team.projects?.map(p => p.id) || [])
  ).size;

  // حساب عدد القادة (المستخدمين الفريدين الذين يقودون فرقاً)
  const totalLeaders = new Set(
    teamMembers.map(team => team.leader_id)
  ).size;

  // حساب متوسط عدد الأعضاء في الفريق الواحد
  const averageTeamSize = totalTeams > 0 
    ? Math.round(teamMembers.reduce((acc, team) => acc + (team.members?.length || 0), 0) / totalTeams)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" dir="rtl">
      {/* إجمالي الفرق */}
      <Card className="border-r-4 border-r-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الفرق</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTeams}</div>
          <p className="text-xs text-muted-foreground font-sans">عدد مجموعات العمل النشطة</p>
        </CardContent>
      </Card>

      {/* إجمالي المشاريع */}
      <Card className="border-r-4 border-r-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المشاريع المغطاة</CardTitle>
          <Layout className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground font-sans">مشاريع مرتبطة بفرق العمل</p>
        </CardContent>
      </Card>

      {/* القادة المستقلون */}
      <Card className="border-r-4 border-r-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">قادة الفرق</CardTitle>
          <ShieldCheck className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLeaders}</div>
          <p className="text-xs text-muted-foreground font-sans">مسؤولون عن توجيه المجموعات</p>
        </CardContent>
      </Card>

      {/* متوسط حجم الفريق */}
      <Card className="border-r-4 border-r-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">متوسط حجم الفريق</CardTitle>
          <PieChart className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTeamSize}</div>
          <p className="text-xs text-muted-foreground font-sans">عضو / لكل فريق عمل</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStats;