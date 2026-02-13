// src/pages/Reports/useReportsState.tsx
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, TaskResponse } from "@/api/task";
import { getProjects, Project } from "@/api/project";
import { fetchUsers, User } from "@/api/users";

/* ================= TYPES ================= */
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

/* ================= CONSTANTS ================= */
const QUERY_KEYS = {
  tasks: ["tasks"],
  projects: ["projects"],
  users: ["users"],
  reports: ["reports"],
};

const CACHE_TIME = 1000 * 60 * 10; // 10 دقائق
const STALE_TIME = 1000 * 60 * 5; // 5 دقائق

/* ================= HOOK ================= */
export const useReportsState = () => {
  const queryClient = useQueryClient();

  /* ============== REACT QUERY: جلب المهام ============== */
  const {
    data: tasks = [],
    isLoading: loadingTasks,
  } = useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: getTasks,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /* ============== REACT QUERY: جلب المشاريع ============== */
  const {
    data: projects = [],
    isLoading: loadingProjects,
  } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  /* ============== REACT QUERY: جلب المستخدمين ============== */
  const {
    data: users = [],
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  const loading = loadingTasks || loadingProjects || loadingUsers;

  /* ============== COMPUTED DATA ============== */
  const data = useMemo(() => {
    const now = new Date();
    
    // ✅ حساب قائمة المهام المتأخرة الفعلية
    const overdueTasksList = tasks.filter(t => {
      const dueDate = t.due_date ? new Date(t.due_date) : null;
      return t.status !== "مكتملة" && dueDate && dueDate < now;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "مكتملة").length;
    const inProgressTasks = tasks.filter(t => t.status === "قيد التنفيذ").length;

    const stats: ReportStats = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      tasksOverdue: overdueTasksList.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };

    const projectProgress: ProjectProgressData[] = projects.map(project => {
      const projectTasks = tasks.filter(t => Number(t.project_id) === Number(project.id));
      const doneCount = projectTasks.filter(t => t.status === "مكتملة").length;
      const ratio = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;
      return { 
        id: project.id, 
        name: project.name, 
        completion: ratio, 
        status: project.status || "نشط" 
      };
    });

    const taskStatusData = [
      { name: "مكتملة", value: completedTasks, color: "#22c55e" },
      { name: "قيد التنفيذ", value: inProgressTasks, color: "#3b82f6" },
      { name: "متأخرة", value: overdueTasksList.length, color: "#ef4444" }
    ];

    const teamPerformance: TeamMemberPerformance[] = users.map(user => {
      const assignedTasks = tasks.filter(task => task.assigned_to === user.id);
      const completedAssignedTasks = assignedTasks.filter(task => task.status === 'مكتملة').length;
      const efficiency = assignedTasks.length > 0 
        ? Math.round((completedAssignedTasks / assignedTasks.length) * 100) 
        : 0;

      return {
        id: user.id,
        user: user,
        tasksAssigned: assignedTasks.length,
        tasksCompleted: completedAssignedTasks,
        efficiency: efficiency,
      };
    }).filter(member => member.tasksAssigned > 0);

    return { 
      stats, 
      projectProgress, 
      taskStatusData, 
      teamPerformance, 
      overdueTasksList, 
      tasks, 
      projects 
    };
  }, [tasks, projects, users]);

  /* ============== MANUAL REFETCH (للملف الشخصي والمشاريع والمهام) ============== */
  const refetchReports = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
  };

  return { 
    loading, 
    ...data,
    refetchReports, // للملف الشخصي والمشاريع والمهام
  };
};
