import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Lock, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث معلومات الملف الشخصي بنجاح",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-2">
          إدارة معلوماتك الشخصية وإعدادات حسابك
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>الصورة الشخصية</CardTitle>
            <CardDescription>صورتك الظاهرة في النظام</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback className="text-3xl">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <Button variant="outline" className="relative">
                <Upload className="ml-2 h-4 w-4" />
                تحميل صورة
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                PNG, JPG حتى 2MB
              </p>
            </div>

            <div className="w-full pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الدور:</span>
                <span className="text-sm font-medium">مشرف مشروع</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">تاريخ الانضمام:</span>
                <span className="text-sm font-medium">2024/01/15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الحالة:</span>
                <span className="text-sm font-medium text-green-500">نشط</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>تعديل البيانات الشخصية وكلمة المرور</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">الاسم الأول</Label>
                    <Input
                      id="first-name"
                      placeholder="أدخل الاسم الأول"
                      defaultValue="أحمد"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">الاسم الأخير</Label>
                    <Input
                      id="last-name"
                      placeholder="أدخل الاسم الأخير"
                      defaultValue="محمد"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline-block ml-2 h-4 w-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    defaultValue="ahmed@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline-block ml-2 h-4 w-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+966 5X XXX XXXX"
                    defaultValue="+966 501234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">المسمى الوظيفي</Label>
                  <Input
                    id="job-title"
                    placeholder="أدخل المسمى الوظيفي"
                    defaultValue="مشرف تقني"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    placeholder="أدخل القسم"
                    defaultValue="تقنية المعلومات"
                  />
                </div>

                <Button onClick={handleSave} className="w-full sm:w-auto">
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">
                    <Lock className="inline-block ml-2 h-4 w-4" />
                    كلمة المرور الحالية
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="أدخل كلمة المرور الحالية"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                  <p className="text-sm text-muted-foreground">
                    يجب أن تحتوي على 8 أحرف على الأقل
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">متطلبات كلمة المرور:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 8 أحرف على الأقل</li>
                    <li>• حرف كبير واحد على الأقل</li>
                    <li>• حرف صغير واحد على الأقل</li>
                    <li>• رقم واحد على الأقل</li>
                    <li>• رمز خاص واحد على الأقل</li>
                  </ul>
                </div>

                <Button onClick={handleSave} className="w-full sm:w-auto">
                  <Save className="ml-2 h-4 w-4" />
                  تحديث كلمة المرور
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
