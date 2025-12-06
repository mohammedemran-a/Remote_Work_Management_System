// index.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCalendarState } from "./useCalendarState";
import EventDialog from "./EventDialog";
import CalendarUI from "./CalendarUI";

const Calendar = () => {
  const {
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
  } = useCalendarState();

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

      <CalendarUI
        events={events}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        openEditDialog={openEditDialog}
        handleDelete={handleDelete}
        getEventsForDate={getEventsForDate}
      />

      <EventDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEvent={editingEvent}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Calendar;
