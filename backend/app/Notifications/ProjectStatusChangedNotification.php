<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProjectStatusChangedNotification extends Notification
{
    use Queueable;

    public $project;
    public $oldStatus;
    public $newStatus;

    public function __construct($project, $oldStatus, $newStatus)
    {
        $this->project = $project;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'تغيير حالة مشروع',
            'message' => "تم تغيير حالة المشروع {$this->project->name} من {$this->oldStatus} إلى {$this->newStatus}",
            'project_id' => $this->project->id,
            'status' => $this->newStatus,
        ];
    }
}
