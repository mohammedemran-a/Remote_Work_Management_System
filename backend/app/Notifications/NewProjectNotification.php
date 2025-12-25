<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // <-- الخطوة 1: استيراد الـ interface
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Project; // من الأفضل تحديد الموديل المستخدم

class NewProjectNotification extends Notification implements ShouldQueue // <-- الخطوة 2: تطبيق الـ interface
{
    use Queueable;

    public Project $project;

    /**
     * Create a new notification instance.
     *
     * @param Project $project
     */
    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail']; // نرسل إلى البريد + قاعدة البيانات
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
            'title' => 'مشروع جديد',
            'message' => 'تم إنشاء مشروع جديد باسم: ' . $this->project->name,
            'project_id' => $this->project->id,
            'status' => $this->project->status,
            'manager_name' => $this->project->manager->name,
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
