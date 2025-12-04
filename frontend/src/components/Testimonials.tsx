import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير المشروع",
      company: "شركة التقنية الحديثة",
      content: "FnW غير تماماً طريقة إدارة فريقنا عن بُعد. تحسنت الإنتاجية بنسبة 40% وأصبح التواصل أكثر فعالية بكثير.",
      rating: 5
    },
    {
      name: "فاطمة أحمد", 
      role: "مديرة التطوير",
      company: "شركة الابتكار الرقمي",
      content: "الواجهة سهلة الاستخدام والميزات شاملة. ساعدنا FnW في تنظيم عملنا وتتبع تقدم المشاريع بطريقة مثالية.",
      rating: 5
    },
    {
      name: "سالم خالد",
      role: "المدير التنفيذي", 
      company: "شركة النمو السريع",
      content: "بعد استخدام عدة منصات، وجدنا أن FnW هو الحل الأمثل. وفر علينا الوقت والمال وحسن من تعاون الفريق بشكل ملحوظ.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            انضم إلى آلاف الفرق حول العالم التي تثق في FnW لإدارة عملياتها عن بُعد بنجاح.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-shadow bg-card">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} في {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;