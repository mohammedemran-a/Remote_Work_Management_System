// src/pages/Settings.tsx
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Save, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { getSettings, updateSettings } from "@/api/settings";
import { useAuthStore } from "@/store/useAuthStore";

const Settings = () => {
  const { toast } = useToast();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canView = hasPermission("settings_view");
  const canEdit = hasPermission("settings_edit");

  const [form, setForm] = useState({
    company_name: "",
    system_name: "",
    logo: null as File | null,

    notify_tasks: true,
    notify_comments: true,
    notify_projects: true,
    notify_team: false,
    notify_email: true,
    weekly_report: false,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================
  // ✅ جلب الإعدادات (مع صلاحية العرض)
  // ==========================
  useEffect(() => {
    if (!canView) return;

    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setForm((prev) => ({
          ...prev,
          company_name: String(data.company_name || ""),
          system_name: String(data.system_name || ""),
          notify_tasks:
            data.notify_tasks === true || data.notify_tasks === "true",
          notify_comments:
            data.notify_comments === true || data.notify_comments === "true",
          notify_projects:
            data.notify_projects === true || data.notify_projects === "true",
          notify_team: data.notify_team === true || data.notify_team === "true",
          notify_email:
            data.notify_email === true || data.notify_email === "true",
          weekly_report:
            data.weekly_report === true || data.weekly_report === "true",
        }));

        if (data.logo) {
          setLogoPreview(
            import.meta.env.VITE_API_URL + "/storage/" + data.logo
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();
  }, [canView]);

  // ==========================
  // ✅ رفع الشعار (مع صلاحية التعديل)
  // ==========================
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, logo: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ==========================
  // ✅ حفظ الإعدادات (مع صلاحية التعديل)
  // ==========================
  const handleSave = async () => {
    if (!canEdit) return;

    try {
      setLoading(true);

      await updateSettings({ ...form });

      toast({
        title: "✅ تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">جار تحميل المشاريع...</p>
      </div>
    );
  }

  // ==========================
  // ❌ لا يملك صلاحية العرض
  // ==========================
  if (!canView) {
    return (
      <div className="p-10 text-center text-destructive text-lg font-semibold">
        🚫 ليس لديك صلاحية عرض الإعدادات
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-2">إدارة إعدادات النظام</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        {/* ------------------ General ------------------ */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>بيانات النظام الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>اسم الشركة</Label>
                <Input
                  value={form.company_name}
                  disabled={!canEdit || loading}
                  onChange={(e) =>
                    setForm({ ...form, company_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>اسم النظام</Label>
                <Input
                  value={form.system_name}
                  disabled={!canEdit || loading}
                  onChange={(e) =>
                    setForm({ ...form, system_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>شعار النظام</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      className="w-24 h-24 rounded border object-cover"
                    />
                  )}
                  <Button
                    variant="outline"
                    className="relative"
                    disabled={!canEdit || loading}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    رفع شعار
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
              </div>

              {canEdit && (
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------ Notifications ------------------ */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>
                <Bell className="inline ml-2" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["notify_tasks", "إشعارات المهام"],
                ["notify_comments", "إشعارات التعليقات"],
                ["notify_projects", "إشعارات المشاريع"],
                ["notify_team", "إشعارات الفريق"],
                ["notify_email", "إشعارات البريد"],
                ["weekly_report", "التقارير الأسبوعية"],
              ].map(([key, label]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label>{label}</Label>
                  <Switch
                    checked={form[key as keyof typeof form] as boolean}
                    disabled={!canEdit || loading}
                    onCheckedChange={(v) => setForm({ ...form, [key]: v })}
                  />
                </div>
              ))}

              {canEdit && (
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
