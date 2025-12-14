<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProjectUpdatedNotification extends Notification
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
            'title' => 'تحديث مشروع',
            'message' => 'تم تحديث معلومات المشروع: ' . $this->project->name,
            'project_id' => $this->project->id,
            'status' => $this->project->status,
        ];
    }
}
