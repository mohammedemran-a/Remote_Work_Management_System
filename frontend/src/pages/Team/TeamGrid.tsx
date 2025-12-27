import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Layout, Users, Trophy, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Team } from "@/api/team";

interface TeamGridProps {
  loading: boolean;
  filteredMembers: Team[]; // أصبحت الآن مصفوفة من الفرق
  handleOpenDialog: (team: Team) => void;
  handleDeleteMember: (id: number) => void;
  getRoleColor: (role: string) => string;
}

const TeamGrid = ({
  loading,
  filteredMembers,
  handleOpenDialog,
  handleDeleteMember,
}: TeamGridProps) => {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse h-64 bg-muted/50" />
        ))}
      </div>
    );
  }

  if (filteredMembers.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">لا توجد فرق عمل مطابقة للبحث.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
      {filteredMembers.map((team) => (
        <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">{team.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{team.description || "لا يوجد وصف"}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleOpenDialog(team)} className="gap-2">
                  <Edit className="h-4 w-4" /> تعديل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteMember(team.id)} className="gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" /> حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* عرض القائد */}
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">قائد</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">قائد الفريق</span>
                <span className="text-sm font-medium">{team.leader?.name || "غير معين"}</span>
              </div>
            </div>

            {/* إحصائيات الفريق */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Layout className="h-3 w-3" /> المشاريع
                </div>
                <span className="font-semibold text-sm">{team.projects?.length || 0} مشاريع</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Users className="h-3 w-3" /> الأعضاء
                </div>
                <span className="font-semibold text-sm">{team.members?.length || 0} أعضاء</span>
              </div>
            </div>

            {/* عرض شارات المشاريع */}
            <div className="flex flex-wrap gap-1 mt-2">
              {team.projects?.slice(0, 3).map(project => (
                <Badge key={project.id} variant="secondary" className="text-[10px] px-2 py-0">
                  {project.name}
                </Badge>
              ))}
              {(team.projects?.length || 0) > 3 && (
                <span className="text-[10px] text-muted-foreground">+{team.projects!.length - 3} أخرى</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamGrid;