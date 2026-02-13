// src/pages/Team/useTeamState.ts

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getTeams, createTeam, deleteTeam, Team, TeamPayload } from "@/api/team";
import { fetchUsers, User } from "@/api/users";
import { getProjects, Project } from "@/api/project";
import { useAuthStore } from "@/store/useAuthStore";

/* ================= CONSTANTS ================= */
const QUERY_KEYS = {
  teams: ["teams"],
  users: ["users"],
  projects: ["projects"],
};

const CACHE_TIME = 1000 * 60 * 10; // 10 دقائق
const STALE_TIME = 1000 * 60 * 5; // 5 دقائق

/* ================= HOOK ================= */
export const useTeamState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasPermission, loading: authLoading, user: currentUser } = useAuthStore();

  // --- حالات الواجهة ---
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  /* ============== REACT QUERY: جلب الفرق ============== */
  const {
    data: allTeams = [],
    isLoading: loadingTeams,
  } = useQuery({
    queryKey: QUERY_KEYS.teams,
    queryFn: getTeams,
    enabled: hasPermission('teams_view'),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /* ============== REACT QUERY: جلب المستخدمين ============== */
  const {
    data: availableUsers = [],
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  /* ============== REACT QUERY: جلب المشاريع ============== */
  const {
    data: allProjects = [],
    isLoading: loadingProjects,
  } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });

  const dataLoading = loadingTeams || loadingUsers || loadingProjects;

  /* ============== MUTATION: إنشاء فريق ============== */
  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      toast({ title: "تم بنجاح", description: "تم إنشاء الفريق بنجاح" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams });
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", leader_id: 0, member_ids: [], project_ids: [] });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل حفظ البيانات", variant: "destructive" });
    },
  });

  /* ============== MUTATION: حذف فريق ============== */
  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      toast({ title: "تم الحذف", description: "تم حذف الفريق" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams });
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل الحذف", variant: "destructive" });
    },
  });

  /* ============== FILTERING: تصفية الفرق بناءً على الصلاحيات ============== */
  const teams = useMemo(() => {
    let processedTeams = Array.isArray(allTeams) ? allTeams : [];

    if (currentUser && !hasPermission('teams_view_all')) {
      processedTeams = processedTeams.filter(team => {
        const isLeader = team.leader_id === currentUser.id;
        const isMember = team.members?.some(member => member.id === currentUser.id) ?? false;
        return isLeader || isMember;
      });
    }

    return processedTeams;
  }, [allTeams, currentUser, hasPermission]);

  /* ============== FILTERING: البحث والتصفية ============== */
  const filteredMembers = useMemo(() =>
    teams.filter(t => 
      (t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.leader?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ),
    [teams, searchTerm]
  );

  /* ============== HANDLERS ============== */
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

    const payload: TeamPayload = {
      name: formData.name,
      description: formData.description,
      leader_id: Number(formData.leader_id),
      project_ids: formData.project_ids,
      member_ids: formData.member_ids
    };

    createMutation.mutate(payload);
  };

  const confirmDelete = async () => {
    if (!hasPermission('teams_delete')) {
      toast({ title: "وصول مرفوض", description: "ليس لديك صلاحية لحذف الفرق.", variant: "destructive" });
      setIsDeleteDialogOpen(false);
      return;
    }
    if (!teamToDelete) return;

    deleteMutation.mutate(teamToDelete);
  };

  /* ============== MANUAL REFETCH (للملف الشخصي) ============== */
  const refetchTeams = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams });
  };

  return {
    loading: authLoading || dataLoading,
    teamMembers: teams,
    availableUsers,
    allProjects,
    filteredMembers,
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
    isSaving: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchTeams, // للملف الشخصي
  };
};
