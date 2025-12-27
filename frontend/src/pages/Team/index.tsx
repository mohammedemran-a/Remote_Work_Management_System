// src/pages/Team/index.tsx
import TeamStats from "./TeamStats";
import { TeamFilters } from "./TeamFilters";
import TeamGrid from "./TeamGrid";
import { TeamDialogs } from "./TeamDialogs";
import { useTeamState } from "./useTeamState";
import { Plus } from "lucide-react"; 
import { Button } from "@/components/ui/button";

export const TeamPage = () => {
  const {
    loading,
    teamMembers,
    availableUsers,
    allProjects, // 🟢 تأكد من استخراجها هنا من الـ Hook
    filteredMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formData,
    setFormData,
    selectedMember,
    handleOpenDialog,
    handleSaveMember,
    handleDeleteMember,
    confirmDelete,
    getRoleColor,
  } = useTeamState();

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">فرق العمل</h1>
          <p className="text-lg text-muted-foreground">إدارة وتشكيل فرق المشاريع وتعيين القادة</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenDialog(null)}>
          <Plus className="h-4 w-4" />
          إنشاء فريق جديد
        </Button>
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

      {/* 🟢 التعديل الجوهري هنا: تمرير allProjects */}
      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedMember={selectedMember}
        formData={formData}
        setFormData={setFormData}
        availableUsers={availableUsers}
        allProjects={allProjects || []} // 👈 مررها هنا وأضف || [] للحماية
        handleSaveMember={handleSaveMember}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default TeamPage;