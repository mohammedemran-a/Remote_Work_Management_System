// src/pages/Team/TeamGrid.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Mail, Phone, MapPin, Calendar, Clock, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TeamMember } from "@/api/team";

// --- واجهة الخصائص (Props) ---
interface TeamGridProps {
  loading: boolean;
  filteredMembers: TeamMember[];
  handleOpenDialog: (member: TeamMember) => void;
  handleDeleteMember: (id: number) => void;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: string) => string;
  getEfficiencyColor: (efficiency: number) => string;
}

// --- المكون ---
const TeamGrid = ({
  loading,
  filteredMembers,
  handleOpenDialog,
  handleDeleteMember,
  getRoleColor,
  getStatusColor,
  getEfficiencyColor,
}: TeamGridProps) => {
  
  // --- عرض رسالة التحميل ---
  if (loading) {
    return <div className="text-center py-12">جاري تحميل بيانات الفريق...</div>;
  }

  // --- عرض رسالة عدم وجود نتائج ---
  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد نتائج</h3>
        <p className="mt-2 text-muted-foreground">لم يتم العثور على أعضاء يطابقون معايير البحث</p>
      </div>
    );
  }

  // --- عرض شبكة الأعضاء ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMembers.map((member) => (
        <Card key={member.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {member.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{member.user.name}</h3>
                  <Badge className={getRoleColor(member.user.roles[0]?.name || 'N/A')}>
                    {member.user.roles[0]?.name || 'N/A'}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDialog(member)}>تعديل البيانات</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>إزالة من الفريق</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span className="truncate">{member.user.email}</span></div>
              {member.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>{member.phone}</span></div>}
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{member.location}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>انضم في {member.join_date}</span></div>
            </div>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
              <div className="text-sm text-muted-foreground"><Clock className="h-4 w-4 inline ml-1" />{member.last_active}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">الأداء</span><span className={`font-medium ${getEfficiencyColor(member.efficiency)}`}>{member.efficiency}%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">المهام المكتملة</span><span className="font-medium">{member.tasks_completed}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">المهام الحالية</span><span className="font-medium">{member.tasks_in_progress}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamGrid;
