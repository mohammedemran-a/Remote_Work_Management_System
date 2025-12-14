import { NavLink, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Calendar, 
  FileText, 
  BarChart3, 
  Users,
  MessageSquare,
  Menu,
  X,
  Home,
  Settings,
  User,
  Shield,
  Activity,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationSidebar from "@/components/NotificationSidebar";
import { getSettings } from "@/api/settings";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // اسم الشركة واسم النظام مع القيم الافتراضية
  const [companyName, setCompanyName] = useState<string>("إدارة العمل");
  const [systemName, setSystemName] = useState<string>("مرحبا بك في نظام إدارة العمل عن بعد");

  const navigation = [
    { name: "الصفحة الرئيسية", href: "/", icon: Home },
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "المشاريع", href: "/projects", icon: FolderOpen },
    { name: "المهام", href: "/tasks", icon: CheckSquare },
    { name: "التقويم", href: "/calendar", icon: Calendar },
    { name: "الملفات", href: "/files", icon: FileText },
    { name: "التقارير", href: "/reports", icon: BarChart3 },
    { name: "المستخدمين", href: "/users", icon: Users },
    { name: "الفريق", href: "/team", icon: Users },
    { name: "المحادثات", href: "/chat", icon: MessageSquare },
    { name: "الإشعارات", href: "/notifications", icon: Bell },
    { name: "الملف الشخصي", href: "/profile", icon: User },
    { name: "الإعدادات", href: "/settings", icon: Settings },
    { name: "الأدوار والصلاحيات", href: "/roles", icon: Shield },
    { name: "سجل الأنشطة", href: "/logs", icon: Activity },
  ];

  // ==========================
  // ✅ جلب إعدادات النظام من API
  // ==========================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        // تأكد أن القيم من النوع string
        if (data.company_name && typeof data.company_name === "string") {
          setCompanyName(data.company_name);
        }

        if (data.system_name && typeof data.system_name === "string") {
          setSystemName(`مرحبا بك في نظام ${data.system_name}`);
        }
      } catch (error) {
        console.error("خطأ في جلب إعدادات النظام:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <div className="h-screen bg-background flex overflow-hidden" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        {/* Sidebar Header - Fixed */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold text-primary">
            {companyName}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="ml-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-card shadow-sm border-b border-border h-16 flex-shrink-0">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {systemName}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationSidebar />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
