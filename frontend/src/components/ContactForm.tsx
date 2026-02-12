import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال الرسالة!",
      description: "سنتواصل معك في أقرب وقت ممكن.",
    });
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            تواصل معنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            هل لديك أسئلة حول RWM فريقنا مستعد لمساعدتك في العثور على الحل المناسب لفريقك.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Mail className="w-6 h-6 text-primary" />
                  البريد الإلكتروني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">info@fnw.com</p>
                <p className="text-muted-foreground">support@fnw.com</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Phone className="w-6 h-6 text-primary" />
                  الهاتف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+967 778 507 265</p>
                <p className="text-muted-foreground">+967 783 251 951</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  الدعم الفني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">متوفر 24/7</p>
                <p className="text-muted-foreground">استجابة سريعة خلال دقائق</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;