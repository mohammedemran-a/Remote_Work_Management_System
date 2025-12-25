<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // <-- الخطوة 1: استيراد الـ interface
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Task; // من الأفضل تحديد الموديل المستخدم

class TaskNotification extends Notification implements ShouldQueue // <-- الخطوة 2: تطبيق الـ interface
{
    use Queueable;

    public Task $task;
    public string $type;

    /**
     * Create a new notification instance.
     *
     * @param Task $task
     * @param string $type 'created' | 'updated' | 'status_changed' | 'deleted'
     */
    public function __construct(Task $task, string $type)
    {
        $this->task = $task;
        $this->type = $type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'title'       => $this->getTitle(),
            'message'     => $this->getMessage(),
            'task_id'     => $this->task->id,
            'task_title'  => $this->task->title,
            'status'      => $this->task->status,
            'priority'    => $this->task->priority,
            'project_id'  => $this->task->project_id,
        ];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('🔔 إشعار مهمة: ' . $this->task->title)
            ->greeting('مرحباً ' . $notifiable->name . ' 👋')
            ->line($this->getMessage())
            ->line('**المهمة:** ' . $this->task->title)
            ->line('**الحالة:** ' . $this->task->status)
            ->line('**الأولوية:** ' . $this->task->priority)
            ->action('عرض المهمة', url('/tasks/' . $this->task->id))
            ->salutation('مع التحية، فريق النظام');
    }

    /**
     * Get the title for the notification.
     *
     * @return string
     */
    private function getTitle(): string
    {
        return match ($this->type) {
            'created'        => 'مهمة جديدة',
            'updated'        => 'تحديث مهمة',
            'status_changed' => 'تغيير حالة مهمة',
            'deleted'        => 'حذف مهمة',
            default          => 'إشعار مهمة',
        };
    }

    /**
     * Get the message for the notification.
     *
     * @return string
     */
    private function getMessage(): string
    {
        return match ($this->type) {
            'created'        => 'تم إنشاء مهمة جديدة لك: ' . $this->task->title,
            'updated'        => 'تم تحديث بيانات المهمة: ' . $this->task->title,
            'status_changed' => 'تم تغيير حالة المهمة "' . $this->task->title . '" إلى: ' . $this->task->status,
            'deleted'        => 'تم حذف المهمة: ' . $this->task->title,
            default          => 'تحديث على مهمة: ' . $this->task->title,
        };
    }
}
