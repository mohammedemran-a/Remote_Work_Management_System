<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //
      protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'project_id',
        'due_date'
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function assignee() {
        return $this->belongsTo(User::class, 'assigned_to');
    }

}
