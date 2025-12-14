// مكون أداء الفريق
// src/pages/Reports/TeamPerformance.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TeamMemberPerformance } from "./useReportsState";

interface TeamPerformanceProps {
  members: TeamMemberPerformance[];
}

export const TeamPerformance = ({ members }: TeamPerformanceProps) => {
  return (
    <Card>
      <CardHeader><CardTitle>أداء أعضاء الفريق</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عضو الفريق</TableHead>
              <TableHead>القسم</TableHead>
              <TableHead>المهام المسندة</TableHead>
              <TableHead>المهام المكتملة</TableHead>
              <TableHead>الكفاءة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar><AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback></Avatar>
                  {member.user.name}
                </TableCell>
                <TableCell>{member.user.department || "غير محدد"}</TableCell>
                <TableCell>{member.tasksAssigned}</TableCell>
                <TableCell>{member.tasksCompleted}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={member.efficiency} className="w-24" />
                    <span>{member.efficiency}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
