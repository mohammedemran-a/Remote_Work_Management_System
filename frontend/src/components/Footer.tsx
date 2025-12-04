import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold mb-4 text-primary">FnW</div>
            <p className="text-muted-foreground mb-6 max-w-md">
              تمكين الفرق عن بُعد بأدوات التعاون القوية وحلول الإدارة المتقدمة لبيئة العمل الحديثة.
            </p>
            <div className="flex space-x-reverse space-x-4">
              <Input 
                placeholder="أدخل بريدك الإلكتروني" 
                className="bg-background border-border"
              />
              <Button variant="default">
                اشترك
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">المميزات</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">التعاون الجماعي</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">تتبع الوقت</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">تحليلات التقدم</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">إدارة المهام</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">الشركة</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الوظائف</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">المدونة</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">تواصل معنا</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2024 FnW. جميع الحقوق محفوظة.
          </p>
          <div className="flex space-x-reverse space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;