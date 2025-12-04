import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Settings,
  UserPlus,
  Shield,
  Clock,
  Award
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  location: string;
  status: string;
  tasksCompleted: number;
  tasksInProgress: number;
  efficiency: number;
  projects: string[];
  permissions: string[];
  lastActive: string;
}

const Team = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    department: "التطوير",
    location: "",
    joinDate: "",
    tasksCompleted: 0,
    tasksInProgress: 0,
    efficiency: 0
  });

  // Mock list of users from Users page
  const availableUsers = [
    { id: 1, name: "أحمد محمد", email: "ahmed.mohamed@company.com", phone: "+966501234567", role: "مشرف" },
    { id: 2, name: "فاطمة علي", email: "fatima.ali@company.com", phone: "+966507654321", role: "مدير" },
    { id: 3, name: "محمد خالد", email: "mohamed.khaled@company.com", phone: "+966509876543", role: "موظف" },
    { id: 4, name: "سارة أحمد", email: "sara.ahmed@company.com", phone: "+966502468135", role: "موظف" },
    { id: 5, name: "عمر حسن", email: "omar.hassan@company.com", phone: "+966503691470", role: "مدير" },
    { id: 6, name: "ليلى محمود", email: "layla.mahmoud@company.com", phone: "+966508024681", role: "موظف" }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed.mohamed@company.com",
      phone: "+966501234567",
      role: "مدير مشروع",
      department: "إدارة المشاريع",
      joinDate: "2023-01-15",
      location: "الرياض، السعودية",
      status: "نشط",
      tasksCompleted: 45,
      tasksInProgress: 8,
      efficiency: 85,
      projects: ["تطوير موقع الشركة", "تطبيق الهاتف المحمول"],
      permissions: ["إدارة المشاريع", "إدارة المهام", "عرض التقارير"],
      lastActive: "منذ 5 دقائق"
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima.ali@company.com",
      phone: "+966507654321",
      role: "مطور واجهات أمامية",
      department: "التطوير",
      joinDate: "2023-03-20",
      location: "جدة، السعودية",
      status: "نشط",
      tasksCompleted: 38,
      tasksInProgress: 5,
      efficiency: 92,
      projects: ["تطوير موقع الشركة", "حملة التسويق الرقمي"],
      permissions: ["تطوير", "عرض المشاريع"],
      lastActive: "منذ 2 ساعة"
    },
    {
      id: 3,
      name: "محمد خالد",
      email: "mohamed.khaled@company.com",
      phone: "+966509876543",
      role: "مطور خلفي",
      department: "التطوير",
      joinDate: "2022-11-10",
      location: "الدمام، السعودية",
      status: "في إجازة",
      tasksCompleted: 32,
      tasksInProgress: 3,
      efficiency: 78,
      projects: ["نظام إدارة المخزون", "تحديث البنية التحتية"],
      permissions: ["تطوير", "إدارة قواعد البيانات"],
      lastActive: "منذ 3 أيام"
    },
    {
      id: 4,
      name: "سارة أحمد",
      email: "sara.ahmed@company.com",
      phone: "+966502468135",
      role: "مصممة UI/UX",
      department: "التصميم",
      joinDate: "2023-05-08",
      location: "الرياض، السعودية",
      status: "نشط",
      tasksCompleted: 28,
      tasksInProgress: 6,
      efficiency: 88,
      projects: ["تطبيق الهاتف المحمول", "حملة التسويق الرقمي"],
      permissions: ["تصميم", "عرض المشاريع"],
      lastActive: "منذ 30 دقيقة"
    },
    {
      id: 5,
      name: "عمر حسن",
      email: "omar.hassan@company.com",
      phone: "+966503691470",
      role: "مختبر جودة",
      department: "الجودة",
      joinDate: "2023-02-14",
      location: "مكة، السعودية",
      status: "نشط",
      tasksCompleted: 22,
      tasksInProgress: 4,
      efficiency: 82,
      projects: ["تطوير موقع الشركة", "نظام إدارة المخزون"],
      permissions: ["اختبار", "عرض المشاريع"],
      lastActive: "منذ 1 ساعة"
    },
    {
      id: 6,
      name: "ليلى محمود",
      email: "layla.mahmoud@company.com",
      phone: "+966508024681",
      role: "أخصائي تسويق",
      department: "التسويق",
      joinDate: "2023-04-22",
      location: "الطائف، السعودية",
      status: "نشط",
      tasksCompleted: 35,
      tasksInProgress: 7,
      efficiency: 90,
      projects: ["حملة التسويق الرقمي"],
      permissions: ["تسويق", "إدارة المحتوى"],
      lastActive: "منذ 15 دقيقة"
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "مدير مشروع":
        return "bg-purple-100 text-purple-800";
      case "مطور واجهات أمامية":
      case "مطور خلفي":
        return "bg-blue-100 text-blue-800";
      case "مصممة UI/UX":
        return "bg-pink-100 text-pink-800";
      case "مختبر جودة":
        return "bg-orange-100 text-orange-800";
      case "أخصائي تسويق":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800";
      case "في إجازة":
        return "bg-yellow-100 text-yellow-800";
      case "غير نشط":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return "text-green-600";
    if (efficiency >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = [...new Set(teamMembers.map(member => member.department))];
  const roles = [...new Set(teamMembers.map(member => member.role))];

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        userId: member.id.toString(),
        department: member.department,
        location: member.location,
        joinDate: member.joinDate,
        tasksCompleted: member.tasksCompleted,
        tasksInProgress: member.tasksInProgress,
        efficiency: member.efficiency
      });
    } else {
      setSelectedMember(null);
      setFormData({
        userId: "",
        department: "التطوير",
        location: "",
        joinDate: "",
        tasksCompleted: 0,
        tasksInProgress: 0,
        efficiency: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (!formData.userId || !formData.department || !formData.location || !formData.joinDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(false);
    toast({
      title: selectedMember ? "تم التحديث" : "تم الإضافة",
      description: selectedMember ? "تم تحديث بيانات عضو الفريق بنجاح" : "تم إضافة عضو جديد للفريق بنجاح"
    });
  };

  const handleDeleteMember = (memberId: number) => {
    setMemberToDelete(memberId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false);
    toast({
      title: "تم الحذف",
      description: "تم حذف العضو من الفريق بنجاح"
    });
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">الفريق</h1>
          <p className="text-lg text-muted-foreground">إدارة أعضاء الفريق والأدوار</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenDialog()}>
          <UserPlus className="h-4 w-4" />
          إضافة عضو جديد
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأعضاء</p>
                <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الأعضاء النشطون</p>
                <p className="text-2xl font-bold text-foreground">
                  {teamMembers.filter(m => m.status === "نشط").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الأقسام</p>
                <p className="text-2xl font-bold text-foreground">{departments.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط الكفاءة</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(teamMembers.reduce((sum, m) => sum + m.efficiency, 0) / teamMembers.length)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث في أعضاء الفريق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأدوار</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>عرض الملف</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenDialog(member)}>تعديل البيانات</DropdownMenuItem>
                    <DropdownMenuItem>إرسال رسالة</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>إلغاء التفعيل</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>انضم في {member.joinDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline ml-1" />
                  {member.lastActive}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الأداء</span>
                  <span className={`font-medium ${getEfficiencyColor(member.efficiency)}`}>
                    {member.efficiency}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المهام المكتملة</span>
                  <span className="font-medium">{member.tasksCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المهام الحالية</span>
                  <span className="font-medium">{member.tasksInProgress}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">المشاريع الحالية:</p>
                <div className="flex flex-wrap gap-1">
                  {member.projects.map((project, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    عرض التفاصيل
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{member.name}</DialogTitle>
                    <DialogDescription>
                      تفاصيل عضو الفريق والصلاحيات
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">المعلومات الأساسية</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>القسم: {member.department}</p>
                        <p>الدور: {member.role}</p>
                        <p>تاريخ الانضمام: {member.joinDate}</p>
                        <p>الموقع: {member.location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">الصلاحيات</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">إحصائيات الأداء</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>الكفاءة:</span>
                          <span className={getEfficiencyColor(member.efficiency)}>
                            {member.efficiency}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>المهام المكتملة:</span>
                          <span>{member.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المهام الحالية:</span>
                          <span>{member.tasksInProgress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد نتائج</h3>
          <p className="mt-2 text-muted-foreground">لم يتم العثور على أعضاء يطابقون معايير البحث</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{selectedMember ? "تعديل بيانات العضو" : "إضافة عضو جديد"}</DialogTitle>
            <DialogDescription>
              {selectedMember ? "قم بتعديل معلومات العضو" : "قم بإدخال معلومات العضو الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!selectedMember && (
              <div className="space-y-2">
                <Label htmlFor="userId">اختر المستخدم *</Label>
                <Select 
                  value={formData.userId} 
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستخدم من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email} - {user.role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  اختر مستخدم من قائمة المستخدمين المسجلين في النظام
                </p>
              </div>
            )}

            {selectedMember && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">معلومات المستخدم:</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedMember.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedMember.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="department">القسم *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="إدارة المشاريع">إدارة المشاريع</SelectItem>
                  <SelectItem value="التطوير">التطوير</SelectItem>
                  <SelectItem value="التصميم">التصميم</SelectItem>
                  <SelectItem value="الجودة">الجودة</SelectItem>
                  <SelectItem value="التسويق">التسويق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">الموقع *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="المدينة، الدولة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">تاريخ الانضمام *</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tasksCompleted">المهام المكتملة</Label>
                <Input
                  id="tasksCompleted"
                  type="number"
                  value={formData.tasksCompleted}
                  onChange={(e) => setFormData({ ...formData, tasksCompleted: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasksInProgress">المهام الحالية</Label>
                <Input
                  id="tasksInProgress"
                  type="number"
                  value={formData.tasksInProgress}
                  onChange={(e) => setFormData({ ...formData, tasksInProgress: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="efficiency">الكفاءة %</Label>
                <Input
                  id="efficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.efficiency}
                  onChange={(e) => setFormData({ ...formData, efficiency: parseInt(e.target.value) || 0 })}
                  placeholder="85"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveMember}>
              {selectedMember ? "حفظ التعديلات" : "إضافة العضو"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إلغاء تفعيل هذا العضو ولن يتمكن من الوصول إلى النظام.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              إلغاء التفعيل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Team;