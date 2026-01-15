// src/pages/Reports/useReportsState.tsx
import { useState, useEffect, useMemo } from "react";
import { getTasks, TaskResponse } from "@/api/task";
import { getProjects, Project } from "@/api/project";
import { fetchUsers, User } from "@/api/users";

// --- واجهات البيانات ---
export interface ReportStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  tasksOverdue: number;
  completionRate: number;
}

export interface ProjectProgressData {
  id: number;
  name: string;
  completion: number;
  status: string;
}

export interface TeamMemberPerformance {
  id: number;
  user: User;
  tasksAssigned: number;
  tasksCompleted: number;
  efficiency: number;
}

export const useReportsState = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, projectsData, usersData] = await Promise.all([
          getTasks(), 
          getProjects(),
          fetchUsers()
        ]);
        setTasks(tasksData || []);
        setProjects(projectsData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error("خطأ أثناء جلب بيانات التقارير:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(() => {
    const now = new Date();
    
    // ✅ 1. حساب قائمة المهام المتأخرة الفعلية بدلاً من الاعتماد على حالة "متأخرة"
    const overdueTasksList = tasks.filter(t => {
      const dueDate = t.due_date ? new Date(t.due_date) : null;
      // المهمة متأخرة إذا لم تكن مكتملة ولها تاريخ تسليم قد مضى
      return t.status !== "مكتملة" && dueDate && dueDate < now;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "مكتملة").length;
    const inProgressTasks = tasks.filter(t => t.status === "قيد التنفيذ").length;

    const stats: ReportStats = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      tasksOverdue: overdueTasksList.length, // استخدام عدد القائمة المحسوبة
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };

    const projectProgress: ProjectProgressData[] = projects.map(project => {
      const projectTasks = tasks.filter(t => Number(t.project_id) === Number(project.id));
      const doneCount = projectTasks.filter(t => t.status === "مكتملة").length;
      const ratio = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;
      return { id: project.id, name: project.name, completion: ratio, status: project.status || "نشط" };
    });

    const taskStatusData = [
      { name: "مكتملة", value: completedTasks, color: "#22c55e" },
      { name: "قيد التنفيذ", value: inProgressTasks, color: "#3b82f6" },
      { name: "متأخرة", value: overdueTasksList.length, color: "#ef4444" } // استخدام العدد الصحيح هنا أيضًا
    ];

    const teamPerformance: TeamMemberPerformance[] = users.map(user => {
      const assignedTasks = tasks.filter(task => task.assigned_to === user.id);
      const completedAssignedTasks = assignedTasks.filter(task => task.status === 'مكتملة').length;
      const efficiency = assignedTasks.length > 0 ? Math.round((completedAssignedTasks / assignedTasks.length) * 100) : 0;

      return {
        id: user.id,
        user: user,
        tasksAssigned: assignedTasks.length,
        tasksCompleted: completedAssignedTasks,
        efficiency: efficiency,
      };
    }).filter(member => member.tasksAssigned > 0);

    // ✅ 2. إرجاع قائمة المهام المتأخرة مع بقية البيانات لتستخدمها في QuickReports
    return { stats, projectProgress, taskStatusData, teamPerformance, overdueTasksList, tasks, projects };
  }, [tasks, projects, users]);

  return { loading, ...data };
};
