// src/pages/Team/index.tsx

// --- استيراد المكونات الفرعية ---
import TeamStats from "./TeamStats";
import TeamFilters from "./TeamFilters";
import TeamGrid from "./TeamGrid";
import TeamDialogs from "./TeamDialogs";

// --- استيراد الـ Hook الرئيسي ---
import { useTeamState } from "./useTeamState";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- المكون الرئيسي الذي يجمع كل الأجزاء ---
export const TeamPage = () => {
  // --- استدعاء الـ Hook للحصول على كل البيانات والدوال ---
  const {
    loading,
    teamMembers,
    availableUsers,
    filteredMembers,
    departments,
    roles,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterDepartment,
    setFilterDepartment,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formData,
    setFormData,
    selectedMember,
    memberToDelete,
    handleOpenDialog,
    handleSaveMember,
    handleDeleteMember,
    confirmDelete,
    getRoleColor,
    getStatusColor,
    getEfficiencyColor,
  } = useTeamState();

  return (
    <div className="space-y-8" dir="rtl">
      {/* --- قسم العنوان الرئيسي --- */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">الفريق</h1>
          <p className="text-lg text-muted-foreground">إدارة أعضاء الفريق والأدوار</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenDialog(null)}>
          <UserPlus className="h-4 w-4" />
          إضافة عضو جديد
        </Button>
      </div>

      {/* --- قسم الإحصائيات --- */}
      <TeamStats teamMembers={teamMembers} departments={departments} />

      {/* --- قسم الفلاتر والبحث --- */}
      <TeamFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        departments={departments}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        roles={roles}
      />

      {/* --- قسم عرض أعضاء الفريق --- */}
      <TeamGrid
        loading={loading}
        filteredMembers={filteredMembers}
        handleOpenDialog={handleOpenDialog}
        handleDeleteMember={handleDeleteMember}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        getEfficiencyColor={getEfficiencyColor}
      />

      {/* --- قسم النوافذ المنبثقة (Dialogs) --- */}
      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedMember={selectedMember}
        formData={formData}
        setFormData={setFormData}
        availableUsers={availableUsers}
        handleSaveMember={handleSaveMember}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

// --- تصدير المكون كـ default ليعمل مع App.tsx ---
export default TeamPage;
