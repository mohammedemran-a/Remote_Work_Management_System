// src/pages/Calendar/useCalendarState.ts
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

const initialEvents: Event[] = [
    { id: 1, title: "اجتماع فريق التطوير", date: "2024-01-12", time: "10:00", duration: "1 ساعة", type: "meeting", location: "قاعة الاجتماعات الرئيسية", attendees: ["أحمد محمد", "فاطمة علي", "محمد خالد"], description: "مراجعة التقدم الأسبوعي ومناقشة المهام القادمة" },
    { id: 2, title: "موعد تسليم المشروع", date: "2024-01-15", time: "23:59", duration: "", type: "deadline", location: "", attendees: [], description: "الموعد النهائي لتسليم مشروع تطوير الموقع" },
    { id: 3, title: "عرض تقديمي للعميل", date: "2024-01-18", time: "14:00", duration: "2 ساعة", type: "presentation", location: "قاعة العروض", attendees: ["سارة أحمد", "عمر حسن"], description: "عرض النموذج الأولي للتطبيق" },
    { id: 4, title: "ورشة عمل التصميم", date: "2024-01-12", time: "16:00", duration: "3 ساعات", type: "workshop", location: "استوديو التصميم", attendees: ["فاطمة علي", "ليلى محمود"], description: "ورشة عمل حول أحدث اتجاهات التصميم" },
    { id: 5, title: "مراجعة الكود الأسبوعية", date: "2024-01-19", time: "11:00", duration: "2 ساعة", type: "review", location: "مكتب التطوير", attendees: ["أحمد محمد", "محمد خالد", "عمر حسن"], description: "مراجعة جودة الكود والتحسينات المطلوبة" }
];

export const useCalendarState = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "", date: new Date(), time: "", duration: "", type: "meeting", location: "", attendees: "", description: ""
  });

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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال عنوان الحدث", variant: "destructive" });
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
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
      setEvents(events.map(e => e.id === editingEvent.id ? eventData : e));
      toast({ title: "تم التحديث", description: "تم تحديث الحدث بنجاح" });
    } else {
      setEvents([...events, eventData]);
      toast({ title: "تم الإضافة", description: "تم إضافة الحدث بنجاح" });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({ title: "تم الحذف", description: "تم حذف الحدث بنجاح" });
  };

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dateString);
  };

  return {
    events, selectedDate, setSelectedDate, currentMonth, setCurrentMonth, isDialogOpen, setIsDialogOpen,
    editingEvent, formData, setFormData, resetForm, openAddDialog, openEditDialog, handleSubmit, handleDelete, getEventsForDate
  };
};
