<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TaskNotification extends Notification
{
    use Queueable;

    public $task;
    public $type;

    /**
     * type = created | updated | status_changed | deleted
     */
    public function __construct($task, $type)
    {
        $this->task = $task;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

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

    private function getTitle()
    {
        return match ($this->type) {
            'created'        => 'مهمة جديدة',
            'updated'        => 'تحديث مهمة',
            'status_changed' => 'تغيير حالة مهمة',
            'deleted'        => 'حذف مهمة',
            default          => 'إشعار مهمة',
        };
    }

    private function getMessage()
    {
        return match ($this->type) {
            'created'        => 'تم إنشاء مهمة جديدة',
            'updated'        => 'تم تحديث بيانات المهمة',
            'status_changed' => 'تم تغيير حالة المهمة',
            'deleted'        => 'تم حذف المهمة',
            default          => 'تحديث على مهمة',
        };
    }
}
