import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginStore = useAuthStore((state) => state.login);
  const registerStore = useAuthStore((state) => state.register);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    try {
      await loginStore(loginEmail, loginPassword);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام إدارة المشاريع",
      });
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل تسجيل الدخول",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 8) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerStore(signupName, signupEmail, signupPassword);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "أهلاً بك معنا 🎉",
      });
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل إنشاء الحساب",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4"
    >
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            نظام إدارة المشاريع
          </CardTitle>
          <CardDescription>إدارة مشاريعك وفريقك بكفاءة عالية</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>

            {/* تسجيل الدخول */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="block text-right mb-2">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pr-10 text-right placeholder:text-right"
                      placeholder="ادخل البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-right mb-2">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10 pl-10 text-right"
                      placeholder="ادخل كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex filex-row-reverse justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(v) => setRememberMe(!!v)}
                    />
                    <Label className="text-right">تذكرني</Label>
                  </div>

                  <Button variant="link" className="p-0 h-auto text-sm">
                    نسيت كلمة المرور؟
                  </Button>
                </div>

                <Button className="w-full">تسجيل الدخول</Button>
              </form>
            </TabsContent>

            {/* إنشاء حساب */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label className="block text-right mb-2">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pr-10 text-right"
                      placeholder="ادخل الاسم الكامل"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-right mb-2">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pr-10 text-right"
                      placeholder="ادخل البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-right mb-2">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pr-10 pl-10 text-right"
                      placeholder="ادخل كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="block text-right mb-2">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="pr-10 pl-10 text-right"
                      placeholder="أعد إدخال كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <Button className="w-full">إنشاء حساب</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
