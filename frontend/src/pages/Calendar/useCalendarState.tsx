// src/pages/Calendar/useCalendarState.ts

// --- استيراد المكتبات اللازمة ---
import { useState, useEffect } from "react"; // استيراد Hooks أساسية من React
import { format, parseISO } from "date-fns"; // مكتبة للتعامل مع التواريخ
import { useToast } from "@/hooks/use-toast"; // Hook لعرض الإشعارات

// --- واجهة (Interface) لتحديد شكل بيانات الحدث ---
// هذا يساعد TypeScript على فهم بنية الكائن
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  attendees: string[];
  description: string;
}

// --- الـ Hook الرئيسي الذي يحتوي على كل منطق الحالة ---
export const useCalendarState = () => {
  // --- تعريف الحالات (States) ---
  const [events, setEvents] = useState<Event[]>([]); // حالة لتخزين مصفوفة الأحداث، تبدأ فارغة
  const [selectedDate, setSelectedDate] = useState(new Date()); // حالة لتخزين التاريخ المختار في التقويم
  const [currentMonth, setCurrentMonth] = useState(new Date()); // حالة لتخزين الشهر المعروض حاليًا
  const [isDialogOpen, setIsDialogOpen] = useState(false); // حالة للتحكم في فتح وإغلاق نافذة الإضافة/التعديل
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // حالة لتخزين الحدث الذي يتم تعديله حاليًا
  const { toast } = useToast(); // استدعاء Hook الإشعارات

  // حالة لتخزين بيانات النموذج (Form) عند إضافة أو تعديل حدث
  const [formData, setFormData] = useState({
    title: "", date: new Date(), time: "", duration: "", type: "meeting", location: "", attendees: "", description: ""
  });

  // --- دالة لجلب البيانات من الخادم عند تحميل المكون لأول مرة ---
  useEffect(() => {
    // تعريف دالة غير متزامنة (async) لجلب الأحداث
    const fetchEvents = async () => {
      try {
        // إرسال طلب GET إلى واجهة Laravel الخلفية
        const response = await fetch('http://127.0.0.1:8000/api/events' );
        
        // إذا لم يكن الطلب ناجحًا، قم برمي خطأ
        if (!response.ok) {
          throw new Error('فشل في جلب الأحداث من الخادم');
        }
        
        // تحويل الاستجابة إلى JSON
        const data: Event[] = await response.json();
        
        // تحديث حالة الأحداث بالبيانات التي تم جلبها
        setEvents(data);

      } catch (error) {
        // في حالة حدوث أي خطأ، قم بطباعته في الكونسول وعرض إشعار للمستخدم
        console.error("خطأ في جلب البيانات:", error);
        toast({ title: "خطأ", description: "فشل في جلب الأحداث من الخادم", variant: "destructive" });
      }
    };

    fetchEvents(); // استدعاء الدالة
  }, [toast]); // المصفوفة الفارغة [] تجعل هذا التأثير يعمل مرة واحدة فقط عند التحميل

  // --- دوال مساعدة (تبقى كما هي) ---

  // دالة لإعادة تعيين حقول النموذج
  const resetForm = () => {
    setFormData({ title: "", date: new Date(), time: "", duration: "", type: "meeting", location: "", attendees: "", description: "" });
    setEditingEvent(null);
  };

  // دالة لفتح نافذة إضافة حدث جديد
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // دالة لفتح نافذة تعديل حدث موجود
  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: parseISO(event.date), // تحويل التاريخ من نص إلى كائن Date
      time: event.time,
      duration: event.duration,
      type: event.type,
      location: event.location,
      attendees: event.attendees.join(", "),
      description: event.description
    });
    setIsDialogOpen(true);
  };

  // --- دالة لإرسال بيانات النموذج (تم تعديلها) ---
  const handleSubmit = async () => { // تحويل الدالة إلى غير متزامنة (async)
    // التحقق من أن حقل العنوان ليس فارغًا
    if (!formData.title.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال عنوان الحدث", variant: "destructive" });
      return;
    }

    // تجهيز البيانات التي سيتم إرسالها إلى الخادم
    const eventPayload = {
      title: formData.title,
      date: format(formData.date, "yyyy-MM-dd"), // تنسيق التاريخ بالشكل الذي يفهمه Laravel
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      location: formData.location,
      attendees: formData.attendees.split(",").map(a => a.trim()).filter(a => a), // تحويل النص إلى مصفوفة
      description: formData.description
    };

    // --- منطق التعديل (سيتم تنفيذه في المستقبل) ---
    if (editingEvent) {
      // TODO: إضافة منطق التحديث هنا (يحتاج إلى مسار PUT في Laravel)
      toast({ title: "ملاحظة", description: "التعديل غير مدعوم حاليًا" });
      return;
    } 
    
    // --- منطق الإضافة (إرسال البيانات إلى الخادم) ---
    try {
      // إرسال طلب POST إلى واجهة Laravel الخلفية
      const response = await fetch('http://127.0.0.1:8000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // تحديد نوع المحتوى
          'Accept': 'application/json', // تحديد نوع الاستجابة المتوقعة
        },
        body: JSON.stringify(eventPayload ), // تحويل كائن JavaScript إلى نص JSON
      });

      // إذا لم يكن الطلب ناجحًا، قم برمي خطأ
      if (!response.ok) {
        throw new Error('فشل في إنشاء الحدث في الخادم');
      }

      // تحويل الاستجابة (الحدث الجديد الذي تم إنشاؤه) إلى JSON
      const newEvent: Event = await response.json();
      
      // إضافة الحدث الجديد إلى الحالة المحلية لعرضه فورًا في الواجهة دون الحاجة لإعادة تحميل
      setEvents(prevEvents => [...prevEvents, newEvent]);

      // عرض إشعار نجاح وإغلاق النافذة وإعادة تعيين النموذج
      toast({ title: "تم الإضافة", description: "تم إضافة الحدث بنجاح" });
      setIsDialogOpen(false);
      resetForm();

    } catch (error) {
      // في حالة حدوث أي خطأ، قم بطباعته في الكونسول وعرض إشعار للمستخدم
      console.error("خطأ في حفظ البيانات:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الحدث في الخادم", variant: "destructive" });
    }
  };

  // --- دالة الحذف (تحتاج إلى تعديل لتعمل مع الـ API) ---
  const handleDelete = (eventId: number) => {
    // TODO: إضافة منطق الحذف هنا (يحتاج إلى مسار DELETE في Laravel)
    toast({ title: "ملاحظة", description: "الحذف غير مدعوم حاليًا" });
  };

  // --- دالة فلترة الأحسب حسب التاريخ (تبقى كما هي) ---
  const getEventsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dateString);
  };

  // --- إرجاع كل الحالات والدوال ليتم استخدامها في المكون الرئيسي ---
  return {
    events, selectedDate, setSelectedDate, currentMonth, setCurrentMonth, isDialogOpen, setIsDialogOpen,
    editingEvent, formData, setFormData, resetForm, openAddDialog, openEditDialog, handleSubmit, handleDelete, getEventsForDate
  };
};
