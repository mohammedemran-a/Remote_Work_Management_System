// src/pages/Users/index.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import { useUsersState } from "./useUsersState";
import { UsersStats } from "./UsersStats";
import { UsersTable } from "./UsersTable";
import { UsersDialogs } from "./UsersDialogs";

const UsersPage = () => {
  // استدعاء الـ Hook الذي يحتوي على كل المنطق
  const {
    loading,
    users,
    roles,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    userToDelete,
    setUserToDelete,
    formData,
    setFormData,
    selectedUser,
    handleOpenDialog,
    handleSaveUser,
    confirmDelete,
  } = useUsersState();

  if (loading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إضافة وتعديل المستخدمين وتعيين الأدوار والأقسام.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      {/* ===== STATS CARDS ===== */}
      <UsersStats users={users} roles={roles} />

      {/* ===== SEARCH BAR ===== */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالاسم أو البريد الإلكتروني أو القسم..."
          className="pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ===== USERS TABLE ===== */}
      <UsersTable
        users={filteredUsers}
        onEdit={handleOpenDialog}
        onDelete={setUserToDelete}
      />

      {/* ===== DIALOGS (ADD/EDIT/DELETE) ===== */}
      <UsersDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        selectedUser={selectedUser}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        onSave={handleSaveUser}
        onDeleteConfirm={confirmDelete}
      />
    </div>
  );
};

export default UsersPage;
