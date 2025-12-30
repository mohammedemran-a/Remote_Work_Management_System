// src/pages/Team/useTeamState.ts

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTeams, createTeam, deleteTeam, Team, TeamPayload } from "@/api/team";
import { fetchUsers, User } from "@/api/users";
import { getProjects, Project } from "@/api/project";
import { useAuthStore } from "@/store/useAuthStore";

export const useTeamState = () => {
  const { toast } = useToast();
  // ✨ 1. استخراج بيانات المستخدم الحالي بالكامل (وليس فقط الصلاحيات)
  const { hasPermission, loading: authLoading, user: currentUser } = useAuthStore();

  const [dataLoading, setDataLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader_id: 0,
    member_ids: [] as number[],
    project_ids: [] as number[]
  });

  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [teamsRes, usersRes, projectsRes] = await Promise.all([
        getTeams(),
        fetchUsers(),
        getProjects(),
      ]);

      let processedTeams = Array.isArray(teamsRes) ? teamsRes : [];

      // ✨ 2. تطبيق منطق التصفية الجديد
      // إذا لم يكن لدى المستخدم صلاحية عرض كل الفرق، قم بالتصفية
      if (currentUser && !hasPermission('teams_view_all')) {
        processedTeams = processedTeams.filter(team => {
          // الشرط الأول: هل المستخدم هو قائد الفريق؟
          const isLeader = team.leader_id === currentUser.id;
          // الشرط الثاني: هل المستخدم عضو في الفريق؟
          const isMember = team.members?.some(member => member.id === currentUser.id) ?? false;
          return isLeader || isMember;
        });
      }

      setTeams(processedTeams);
      setAvailableUsers(Array.isArray(usersRes) ? usersRes : []);
      setAllProjects(Array.isArray(projectsRes) ? projectsRes : []);

    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب بيانات الفرق", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  }, [toast, currentUser, hasPermission]); // 👈 إضافة currentUser و hasPermission للاعتماديات

  useEffect(() => {
    if (authLoading) {
      return; // انتظر انتهاء تحميل المصادقة
    }
    
    if (hasPermission('teams_view')) {
      fetchData();
    } else {
      setDataLoading(false);
    }
  }, [authLoading, hasPermission, fetchData]);

  // ... باقي الدوال تبقى كما هي تمامًا ...
  const handleOpenDialog = (team: Team | null) => {
    setSelectedTeam(team);
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || "",
        leader_id: team.leader_id,
        member_ids: team.members?.map(m => m.id) || [],
        project_ids: team.projects?.map(p => p.id) || []
      });
    } else {
      setFormData({ name: "", description: "", leader_id: 0, member_ids: [], project_ids: [] });
    }
    setIsAddDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!formData.name || !formData.leader_id) {
      toast({ title: "تنبيه", description: "يرجى إكمال البيانات الأساسية", variant: "destructive" });
      return;
    }
    if (!hasPermission('teams_create')) {
      toast({ title: "وصول مرفوض", description: "ليس لديك صلاحية لإنشاء فرق جديدة.", variant: "destructive" });
      return;
    }
    try {
      const payload: TeamPayload = {
        name: formData.name,
        description: formData.description,
        leader_id: Number(formData.leader_id),
        project_ids: formData.project_ids,
        member_ids: formData.member_ids
      };
      await createTeam(payload);
      toast({ title: "تم بنجاح", description: "تم إنشاء الفريق بنجاح" });
      setIsAddDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل حفظ البيانات", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!hasPermission('teams_delete')) {
      toast({ title: "وصول مرفوض", description: "ليس لديك صلاحية لحذف الفرق.", variant: "destructive" });
      setIsDeleteDialogOpen(false);
      return;
    }
    if (!teamToDelete) return;
    try {
      await deleteTeam(teamToDelete);
      setIsDeleteDialogOpen(false);
      fetchData();
      toast({ title: "تم الحذف", description: "تم حذف الفريق" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل الحذف", variant: "destructive" });
    }
  };

  const filteredMembers = useMemo(() =>
    teams.filter(t => 
      (t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.leader?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ),
    [teams, searchTerm]
  );

  return {
    loading: authLoading || dataLoading,
    teamMembers: teams, // هذه القائمة أصبحت الآن مصفاة
    availableUsers,
    allProjects,
    filteredMembers, // هذه القائمة ستتم تصفيتها مرة أخرى بناءً على البحث
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formData,
    setFormData,
    selectedMember: selectedTeam,
    handleOpenDialog,
    handleSaveMember,
    handleDeleteMember: (id: number) => { setTeamToDelete(id); setIsDeleteDialogOpen(true); },
    confirmDelete,
    getRoleColor: () => "bg-blue-100",
  };
};
