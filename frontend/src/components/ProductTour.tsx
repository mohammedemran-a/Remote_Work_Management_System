import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, ArrowLeft, CheckCircle, Users, BarChart3, MessageSquare, Calendar } from "lucide-react";

const ProductTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tourSteps = [
    {
      title: "لوحة التحكم الرئيسية",
      description: "احصل على نظرة شاملة على جميع مشاريعك وفرقك في مكان واحد. تتبع الإنتاجية والمهام المعلقة بسهولة.",
      icon: BarChart3,
      features: ["نظرة عامة على المشاريع", "إحصائيات الفريق", "المهام العاجلة", "تقارير الأداء"],
      image: "/api/placeholder/600/400"
    },
    {
      title: "إدارة الفرق والمشاريع",
      description: "أنشئ فرق العمل، وزع المهام، وتابع التقدم في الوقت الفعلي. كل شيء منظم وواضح.",
      icon: Users,
      features: ["إنشاء الفرق", "توزيع المهام", "تتبع التقدم", "تقييم الأداء"],
      image: "/api/placeholder/600/400"
    },
    {
      title: "التواصل والتعاون",
      description: "تواصل مع فريقك عبر الرسائل الفورية، مؤتمرات الفيديو، ومشاركة الملفات بأمان تام.",
      icon: MessageSquare,
      features: ["رسائل فورية", "مؤتمرات فيديو", "مشاركة الملفات", "الإشعارات الذكية"],
      image: "/api/placeholder/600/400"
    },
    {
      title: "جدولة المهام والمواعيد",
      description: "نظم وقتك ووقت فريقك بفعالية. جدول المهام، حدد المواعيد، واحصل على تذكيرات تلقائية.",
      icon: Calendar,
      features: ["تقويم المهام", "تذكيرات تلقائية", "جدولة الاجتماعات", "تتبع المواعيد النهائية"],
      image: "/api/placeholder/600/400"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tourSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length);
  };

  const startTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const currentTourStep = tourSteps[currentStep];
  const StepIcon = currentTourStep.icon;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            جولة في المنتج
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            اكتشف كيف يمكن لـ FnW تحويل طريقة إدارة فريقك للعمل عن بعد من خلال جولة تفاعلية.
          </p>
          
          {!isPlaying && (
            <Button onClick={startTour} size="lg" className="shadow-button">
              <Play className="w-5 h-5 mr-2" />
              ابدأ الجولة التفاعلية
            </Button>
          )}
        </div>

        {isPlaying && (
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  الخطوة {currentStep + 1} من {tourSteps.length}
                </span>
                <Badge variant="secondary">
                  {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2" dir="rtl">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tour Content */}
            <Card className="border-2 border-border shadow-soft overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Content */}
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <StepIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {currentTourStep.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {currentTourStep.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <h4 className="font-semibold text-foreground">المميزات الرئيسية:</h4>
                    {currentTourStep.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      السابق
                    </Button>

                    {currentStep === tourSteps.length - 1 ? (
                      <Button className="shadow-button">
                        ابدأ التجربة المجانية
                      </Button>
                    ) : (
                      <Button onClick={nextStep}>
                        التالي
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Visual */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex items-center justify-center">
                  <div className="w-full h-80 bg-card rounded-lg shadow-soft flex items-center justify-center border">
                    <div className="text-center">
                      <StepIcon className="w-24 h-24 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">معاينة {currentTourStep.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Benefits Summary */}
        {!isPlaying && (
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {tourSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StepIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description.slice(0, 100)}...
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTour;