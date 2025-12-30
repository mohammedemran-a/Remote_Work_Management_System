// src/pages/Team/index.tsx

import TeamStats from "./TeamStats";
import { TeamFilters } from "./TeamFilters";
import TeamGrid from "./TeamGrid";
import { TeamDialogs } from "./TeamDialogs";
import { useTeamState } from "./useTeamState";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const TeamPage = () => {
  const { hasPermission } = useAuthStore();
  const {
    loading,
    teamMembers,
    availableUsers,
    allProjects,
    filteredMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen, // تأكد من استخراجها
    formData,
    setFormData,
    selectedMember,
    handleOpenDialog,
    handleSaveMember,
    handleDeleteMember,
    confirmDelete,
    getRoleColor,
  } = useTeamState();

  if (!hasPermission('teams_view')) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-muted-foreground" dir="rtl">
        ليس لديك الصلاحية لعرض هذه الصفحة.
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">فرق العمل</h1>
          <p className="text-lg text-muted-foreground">إدارة وتشكيل فرق المشاريع وتعيين القادة</p>
        </div>
        {hasPermission('teams_create') && (
          <Button className="flex items-center gap-2" onClick={() => handleOpenDialog(null)}>
            <Plus className="h-4 w-4" />
            إنشاء فريق جديد
          </Button>
        )}
      </div>

      <TeamStats teamMembers={teamMembers} />

      <TeamFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TeamGrid
        loading={loading}
        filteredMembers={filteredMembers}
        handleOpenDialog={handleOpenDialog}
        handleDeleteMember={handleDeleteMember}
        getRoleColor={getRoleColor}
      />

      {/* ✨ تم إصلاح الخطأ هنا بإضافة الخاصية المفقودة */}
      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedMember={selectedMember}
        formData={formData}
        setFormData={setFormData}
        availableUsers={availableUsers}
        allProjects={allProjects || []}
        handleSaveMember={handleSaveMember}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default TeamPage;
