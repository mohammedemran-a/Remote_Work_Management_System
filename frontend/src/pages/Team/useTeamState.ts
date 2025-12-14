// src/pages/Team/useTeamState.ts

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

// 🟢 1. استيراد كل الواجهات والدوال من ملفات الـ API
import { 
  getTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  TeamMemberPayload,
  TeamMember // ✅ استيراد الواجهة من مصدرها الصحيح في api/team
} from "@/api/team";
import { fetchUsers, User } from "@/api/users";

// 🔴 تم حذف التعريف المكرر لواجهة TeamMember من هنا

// --- الـ Hook الرئيسي الذي يحتوي على كل منطق الحالة ---
export const useTeamState = () => {
  // --- حالات الواجهة (UI States) ---
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // --- حالات البيانات (Data States) ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  // --- حالات النموذج والفلترة ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [formData, setFormData] = useState({ userId: "", department: "التطوير", location: "", joinDate: "", phone: "" });
  
  // --- حالات لتتبع العضو المحدد ---
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  // --- دالة لجلب البيانات الأولية من الخادم ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamResponse, usersResponse] = await Promise.all([
          getTeamMembers(),
          fetchUsers(),
        ]);
        
        setTeamMembers(teamResponse || []);
        
        const teamMemberUserIds = new Set((teamResponse || []).map((m: TeamMember) => m.user_id));
        const unassignedUsers = (usersResponse || []).filter((u: User) => !teamMemberUserIds.has(u.id));
        setAvailableUsers(unassignedUsers);

      } catch (error) {
        toast({ title: "خطأ", description: "فشل في جلب البيانات من الخادم.", variant: "destructive" });
        setTeamMembers([]);
        setAvailableUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // --- دالة لفتح نافذة الإضافة أو التعديل ---
  const handleOpenDialog = (member: TeamMember | null) => {
    setSelectedMember(member);
    if (member) {
      // حالة التعديل: ملء النموذج ببيانات العضو المحدد
      setFormData({
        userId: member.user_id.toString(),
        department: member.user.department || "التطوير",
        location: member.location,
        joinDate: member.join_date,
        phone: member.phone || "",
      });
    } else {
      // حالة الإضافة: إعادة تعيين النموذج
      setFormData({ userId: "", department: "التطوير", location: "", joinDate: "", phone: "" });
    }
    setIsAddDialogOpen(true);
  };

  // --- دالة الحفظ (إضافة أو تعديل) ---
  const handleSaveMember = async () => {
    if (!formData.userId || !formData.location || !formData.joinDate) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة.", variant: "destructive" });
      return;
    }
    
    const payload: TeamMemberPayload = {
      user_id: parseInt(formData.userId),
      location: formData.location,
      join_date: formData.joinDate,
      department: formData.department,
      phone: formData.phone,
    };

    try {
      if (selectedMember) {
        // --- منطق التعديل ---
        const updatedMember = await updateTeamMember(selectedMember.id, payload);
        setTeamMembers(prev => prev.map(m => m.id === selectedMember.id ? updatedMember : m));
        toast({ title: "تم التحديث", description: "تم تحديث بيانات العضو بنجاح." });
      } else {
        // --- منطق الإضافة ---
        const newMember = await addTeamMember(payload);
        setTeamMembers(prev => [...prev, newMember]);
        setAvailableUsers(prev => prev.filter(u => u.id !== payload.user_id));
        toast({ title: "تم الإضافة", description: "تم إضافة العضو للفريق بنجاح." });
      }
      setIsAddDialogOpen(false);
    } catch (error: any) {
        const errorMessages = error.errors ? Object.values(error.errors).flat().join('\n') : "فشل في حفظ بيانات العضو.";
        toast({
            title: "حدث خطأ",
            description: errorMessages,
            variant: "destructive",
        });
    }
  };

  // --- دالة لفتح نافذة تأكيد الحذف ---
  const handleDeleteMember = (id: number) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // --- دالة لتأكيد الحذف النهائي ---
  const confirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete);
      setTeamMembers(prev => prev.filter(m => m.id !== memberToDelete));
      setIsDeleteDialogOpen(false);
      toast({ title: "تم الحذف", description: "تم إزالة العضو من الفريق بنجاح." });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إزالة العضو.", variant: "destructive" });
    }
  };

  // --- استخدام useMemo لتحسين أداء الفلترة ---
  const filteredMembers = useMemo(() => (teamMembers || []).filter(member => {
    const user = member.user;
    if (!user) return false;
    const roleNames = user.roles?.map(r => r.name) || [];
    const departmentName = user.department || '';
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || roleNames.includes(filterRole);
    const matchesDepartment = filterDepartment === "all" || departmentName === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  }), [teamMembers, searchTerm, filterRole, filterDepartment]);

  // --- استخدام useMemo لحساب قوائم الفلاتر ---
  const departments = useMemo(() => [...new Set((teamMembers || []).map(m => m.user?.department).filter(Boolean))] as string[], [teamMembers]);
  const roles = useMemo(() => [...new Set((teamMembers || []).flatMap(m => m.user?.roles?.map(r => r.name) || []).filter(Boolean))] as string[], [teamMembers]);

  // --- دوال مساعدة لتلوين العناصر ---
  const getRoleColor = (role: string) => {
    if (role.includes("مدير")) return "bg-purple-100 text-purple-800";
    if (role.includes("مطور")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };
  const getStatusColor = (status: string) => {
    if (status === "نشط") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return "text-green-600";
    if (efficiency >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // --- إرجاع كل الحالات والدوال التي تحتاجها المكونات الأخرى ---
  return {
    loading, teamMembers, availableUsers, filteredMembers, departments, roles,
    searchTerm, setSearchTerm, filterRole, setFilterRole, filterDepartment, setFilterDepartment,
    isAddDialogOpen, setIsAddDialogOpen, isDeleteDialogOpen, setIsDeleteDialogOpen,
    formData, setFormData, selectedMember, memberToDelete,
    handleOpenDialog, handleSaveMember, handleDeleteMember, confirmDelete,
    getRoleColor, getStatusColor, getEfficiencyColor,
  };
};
