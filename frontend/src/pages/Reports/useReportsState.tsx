// src/pages/Reports/useReportsState.ts

import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";

// 🟢 التعديل: استيراد الدوال والواجهات الجديدة
import { getTasks, TaskResponse } from "@/api/task";
import { getTeams, Team } from "@/api/team"; // تم تغيير getTeamMembers إلى getTeams

/* ================= TYPES ================= */

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

// التعديل: التقارير الآن تعتمد على أداء "الفريق"
export interface TeamPerformance extends Team {
  tasksAssigned: number;
  tasksCompleted: number;
  efficiency: number;
}

/* ================= HOOK ================= */

export const useReportsState = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [teams, setTeams] = useState<Team[]>([]); // تغيير الاسم ليكون واضحاً
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksData, teamsData] = await Promise.all([
          getTasks(),
          getTeams(), // الدالة الجديدة
        ]);
        
        setTasks(tasksData || []); 
        setTeams(teamsData || []);

      } catch (error) {
        console.error("Failed to fetch report data:", error);
        setTasks([]);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const safeTeams = Array.isArray(teams) ? teams : [];

    // فلطرة المهام حسب التاريخ
    const filteredTasks = dateRange?.from && dateRange?.to
      ? safeTasks.filter(task => {
          const taskDate = new Date(task.created_at);
          return taskDate >= dateRange.from! && taskDate <= dateRange.to!;
        })
      : safeTasks;

    // حساب الإحصائيات العامة
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === 'مكتملة').length;
    const inProgressTasks = filteredTasks.filter(t => t.status === 'قيد التنفيذ').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const stats: ReportStats = { totalTasks, completedTasks, inProgressTasks, completionRate };

    // بيانات الرسوم البيانية
    const tasksByStatus: ChartData[] = [
      { name: 'مكتملة', value: completedTasks },
      { name: 'قيد التنفيذ', value: inProgressTasks },
      { name: 'متأخرة', value: filteredTasks.filter(t => t.status === 'متأخرة').length },
      { name: 'جديدة', value: filteredTasks.filter(t => t.status === 'جديدة').length },
    ];

    // حساب أداء كل فريق (Team Performance)
    const teamPerformance: TeamPerformance[] = safeTeams.map(team => {
      // الحصول على جميع معرفات الأعضاء في هذا الفريق
      const memberIds = team.members?.map(m => m.id) || [];
      
      // فلطرة المهام التي تخص أعضاء هذا الفريق
      const teamTasks = filteredTasks.filter(task => memberIds.includes(task.assigned_to));
      const teamTasksCompleted = teamTasks.filter(t => t.status === 'مكتملة').length;
      const efficiency = teamTasks.length > 0 ? Math.round((teamTasksCompleted / teamTasks.length) * 100) : 0;
      
      return {
        ...team,
        tasksAssigned: teamTasks.length,
        tasksCompleted: teamTasksCompleted,
        efficiency: efficiency,
      };
    });

    return { stats, teamPerformance, tasksByStatus };

  }, [tasks, teams, dateRange]);

  return {
    loading,
    dateRange,
    setDateRange,
    ...processedData,
  };
};