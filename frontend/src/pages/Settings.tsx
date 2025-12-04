import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Save, Palette, Mail, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ الإعدادات بنجاح",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-2">
          إدارة إعدادات النظام والتخصيص
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="email">البريد</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                إعدادات النظام الأساسية والشعار
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">اسم الشركة</Label>
                <Input
                  id="company-name"
                  placeholder="أدخل اسم الشركة"
                  defaultValue="إدارة العمل"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-name">اسم النظام</Label>
                <Input
                  id="system-name"
                  placeholder="أدخل اسم النظام"
                  defaultValue="نظام إدارة العمل عن بُعد"
                />
              </div>

              <div className="space-y-2">
                <Label>شعار النظام</Label>
                <div className="flex items-center gap-4">
                  {logo && (
                    <div className="w-24 h-24 rounded-lg border-2 border-border overflow-hidden">
                      <img
                        src={logo}
                        alt="شعار النظام"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <Button variant="outline" className="relative">
                      <Upload className="ml-2 h-4 w-4" />
                      رفع شعار جديد
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG حتى 2MB
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Palette className="inline-block ml-2 h-5 w-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription>
                تخصيص ألوان وثيم النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الوضع الليلي</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل الوضع الداكن للنظام
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">اللون الأساسي</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      defaultValue="#3b82f6"
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      defaultValue="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">اللون الثانوي</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      defaultValue="#8b5cf6"
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      defaultValue="#8b5cf6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">لون التمييز</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      defaultValue="#10b981"
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      defaultValue="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Mail className="inline-block ml-2 h-5 w-5" />
                إعدادات البريد الإلكتروني
              </CardTitle>
              <CardDescription>
                إعداد خادم SMTP لإرسال الرسائل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">خادم SMTP</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.example.com"
                  defaultValue="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">المنفذ</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  placeholder="587"
                  defaultValue="587"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-user">اسم المستخدم</Label>
                <Input
                  id="smtp-user"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">كلمة المرور</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">البريد المرسل</Label>
                <Input
                  id="from-email"
                  type="email"
                  placeholder="noreply@example.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>استخدام SSL/TLS</Label>
                  <p className="text-sm text-muted-foreground">
                    تشفير الاتصال بالخادم
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Bell className="inline-block ml-2 h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                التحكم في أنواع الإشعارات المرسلة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات المهام الجديدة</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند إضافة مهمة جديدة
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات التعليقات</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند إضافة تعليق جديد
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات المشاريع</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند تحديث حالة المشروع
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الفريق</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند إضافة عضو جديد للفريق
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      إرسال الإشعارات عبر البريد
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات التقارير الأسبوعية</Label>
                    <p className="text-sm text-muted-foreground">
                      إرسال تقرير أسبوعي عن التقدم
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
