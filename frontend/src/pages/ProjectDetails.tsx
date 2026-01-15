// src/pages/ProjectDetails.tsx
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getProject } from "@/api/project"; // تأكد من أن هذه الدالة موجودة وتعمل

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // لاستخدامها في حالة التحميل

import {
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  User,
  FileText,
  TrendingUp,
  AlertTriangle,
  Package,
} from "lucide-react";

// 1. واجهة للبيانات القادمة من الـ API (قد تكون غير مكتملة)
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
  // هذه هي البيانات التي يجب أن يرسلها الـ Backend الآن
  tasks_count?: number | null;
  completedTasks?: number | null; // تطابق الاسم المستخدم في controller
  users_count?: number | null;    // تطابق الاسم المستخدم في controller
  // يمكن إضافة تفاصيل المهام والفريق هنا لاحقًا
  // tasks?: Task[];
  // team?: User[];
}

// 2. واجهة للبيانات بعد معالجتها وجاهزيتها للعرض
interface ProjectViewData {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  managerName: string;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  teamCount: number;
  progress: number;
  remainingDays: number;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 3. جلب البيانات بشكل آمن
  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      // نفترض أن getProject تعيد { data: ... }
      const response = await getProject(Number(id));
      return response.data as ProjectDetailsAPI;
    },
    enabled: !!id, // لا تقم بتشغيل الكويري إلا إذا كان هناك ID
  });

  // 4. معالجة البيانات بأمان باستخدام useMemo
  const data = useMemo((): ProjectViewData | null => {
    if (!apiData) return null;

    const totalTasks = Number(apiData.tasks_count) || 0;
    const completedTasks = Number(apiData.completedTasks) || 0;
    const teamCount = Number(apiData.users_count) || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const remainingDays = apiData.end_date
      ? Math.max(Math.ceil((new Date(apiData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
      : 0;

    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      status: progress === 100 ? "مكتمل" : apiData.status,
      startDate: apiData.start_date,
      endDate: apiData.end_date,
      managerName: apiData.manager?.name || "غير محدد",
      totalTasks,
      completedTasks,
      remainingTasks: totalTasks - completedTasks,
      teamCount,
      progress,
      remainingDays,
    };
  }, [apiData]);

  // 5. عرض حالات التحميل والخطأ بشكل واضح
  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" dir="rtl">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">حدث خطأ</h2>
        <p className="text-muted-foreground mb-6">لم نتمكن من العثور على تفاصيل المشروع. قد يكون محذوفًا أو أن الرابط غير صحيح.</p>
        <Button onClick={() => navigate("/projects")}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة إلى قائمة المشاريع
        </Button>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-800";
      case "مكتمل": return "bg-blue-100 text-blue-800";
      case "مؤجل": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/projects")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          العودة للمشاريع
        </Button>
        {/* يمكن إضافة أزرار إجراءات هنا (تعديل، حذف، ...) */}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <Badge className={cn("text-base", getStatusClass(data.status))}>{data.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-4xl">{data.description}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp /> التقدم العام</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">نسبة الإنجاز</span>
            <span className="text-3xl font-bold text-primary">{data.progress}%</span>
          </div>
          <Progress value={data.progress} className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <StatCard icon={CheckCircle2} label="المهام المكتملة" value={data.completedTasks} color="text-green-600" />
            <StatCard icon={Clock} label="المهام المتبقية" value={data.remainingTasks} color="text-blue-600" />
            <StatCard icon={FileText} label="إجمالي المهام" value={data.totalTasks} color="text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>تفاصيل المشروع</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={User} label="مدير المشروع" value={data.managerName} />
            <Separator />
            <InfoRow icon={Users} label="أعضاء الفريق" value={`${data.teamCount} عضو`} />
            <Separator />
            <InfoRow icon={Calendar} label="تاريخ البدء" value={data.startDate} />
            <Separator />
            <InfoRow icon={Calendar} label="تاريخ التسليم" value={data.endDate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>إحصائيات سريعة</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={TrendingUp} label="معدل الإنجاز" value={`${data.progress}%`} />
            <Separator />
            <InfoRow icon={Clock} label="الأيام المتبقية" value={`${data.remainingDays} يوم`} />
            <Separator />
            <InfoRow
              icon={Users}
              label="معدل المهام لكل عضو"
              value={data.teamCount > 0 ? (data.totalTasks / data.teamCount).toFixed(1) : "0"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 6. مكونات مساعدة للحفاظ على نظافة الكود
const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: number | string, color: string }) => (
  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
    <Icon className={`h-8 w-8 ${color}`} />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </span>
    <span className="font-semibold">{value}</span>
  </div>
);

const ProjectDetailsSkeleton = () => (
  <div className="space-y-6 p-4 md:p-6" dir="rtl">
    <Skeleton className="h-10 w-48" />
    <div className="space-y-2">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    <Card>
      <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-64 w-full lg:col-span-2" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

export default ProjectDetails;
