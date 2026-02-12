import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* القسم الأيسر: الشعار والوصف */}
          <div className="md:max-w-md">
            <div className="text-2xl font-bold mb-3 text-primary">RWM</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تمكين الفرق عن بُعد بأدوات التعاون القوية وحلول الإدارة المتقدمة لبيئة العمل الحديثة.
            </p>
          </div>

          {/* القسم الأيمن: النص السفلي */}
          <div className="text-sm text-muted-foreground">
            <p>© 2024 RWM. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
