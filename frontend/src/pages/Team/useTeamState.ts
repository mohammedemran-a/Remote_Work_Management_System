// src/pages/Team/useTeamState.ts

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTeams, createTeam, deleteTeam, Team, TeamPayload } from "@/api/team";
import { fetchUsers, User } from "@/api/users";
import { getProjects, Project } from "@/api/project";
import { useAuthStore } from "@/store/useAuthStore";

export const useTeamState = () => {
  const { toast } = useToast();
  const { hasPermission, loading: authLoading } = useAuthStore();

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

  // ✨ تم تبسيط الدالة وإزالة التحقق المكرر
  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [teamsRes, usersRes, projectsRes] = await Promise.all([
        getTeams(),
        fetchUsers(),
        getProjects(),
      ]);
      setTeams(Array.isArray(teamsRes) ? teamsRes : []);
      setAvailableUsers(Array.isArray(usersRes) ? usersRes : []);
      setAllProjects(Array.isArray(projectsRes) ? projectsRes : []);
    } catch (error) {
      // رسالة الخطأ هنا ستظهر فقط إذا حدث خطأ في الشبكة أو الخادم
      toast({ title: "خطأ", description: "فشل في جلب بيانات الفرق", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  }, [toast]); // تم إزالة hasPermission من الاعتماديات

  useEffect(() => {
    if (authLoading) {
      return; // انتظر انتهاء تحميل المصادقة
    }
    
    // ✨ الآن نتحقق من الصلاحية هنا مرة واحدة فقط قبل استدعاء fetchData
    if (hasPermission('teams_view')) {
      fetchData();
    } else {
      // إذا لم تكن هناك صلاحية، فقط أوقف التحميل.
      // الرسالة ستظهر من مكون الصفحة الرئيسي.
      setDataLoading(false);
    }
  }, [authLoading, hasPermission, fetchData]);

  // ... باقي الدوال تبقى كما هي ...
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
    (Array.isArray(teams) ? teams : []).filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [teams, searchTerm]
  );

  return {
    loading: authLoading || dataLoading,
    teamMembers: teams, availableUsers, allProjects, filteredMembers,
    searchTerm, setSearchTerm, isAddDialogOpen, setIsAddDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen, formData, setFormData,
    selectedMember: selectedTeam, handleOpenDialog, handleSaveMember,
    handleDeleteMember: (id: number) => { setTeamToDelete(id); setIsDeleteDialogOpen(true); },
    confirmDelete, getRoleColor: () => "bg-blue-100",
  };
};
