// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { User, Mail, Lock, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getMyProfile,
  updateMyProfile,
  updateAccount, // ✅ تمت الإضافة
} from "@/api/profile";
import { api } from "@/api/axios";
import axios from "axios";

interface ProfileData {
  name: string;
  email: string;
  job_title?: string | null;
  avatar?: string;
  joined_at?: string | null;
  status?: string | null;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    job_title: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // جلب بيانات المستخدم عند التحميل
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        setProfileData({
          name: data.user.name,
          email: data.user.email,
          job_title: data.profile.job_title,
          joined_at: data.profile.joined_at,
          status: data.profile.status,
          avatar: data.profile.avatar_url,
        });

        setAvatar(data.profile.avatar_url);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات الملف الشخصي",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  // رفع الصورة وتحديث البروفايل
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("job_title", profileData.job_title || "");

    try {
      const res = await updateMyProfile(formData);
      setAvatar(res.profile.avatar_url);

      toast({
        title: "تم تحديث الصورة",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل رفع الصورة",
      });
    }
  };

  // ✅ حفظ البيانات الشخصية (الاسم + البريد + المسمى الوظيفي)
  const handleSave = async () => {
    try {
      // 🔹 تحديث الاسم والبريد (users table)
      await updateAccount({
        name: profileData.name,
        email: profileData.email,
      });

      // 🔹 تحديث بيانات البروفايل (profiles table)
      const res = await updateMyProfile({
        job_title: profileData.job_title,
      });

      setAvatar(res.profile.avatar_url);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث معلومات الحساب بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
      });
    }
  };

  // 🔒 تحديث كلمة المرور (بدون أي تعديل)
  const handlePasswordChange = async () => {
    try {
      await api.post(`/profile/password`, {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.confirm_password,
      });

      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: unknown) {
      let message = "فشل تحديث كلمة المرور";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          message;
      }

      toast({
        title: "خطأ",
        description: message,
      });
    }
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
        {/* بطاقة الصورة الشخصية */}
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
                <span className="text-sm font-medium">
                  {profileData.job_title || "غير محدد"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  تاريخ الانضمام:
                </span>
                <span className="text-sm font-medium">
                  {profileData.joined_at || "غير محدد"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الحالة:</span>
                <span
                  className={`text-sm font-medium ${
                    profileData.status === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {profileData.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* بطاقة المعلومات الشخصية */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>
              تعديل البيانات الشخصية وكلمة المرور
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">الاسم الكامل</Label>
                  <Input
                    id="first-name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline-block ml-2 h-4 w-4" /> البريد
                    الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">المسمى الوظيفي</Label>
                  <Input
                    id="job-title"
                    value={profileData.job_title || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        job_title: e.target.value,
                      })
                    }
                  />
                </div>

                <Button onClick={handleSave} className="w-full sm:w-auto">
                  <Save className="ml-2 h-4 w-4" /> حفظ التغييرات
                </Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">
                    <Lock className="inline-block ml-2 h-4 w-4" /> كلمة المرور
                    الحالية
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm_password: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  onClick={handlePasswordChange}
                  className="w-full sm:w-auto"
                >
                  <Save className="ml-2 h-4 w-4" /> تحديث كلمة المرور
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
