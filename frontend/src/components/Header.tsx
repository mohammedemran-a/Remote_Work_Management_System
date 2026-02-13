import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import defaultLogo from "@/assets/Logo.jpg";
import { getSettings } from "@/api/settings";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

/* ================= QUERY KEYS ================= */
const QUERY_KEYS = {
  users: ["users"],
  reports: ["reports"],
  teams: ["teams"],
  conversations: ["conversations"],
};

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string>(defaultLogo);
  const [systemName, setSystemName] = useState<string>("إدارة العمل عن بعد");

  // ✅ Auth
  const { token, logout, user: currentUser, fetchUser } = useAuthStore();
  const isAuthenticated = !!token;

  // ✅ جلب بيانات المستخدم عند التحميل الأول
  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      fetchUser();
    }
  }, [isAuthenticated, currentUser, fetchUser]);

  const navLinks = [
    { href: "#features", label: "المميزات" },
    { href: "#solutions", label: "الحلول" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      window.location.hash = href;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  /* ============== تحديث البيانات المرتبطة عند الدخول للملف الشخصي ============== */
  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
  };

  // ==========================
  // ✅ جلب إعدادات النظام
  // ==========================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        if (data.logo && typeof data.logo === "string") {
          setLogo(
            data.logo.startsWith("http" )
              ? data.logo
              : `${import.meta.env.VITE_APP_API_URL}/storage/${data.logo}`
          );
        }

        if (data.system_name && typeof data.system_name === "string") {
          setSystemName(data.system_name);
        }
      } catch (error) {
        console.error("خطأ في جلب إعدادات النظام:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft transition-all duration-500 hover:bg-background/95 hover:shadow-medium hover:border-primary/20 group">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <nav className="flex items-center justify-between">
          {/* الشعار */}
          <div
            className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img
                src={logo}
                alt={`${systemName} Logo`}
                className="h-12 w-12 object-cover rounded-full border-2 border-primary/30 transition-all duration-300 group-hover:border-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-lg font-bold text-primary">
              {systemName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-gradient-to-l after:from-primary after:to-primary/50 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}

            {isAuthenticated && (
              <span
                onClick={() => navigate("/dashboard")}
                className="relative cursor-pointer text-foreground/80 hover:text-primary transition-all duration-300 font-medium after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-gradient-to-l after:from-primary after:to-primary/50 after:transition-all after:duration-300 hover:after:w-full"
              >
                لوحة التحكم
              </span>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            <ThemeToggle />

            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      <AvatarImage
                        src={currentUser.avatar_url || undefined}
                        alt={currentUser.name}
                      />
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      handleProfileClick();
                      invalidateRelatedQueries();
                    }}
                    className="cursor-pointer"
                  >
                    <User className="ml-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:text-red-700"
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                className="shadow-button bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:shadow-medium hover:scale-105"
                onClick={() => navigate("/auth")}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center flex-row-reverse gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[280px] pt-12">
                <nav className="flex flex-col space-y-6 text-right">
                  {/* بيانات المستخدم في الموبايل */}
                  {isAuthenticated && currentUser && (
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarImage
                          src={currentUser.avatar_url || undefined}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="bg-primary/10">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-lg text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}

                  {isAuthenticated && (
                    <span
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/dashboard");
                      }}
                      className="text-lg cursor-pointer hover:text-primary"
                    >
                      لوحة التحكم
                    </span>
                  )}

                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsOpen(false);
                          handleProfileClick();
                          invalidateRelatedQueries();
                        }}
                      >
                        <User className="ml-2 h-4 w-4" />
                        الملف الشخصي
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full mt-4"
                      onClick={() => navigate("/auth")}
                    >
                      تسجيل الدخول
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
