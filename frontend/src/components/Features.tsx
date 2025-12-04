import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, BarChart3, MessageSquare, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "التعاون الجماعي",
      description: "تعاون بسلاسة مع أعضاء فريقك عن بُعد من خلال أدوات التواصل المتكاملة ومساحات العمل المشتركة."
    },
    {
      icon: Clock,
      title: "تتبع الوقت",
      description: "راقب ساعات العمل والإنتاجية والجداول الزمنية للمشروع بمميزات تتبع الوقت والتقارير المتقدمة."
    },
    {
      icon: BarChart3,
      title: "تحليلات التقدم",
      description: "احصل على رؤى مفصلة حول أداء الفريق وتقدم المشروع ومقاييس الإنتاجية مع التحليلات الشاملة."
    },
    {
      icon: MessageSquare,
      title: "مركز التواصل",
      description: "اجمع جميع اتصالات الفريق مع الدردشة ومكالمات الفيديو ومشاركة الملفات وميزات الإعلانات."
    },
    {
      icon: CheckCircle,
      title: "إدارة المهام",
      description: "نظم وعين وتتبع المهام باستخدام أدوات إدارة المشاريع القوية وأتمتة سير العمل."
    },
    {
      icon: Shield,
      title: "منصة آمنة",
      description: "أمان على مستوى المؤسسات مع التشفير من طرف إلى طرف وحماية البيانات ومعايير الامتثال."
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            مميزات قوية للفرق العاملة عن بُعد
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            كل ما تحتاجه لإدارة فريقك عن بُعد بفعالية، تعزيز الإنتاجية، والحفاظ على تعاون سلس.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-shadow bg-card">
              <CardContent className="p-8">
                <div className="mb-4">
                  <feature.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;