<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TeamNotification extends Notification
{
    use Queueable;

    public $member;
    public $type;

    /**
     * type = created | updated | status_changed | deleted
     */
    public function __construct($member, $type)
    {
        $this->member = $member;
        $this->type   = $type;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'     => $this->getTitle(),
            'message'   => $this->getMessage(),
            'member_id' => $this->member->id,
            'user_id'   => $this->member->user_id,
            'user_name' => $this->member->user->name,
            'status'    => $this->member->status,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('👥 إشعار فريق')
            ->greeting('مرحباً ' . $notifiable->name . ' 👋')
            ->line($this->getMessage())
            ->line('**العضو:** ' . $this->member->user->name)
            ->line('**الحالة:** ' . $this->member->status)
            ->action('عرض العضو', url('/team-members/' . $this->member->id))
            ->salutation('مع التحية، فريق النظام');
    }

    private function getTitle()
    {
        return match ($this->type) {
            'created'        => 'إضافة عضو للفريق',
            'updated'        => 'تحديث بيانات عضو',
            'status_changed' => 'تغيير حالة عضو',
            'deleted'        => 'حذف عضو من الفريق',
            default          => 'إشعار فريق',
        };
    }

    private function getMessage()
    {
        return match ($this->type) {
            'created'        => 'تم إضافة عضو جديد إلى الفريق',
            'updated'        => 'تم تحديث بيانات عضو الفريق',
            'status_changed' => 'تم تغيير حالة عضو الفريق',
            'deleted'        => 'تم حذف عضو من الفريق',
            default          => 'تحديث على عضو فريق',
        };
    }
}
