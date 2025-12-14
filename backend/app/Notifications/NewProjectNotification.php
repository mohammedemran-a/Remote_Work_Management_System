<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewProjectNotification extends Notification
{
    use Queueable;

    public $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function via($notifiable)
    {
        return ['database', 'mail']; // نرسل إلى البريد + قاعدة البيانات
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'مشروع جديد',
            'message' => 'تم إنشاء مشروع جديد باسم: ' . $this->project->name,
            'project_id' => $this->project->id,
            'status' => $this->project->status,
            'manager_name' => $this->project->manager->name,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('✨ تم إنشاء مشروع جديد: ' . $this->project->name)
            ->greeting('مرحباً ' . $notifiable->name . ' 👋')
            ->line('لقد تم إضافة مشروع جديد إلى النظام.')
            ->line('**اسم المشروع:** ' . $this->project->name)
            ->line('**الحالة:** ' . $this->project->status)
            ->line('**مدير المشروع:** ' . $this->project->manager->name)
            ->action('عرض المشروع', url('/projects/' . $this->project->id))
            ->line('يرجى متابعة المشروع واتخاذ الإجراءات اللازمة.')
            ->salutation('مع التحية، فريق النظام');
    }
}
