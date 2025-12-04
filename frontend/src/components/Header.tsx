import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <header className="w-full bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            FnW
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <span 
              onClick={() => navigate("/dashboard")} 
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              لوحة التحكم
            </span>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
            <Button 
              variant="default" 
              size="default" 
              className="shadow-button"
              onClick={() => navigate("/auth")}
            >
              تسجيل الدخول
            </Button>
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
                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-lg text-foreground hover:text-primary transition-colors text-right"
                    >
                      {link.label}
                    </a>
                  ))}
                  <span 
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/dashboard");
                    }} 
                    className="text-lg text-foreground hover:text-primary transition-colors cursor-pointer text-right"
                  >
                    لوحة التحكم
                  </span>
                  <Button 
                    variant="default" 
                    className="w-full mt-4 shadow-button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/auth");
                    }}
                  >
                    تسجيل الدخول
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;