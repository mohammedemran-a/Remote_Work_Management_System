// src/pages/Calendar/CalendarUI.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { format, addMonths, subMonths, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Event } from "./useCalendarState";

interface CalendarUIProps {
  events: Event[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  openEditDialog: (event: Event) => void;
  handleDelete: (id: number) => void;
  getEventsForDate: (date: Date) => Event[];
}

const getEventTypeColor = (type: string) => {
  const colors: { [key: string]: string } = { meeting: "bg-blue-100 text-blue-800", deadline: "bg-red-100 text-red-800", presentation: "bg-purple-100 text-purple-800", workshop: "bg-green-100 text-green-800", review: "bg-orange-100 text-orange-800" };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getEventTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = { meeting: "اجتماع", deadline: "موعد نهائي", presentation: "عرض تقديمي", workshop: "ورشة عمل", review: "مراجعة" };
  return labels[type] || "حدث";
};

const CalendarUI = ({ events, selectedDate, setSelectedDate, currentMonth, setCurrentMonth, openEditDialog, handleDelete, getEventsForDate }: CalendarUIProps) => {
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5" />{format(currentMonth, "MMMM yyyy", { locale: ar })}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarComponent mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} month={currentMonth} onMonthChange={setCurrentMonth} className="w-full" modifiers={{ hasEvents: (date) => getEventsForDate(date).length > 0 }} modifiersStyles={{ hasEvents: { fontWeight: "bold", backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" } }} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">أحداث {format(selectedDate, "d MMMM yyyy", { locale: ar })}</CardTitle></CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>{getEventTypeLabel(event.type)}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                      <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                        {event.time && <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{event.time} {event.duration && `(${event.duration})`}</span></div>}
                        {event.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>}
                        {event.attendees.length > 0 && <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{event.attendees.length} مشارك</span></div>}
                      </div>
                      {event.description && <p className="text-sm text-muted-foreground mt-3">{event.description}</p>}
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
          <Card>
            <CardHeader><CardTitle className="text-lg">إحصائيات سريعة</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">إجمالي الأحداث</span><Badge variant="secondary">{events.length}</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">الاجتماعات</span><Badge variant="secondary">{events.filter(e => e.type === "meeting").length}</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">المواعيد النهائية</span><Badge variant="secondary">{events.filter(e => e.type === "deadline").length}</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">ورش العمل</span><Badge variant="secondary">{events.filter(e => e.type === "workshop").length}</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>الأحداث القادمة</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)} variant="outline">{getEventTypeLabel(event.type)}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{format(parseISO(event.date), "d MMMM", { locale: ar })}</div>
                    {event.time && <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CalendarUI;
