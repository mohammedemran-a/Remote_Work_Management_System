import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2
} from "lucide-react";
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Event {
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

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "اجتماع فريق التطوير",
      date: "2024-01-12",
      time: "10:00",
      duration: "1 ساعة",
      type: "meeting",
      location: "قاعة الاجتماعات الرئيسية",
      attendees: ["أحمد محمد", "فاطمة علي", "محمد خالد"],
      description: "مراجعة التقدم الأسبوعي ومناقشة المهام القادمة"
    },
    {
      id: 2,
      title: "موعد تسليم المشروع",
      date: "2024-01-15",
      time: "23:59",
      duration: "",
      type: "deadline",
      location: "",
      attendees: [],
      description: "الموعد النهائي لتسليم مشروع تطوير الموقع"
    },
    {
      id: 3,
      title: "عرض تقديمي للعميل",
      date: "2024-01-18",
      time: "14:00",
      duration: "2 ساعة",
      type: "presentation",
      location: "قاعة العروض",
      attendees: ["سارة أحمد", "عمر حسن"],
      description: "عرض النموذج الأولي للتطبيق"
    },
    {
      id: 4,
      title: "ورشة عمل التصميم",
      date: "2024-01-12",
      time: "16:00",
      duration: "3 ساعات",
      type: "workshop",
      location: "استوديو التصميم",
      attendees: ["فاطمة علي", "ليلى محمود"],
      description: "ورشة عمل حول أحدث اتجاهات التصميم"
    },
    {
      id: 5,
      title: "مراجعة الكود الأسبوعية",
      date: "2024-01-19",
      time: "11:00",
      duration: "2 ساعة",
      type: "review",
      location: "مكتب التطوير",
      attendees: ["أحمد محمد", "محمد خالد", "عمر حسن"],
      description: "مراجعة جودة الكود والتحسينات المطلوبة"
    }
  ]);

  // Form state
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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان الحدث",
        variant: "destructive"
      });
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
      toast({
        title: "تم التحديث",
        description: "تم تحديث الحدث بنجاح"
      });
    } else {
      setEvents([...events, eventData]);
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الحدث بنجاح"
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({
      title: "تم الحذف",
      description: "تم حذف الحدث بنجاح"
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "presentation":
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "meeting":
        return "اجتماع";
      case "deadline":
        return "موعد نهائي";
      case "presentation":
        return "عرض تقديمي";
      case "workshop":
        return "ورشة عمل";
      case "review":
        return "مراجعة";
      default:
        return "حدث";
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dateString);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">التقويم</h1>
          <p className="text-lg text-muted-foreground">عرض المواعيد والأحداث المهمة</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          حدث جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(currentMonth, "MMMM yyyy", { locale: ar })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))"
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events for Selected Date */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                أحداث {format(selectedDate, "d MMMM yyyy", { locale: ar })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time} {event.duration && `(${event.duration})`}</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.attendees.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees.length} مشارك</span>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-3">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد أحداث</h3>
                  <p className="mt-2 text-muted-foreground">لا توجد أحداث محددة لهذا اليوم</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">إجمالي الأحداث</span>
                  <Badge variant="secondary">{events.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الاجتماعات</span>
                  <Badge variant="secondary">
                    {events.filter(e => e.type === "meeting").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المواعيد النهائية</span>
                  <Badge variant="secondary">
                    {events.filter(e => e.type === "deadline").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ورش العمل</span>
                  <Badge variant="secondary">
                    {events.filter(e => e.type === "workshop").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>الأحداث القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)} variant="outline">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(parseISO(event.date), "d MMMM", { locale: ar })}
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "تعديل الحدث" : "إضافة حدث جديد"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الحدث *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="أدخل عنوان الحدث"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>التاريخ *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP", { locale: ar }) : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">الوقت</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="مثال: ساعتان"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">نوع الحدث</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">اجتماع</SelectItem>
                    <SelectItem value="deadline">موعد نهائي</SelectItem>
                    <SelectItem value="presentation">عرض تقديمي</SelectItem>
                    <SelectItem value="workshop">ورشة عمل</SelectItem>
                    <SelectItem value="review">مراجعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="أدخل موقع الحدث"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">المشاركون</Label>
              <Input
                id="attendees"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                placeholder="أدخل أسماء المشاركين مفصولة بفاصلة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="أدخل وصف الحدث"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingEvent ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;