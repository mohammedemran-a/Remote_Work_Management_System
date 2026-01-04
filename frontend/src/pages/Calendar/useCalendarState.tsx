// src/pages/Calendar/useCalendarState.ts

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  EventPayload
} from "@/api/events";

export interface Event {
  id: number;
  title: string;
  date: string;      // yyyy-MM-dd
  time: string;
  duration: string;
  type: string;
  location: string;
  attendees: string[];
  description: string;
}

export const useCalendarState = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    time: "",
    duration: "",
    type: "meeting",
    location: "",
    attendees: "",
    description: ""
  });

  // --------------------
  // جلب الأحداث من الخادم
  // --------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        toast({
          title: "خطأ",
          description: "فشل في جلب الأحداث من الخادم",
          variant: "destructive"
        });
      }
    };
    fetchEvents();
  }, [toast]);

  // --------------------
  // إعادة تعيين النموذج
  // --------------------
  const resetForm = () => {
    setFormData({
      title: "",
      date: new Date(),
      time: "",
      duration: "",
      type: "meeting",
      location: "",
      attendees: "",
      description: ""
    });
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

  // --------------------
  // حفظ/إنشاء أو تعديل حدث
  // --------------------
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان الحدث",
        variant: "destructive"
      });
      return;
    }

    const fixedDate = new Date(formData.date);
    fixedDate.setHours(12, 0, 0, 0);

    const eventPayload: EventPayload = {
      title: formData.title,
      date: format(fixedDate, "yyyy-MM-dd"),
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      location: formData.location,
      attendees: formData.attendees
        .split(",")
        .map(a => a.trim())
        .filter(a => a),
      description: formData.description
    };

    try {
      if (editingEvent) {
        // --------------------
        // تعديل الحدث
        // --------------------
        const response = await updateEvent(editingEvent.id, eventPayload);
        setEvents(prev =>
          prev.map(ev => (ev.id === editingEvent.id ? response : ev))
        );
        toast({ title: "تم التعديل", description: "تم تعديل الحدث بنجاح" });
      } else {
        // --------------------
        // إنشاء حدث جديد
        // --------------------
        const response = await createEvent(eventPayload);
        setEvents(prev => [...prev, response]);
        toast({ title: "تم الإضافة", description: "تم إضافة الحدث بنجاح" });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الحدث في الخادم",
        variant: "destructive"
      });
    }
  };

  // --------------------
  // حذف حدث
  // --------------------
  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(ev => ev.id !== eventId));
      toast({ title: "تم الحذف", description: "تم حذف الحدث بنجاح" });
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الحدث",
        variant: "destructive"
      });
    }
  };

  // --------------------
  // فلترة الأحداث حسب التاريخ
  // --------------------
  const getEventsForDate = (date: Date): Event[] => {
    if (!Array.isArray(events)) return [];
    const fixed = new Date(date);
    fixed.setHours(12, 0, 0, 0);
    const dateString = format(fixed, "yyyy-MM-dd");
    return events.filter(event => event.date === dateString);
  };

  return {
    events,
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    isDialogOpen,
    setIsDialogOpen,
    editingEvent,
    formData,
    setFormData,
    resetForm,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    handleDelete,
    getEventsForDate
  };
};
