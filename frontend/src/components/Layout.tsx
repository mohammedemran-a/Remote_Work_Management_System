import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationSidebar from "@/components/NotificationSidebar";
import { getSettings } from "@/api/settings";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chat");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================
  // ✅ إعدادات النظام
  // ==========================
  const [companyName, setCompanyName] = useState("إدارة العمل");
  const [systemName, setSystemName] = useState(
    "مرحبا بك في نظام إدارة العمل عن بعد"
  );

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
  // ✅ جلب إعدادات النظام
  // ==========================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        if (typeof data.company_name === "string") {
          setCompanyName(data.company_name);
        }

        if (typeof data.system_name === "string") {
          setSystemName(`مرحبا بك في نظام ${data.system_name}`);
        }
      } catch (error) {
        console.error("خطأ في جلب إعدادات النظام:", error);
      }
    };

    loadSettings();
  }, []);

  // ==========================
  // ✅ منع السكرول في صفحة الشات فقط
  // ==========================
  useEffect(() => {
    if (!isChatRoute) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [isChatRoute]);

  return (
    <div
      className="h-screen h-[100dvh] bg-background flex overflow-hidden"
      dir="rtl"
    >
      {/* Backdrop (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary truncate">
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

        {/* Navigation (⬅️ دائمًا Scrollable) */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )
                }
              >
                <Icon className="ml-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex-shrink-0">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="text-sm text-muted-foreground hidden md:block truncate max-w-[600px]">
                {systemName}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationSidebar />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          className={cn(
            "flex-1 min-h-0",
            isChatRoute ? "overflow-hidden p-0" : "p-6 overflow-y-auto"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
