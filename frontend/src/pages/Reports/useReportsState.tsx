// src/pages/Reports/useReportsState.tsx
import { useState, useEffect, useMemo } from "react";
import { getTasks, TaskResponse } from "@/api/task";
import { getProjects, Project } from "@/api/project";

// تعريف الواجهات البرمجية (Interfaces) لضمان دقة البيانات
export interface ReportStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  tasksOverdue: number;
  completionRate: number;
  activeProjects: number;
}

export interface ProjectProgressData {
  id: number;
  name: string;
  completion: number;
  status: string;
}

export const useReportsState = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب البيانات من الـ API بشكل متوازي لسرعة الأداء
        const [tasksData, projectsData] = await Promise.all([
          getTasks(),
          getProjects()
        ]);
        
        // جلب المهام (دعم مصفوفة مباشرة أو كائن يحتوي على data)
        setTasks(tasksData || []);
        
        // جلب المشاريع (getProjects التي أرسلتها تتعامل داخلياً مع التنسيقات)
        setProjects(projectsData || []);
      } catch (error) {
        console.error("خطأ أثناء جلب بيانات التقارير:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = useMemo(() => {
    // 1. حساب الإحصائيات العامة للمهام
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "مكتملة").length;
    const inProgressTasks = tasks.filter(t => t.status === "قيد التنفيذ").length;
    const overdueTasksList = tasks.filter(t => t.status === "متأخرة");

    const stats: ReportStats = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      tasksOverdue: overdueTasksList.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      activeProjects: projects.length
    };

    // 2. ربط المهام بالمشاريع (Logic Join)
    const projectProgress: ProjectProgressData[] = projects.map(project => {
      // البحث عن المهام التي تنتمي لهذا المشروع حصراً
      const projectTasks = tasks.filter(t => Number(t.project_id) === Number(project.id));
      
      const doneCount = projectTasks.filter(t => t.status === "مكتملة").length;
      const totalCount = projectTasks.length;

      // حساب النسبة المئوية للمشروع
      const ratio = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

      return {
        id: project.id,
        name: project.name,
        completion: ratio,
        status: project.status || "نشط"
      };
    });

    // 3. تنسيق بيانات الرسم الدائري (Pie Chart)
    const taskStatusData = [
      { name: "مكتملة", value: completedTasks, color: "hsl(142, 76%, 36%)" },
      { name: "قيد التنفيذ", value: inProgressTasks, color: "hsl(217, 91%, 60%)" },
      { name: "متأخرة", value: overdueTasksList.length, color: "hsl(0, 84%, 60%)" }
    ];

    return { 
      stats, 
      projectProgress, 
      taskStatusData, 
      tasks, // نمرر المهام الخام لاستخدامها في تصدير التقارير
      projects // نمرر المشاريع الخام لاستخدامها في البحث
    };
  }, [tasks, projects]);

  return { loading, ...data };
};