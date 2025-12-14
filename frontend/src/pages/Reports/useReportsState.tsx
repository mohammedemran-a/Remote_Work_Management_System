// src/pages/Reports/useReportsState.ts

import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";

// 🟢 1. استيراد كل الواجهات من مصادرها الصحيحة في مجلد api
import { getTasks, TaskResponse } from "@/api/task";
import { getTeamMembers, TeamMember } from "@/api/team";

/* ================= TYPES ================= */

// الواجهات التالية خاصة بهذه الصفحة فقط، لذا تبقى هنا
export interface ReportStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TeamMemberPerformance extends TeamMember {
  tasksAssigned: number;
  tasksCompleted: number;
  efficiency: number;
}

/* ================= HOOK ================= */

export const useReportsState = () => {
  // --- حالات البيانات الأولية ---
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // --- حالة نطاق التاريخ ---
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // --- جلب البيانات الأولية من الـ API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksData, teamMembersData] = await Promise.all([
          getTasks(),
          getTeamMembers(),
        ]);
        
        setTasks(tasksData || []); 
        setTeamMembers(teamMembersData || []);

      } catch (error) {
        console.error("Failed to fetch report data:", error);
        setTasks([]);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- استخدام useMemo لمعالجة البيانات (لا تغيير هنا) ---
  const processedData = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

    const filteredTasks = dateRange?.from && dateRange?.to
      ? safeTasks.filter(task => new Date(task.created_at) >= dateRange.from! && new Date(task.created_at) <= dateRange.to!)
      : safeTasks;

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === 'مكتملة').length;
    const inProgressTasks = filteredTasks.filter(t => t.status === 'قيد التنفيذ').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const stats: ReportStats = { totalTasks, completedTasks, inProgressTasks, completionRate };

    const tasksByStatus: ChartData[] = [
      { name: 'مكتملة', value: completedTasks },
      { name: 'قيد التنفيذ', value: inProgressTasks },
      { name: 'متأخرة', value: filteredTasks.filter(t => t.status === 'متأخرة').length },
      { name: 'جديدة', value: filteredTasks.filter(t => t.status === 'جديدة').length },
    ];
    const tasksByPriority: ChartData[] = [
        { name: 'عالية', value: filteredTasks.filter(t => t.priority === 'عالية').length },
        { name: 'متوسطة', value: filteredTasks.filter(t => t.priority === 'متوسطة').length },
        { name: 'منخفضة', value: filteredTasks.filter(t => t.priority === 'منخفضة').length },
    ];

    const teamPerformance: TeamMemberPerformance[] = safeTeamMembers.map(member => {
      // التأكد من وجود member.user قبل الوصول إلى خصائصه
      if (!member || !member.user) return null; 
      const memberTasks = filteredTasks.filter(task => task.assigned_to === member.user_id);
      const memberTasksCompleted = memberTasks.filter(t => t.status === 'مكتملة').length;
      const efficiency = memberTasks.length > 0 ? Math.round((memberTasksCompleted / memberTasks.length) * 100) : 0;
      return {
        ...member,
        tasksAssigned: memberTasks.length,
        tasksCompleted: memberTasksCompleted,
        efficiency: efficiency,
      };
    }).filter(Boolean) as TeamMemberPerformance[]; // إزالة أي قيم null

    return { stats, teamPerformance, tasksByStatus, tasksByPriority };

  }, [tasks, teamMembers, dateRange]);

  return {
    loading,
    dateRange,
    setDateRange,
    ...processedData,
  };
};
