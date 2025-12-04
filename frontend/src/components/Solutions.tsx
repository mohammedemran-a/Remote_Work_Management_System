import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users2, Zap } from "lucide-react";

const Solutions = () => {
  const solutions = [
    {
      icon: Building2,
      title: "حلول المؤسسات",
      description: "حلول قابلة للتطوير للمنظمات الكبيرة مع الأمان المتقدم والامتثال والتكامل المخصص.",
      features: ["تكاملات مخصصة", "أمان متقدم", "دعم مخصص", "أدوات الامتثال"]
    },
    {
      icon: Users2,
      title: "الفرق الصغيرة",
      description: "مثالية للشركات الناشئة والفرق الصغيرة التي تسعى لتحسين التعاون والإنتاجية عن بُعد.",
      features: ["إعداد سهل", "المميزات الأساسية", "دردشة الفريق", "تحليلات أساسية"]
    },
    {
      icon: Zap,
      title: "الشركات النامية",
      description: "مميزات متقدمة للشركات متوسطة الحجم التي تتوسع في عملياتها وإدارة فرقها عن بُعد.",
      features: ["تحليلات متقدمة", "أتمتة سير العمل", "وصول API", "دعم أولوية"]
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            حلول لكل حجم فريق
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            سواء كنت شركة ناشئة أم مؤسسة، لدينا الحل المناسب لمساعدة فريقك عن بُعد على النجاح والنمو.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {solutions.map((solution, index) => (
            <Card key={index} className="border-2 border-border hover:border-primary/20 transition-colors shadow-soft hover:shadow-medium">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <solution.icon className="w-16 h-16 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {solution.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-muted-foreground text-sm">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  اعرف المزيد
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" className="shadow-button">
            ابدأ التجربة المجانية
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Solutions;