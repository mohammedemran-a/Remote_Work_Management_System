import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/api/project";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  User,
  FileText,
  TrendingUp,
} from "lucide-react";

interface ProjectDetailsAPI {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  manager?: {
    id: number;
    name: string;
  };
  tasks_count?: number | null;
  completed_tasks_count?: number | null;
  team_members?: number | null;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await getProject(Number(id));
      return res.data as ProjectDetailsAPI;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <p className="text-center py-12">جارٍ تحميل تفاصيل المشروع...</p>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">المشروع غير موجود</h2>
        <Button onClick={() => navigate("/projects")}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للمشاريع
        </Button>
      </div>
    );
  }

  /* =======================
     🔒 معالجة آمنة للأرقام
     ======================= */

  const totalTasks = Number.isFinite(data.tasks_count)
    ? Number(data.tasks_count)
    : 0;

  const completedTasks = Number.isFinite(data.completed_tasks_count)
    ? Number(data.completed_tasks_count)
    : 0;

  const remainingTasks =
    totalTasks > completedTasks ? totalTasks - completedTasks : 0;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const teamMembers = Number.isFinite(data.team_members)
    ? Number(data.team_members)
    : 0;

  const remainingDays = data.end_date
    ? Math.max(
        Math.ceil(
          (new Date(data.end_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        0
      )
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "مكتمل":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "مؤجل":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "مؤرشف":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          العودة للمشاريع
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{data.description}</p>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            التقدم العام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>نسبة الإنجاز</span>
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">المهام المكتملة</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">المهام المتبقية</p>
                <p className="text-2xl font-bold">{remainingTasks}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المهام</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات المشروع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" /> المشرف
              </span>
              <span>{data.manager?.name || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> أعضاء الفريق
              </span>
              <span>{teamMembers} عضو</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> تاريخ البدء
              </span>
              <span>{data.start_date}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> تاريخ الانتهاء
              </span>
              <span>{data.end_date}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">معدل الإنجاز</span>
              <span>{progress}%</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">عدد الأيام المتبقية</span>
              <span>{remainingDays}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">المهام لكل عضو</span>
              <span>
                {teamMembers > 0
                  ? (totalTasks / teamMembers).toFixed(1)
                  : 0}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">الحالة</span>
              <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
