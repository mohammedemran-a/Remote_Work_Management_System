import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  MoreVertical,
  Users,
  Shield,
  UserCheck,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  User as ApiUser,
} from "@/api/users";
import { getRoles } from "@/api/roles";

/* ================= TYPES ================= */

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ExtendedUser extends ApiUser {
  role?: string;
}

/* ================= COMPONENT ================= */

const UsersPage = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  /* ============== LOAD USERS ============== */

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();

      const extendedUsers: ExtendedUser[] = data.map((user) => ({
        ...user,
        role: user.roles?.[0] || "",
      }));

      setUsers(extendedUsers);
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        title: "خطأ",
        description: err.message || "فشل جلب المستخدمين",
        variant: "destructive",
      });
    }
  }, [toast]);

  /* ============== LOAD ROLES ============== */

  const loadRoles = useCallback(async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل جلب الأدوار";
      toast({ title: "خطأ", description: message, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  /* ============== FILTER ============== */

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ============== DIALOG ============== */

  const handleOpenDialog = (user?: ExtendedUser) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role ?? "",
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: roles[0]?.name || "",
      });
    }

    setIsDialogOpen(true);
  };

  /* ============== SAVE USER ============== */

  const handleSaveUser = async () => {
    if (
      !formData.name ||
      !formData.email ||
      (!selectedUser && !formData.password)
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        toast({ title: "تم التحديث", description: "تم تعديل المستخدم بنجاح" });
      } else {
        await createUser(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
        toast({ title: "تمت الإضافة", description: "تم إنشاء مستخدم جديد" });
      }

      setIsDialogOpen(false);
      await loadUsers();
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        title: "خطأ",
        description: err.message || "فشل حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  /* ============== DELETE ============== */

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
      await loadUsers();
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        title: "خطأ",
        description: err.message || "فشل حذف المستخدم",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8" dir="rtl">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إضافة وتعديل المستخدمين</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">عدد الأدوار</p>
              <p className="text-2xl font-bold">{roles.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">عدد المشرفين</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          placeholder="بحث..."
          className="pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ===== TABLE ===== */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                     <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail  className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setUserToDelete(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== DIALOG WITH ORIGINAL FORM STYLE ===== */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? "قم بتحديث البيانات"
                : "أدخل بيانات المستخدم الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>الاسم الكامل</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {!selectedUser && (
              <div>
                <Label>كلمة المرور</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <Label>الدور الوظيفي</Label>
              <select
                className="w-full border p-2 rounded"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveUser}>
              {selectedUser ? "حفظ التعديل" : "إضافة المستخدم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DELETE ALERT ===== */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المستخدم نهائيًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
