import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import defaultLogo from "@/assets/Logo.jpg";
import { getSettings } from "@/api/settings";
import { useAuthStore } from "@/store/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string>(defaultLogo);
  const [systemName, setSystemName] = useState<string>("إدارة العمل عن بعد");

  // ✅ Auth
  const { token, logout } = useAuthStore();
  const isAuthenticated = !!token;

  const navLinks = [
    { href: "#features", label: "المميزات" },
    { href: "#solutions", label: "الحلول" },
    { href: "#contact", label: "تواصل معنا" },
    { href: "#about", label: "من نحن" },
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

  // ==========================
  // ✅ جلب إعدادات النظام
  // ==========================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        if (data.logo && typeof data.logo === "string") {
          setLogo(
            data.logo.startsWith("http")
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
          <div className="hidden md:flex items-center space-x-reverse space-x-3">
            <ThemeToggle />

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 transition-all duration-300"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                  3
                </Badge>
              </Button>
            )}

            {isAuthenticated ? (
              <Button
                variant="destructive"
                className="flex items-center gap-2 hover:scale-105 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
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
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleLogout}
                    >
                      تسجيل الخروج
                    </Button>
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
