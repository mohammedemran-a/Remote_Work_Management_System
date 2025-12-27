import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTeams, createTeam, deleteTeam, Team } from "@/api/team";
import { fetchUsers, User } from "@/api/users";
import { getProjects, Project } from "@/api/project";

export const useTeamState = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const [teamsRes, usersRes, projectsRes] = await Promise.all([
        getTeams(),
        fetchUsers(),
        getProjects(), 
      ]);

      setTeams(Array.isArray(teamsRes) ? teamsRes : []);
      setAvailableUsers(Array.isArray(usersRes) ? usersRes : []);
      setAllProjects(Array.isArray(projectsRes) ? projectsRes : []);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        leader_id: Number(formData.leader_id),
        project_ids: formData.project_ids,
        member_ids: formData.member_ids 
      };

      if (selectedTeam) {
        // يمكن إضافة دالة تحديث هنا
      } else {
        await createTeam(payload as any);
        toast({ title: "تم بنجاح", description: "تم إنشاء الفريق وربط الأعضاء والمشاريع" });
      }
      setIsAddDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل حفظ البيانات", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
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
    loading, teamMembers: teams, availableUsers, allProjects, filteredMembers,
    searchTerm, setSearchTerm, isAddDialogOpen, setIsAddDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen, formData, setFormData,
    selectedMember: selectedTeam, handleOpenDialog, handleSaveMember,
    handleDeleteMember: (id: number) => { setTeamToDelete(id); setIsDeleteDialogOpen(true); },
    confirmDelete, getRoleColor: () => "bg-blue-100",
  };
};