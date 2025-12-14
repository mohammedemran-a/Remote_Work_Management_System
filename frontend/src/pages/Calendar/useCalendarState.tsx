// src/pages/Calendar/useCalendarState.ts

// --- استيراد المكتبات اللازمة ---
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// --- استيراد دوال الـ API الجديدة ---
import { getEvents, createEvent, EventPayload } from "@/api/events";

// --- واجهة (Interface) لتحديد شكل بيانات الحدث ---
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
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "", date: new Date(), time: "", duration: "", type: "meeting", location: "", attendees: "", description: ""
  });

  // --- دالة لجلب البيانات ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response.data);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        toast({ title: "خطأ", description: "فشل في جلب الأحداث من الخادم", variant: "destructive" });
      }
    };
    fetchEvents();
  }, [toast]);

  // --- دوال مساعدة ---
  const resetForm = () => {
    setFormData({ title: "", date: new Date(), time: "", duration: "", type: "meeting", location: "", attendees: "", description: "" });
    setEditingEvent(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: parseISO(event.date),
      time: event.time,
      duration: event.duration,
      type: event.type,
      location: event.location,
      attendees: event.attendees.join(", "),
      description: event.description
    });
    setIsDialogOpen(true);
  };

  // --- دالة لإرسال بيانات النموذج ---
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال عنوان الحدث", variant: "destructive" });
      return;
    }

    const eventPayload: EventPayload = {
      title: formData.title,
      date: format(formData.date, "yyyy-MM-dd"),
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      location: formData.location,
      attendees: formData.attendees.split(",").map(a => a.trim()).filter(a => a),
      description: formData.description
    };

    if (editingEvent) {
      toast({ title: "ملاحظة", description: "التعديل غير مدعوم حاليًا" });
      return;
    } 
    
    try {
      const response = await createEvent(eventPayload);
      setEvents(prevEvents => [...prevEvents, response.data]);
      toast({ title: "تم الإضافة", description: "تم إضافة الحدث بنجاح" });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الحدث في الخادم", variant: "destructive" });
    }
  };

  // --- دالة الحذف ---
  const handleDelete = (eventId: number) => {
    toast({ title: "ملاحظة", description: "الحذف غير مدعوم حاليًا" });
  };

  // --- دالة فلترة الأحداث حسب التاريخ ---
  const getEventsForDate = (date: Date): Event[] => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dateString);
  };

  // --- إرجاع كل الحالات والدوال ---
  return {
    events, selectedDate, setSelectedDate, currentMonth, setCurrentMonth, isDialogOpen, setIsDialogOpen,
    editingEvent, formData, setFormData, resetForm, openAddDialog, openEditDialog, handleSubmit, handleDelete, getEventsForDate
  };
};
