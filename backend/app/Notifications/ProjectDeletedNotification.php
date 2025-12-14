<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProjectDeletedNotification extends Notification
{
    use Queueable;

    public $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'حذف مشروع',
            'message' => 'تم حذف المشروع: ' . $this->project->name,
            'project_id' => $this->project->id,
        ];
    }
}
