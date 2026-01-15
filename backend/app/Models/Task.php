<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'project_id',
        'due_date',
        'review_notes' // ✅✅✅====== الإصلاح هنا: أضفنا الحقل الجديد ======✅✅✅
    ];

    /**
     * Get the project that the task belongs to.
     */
    public function project() {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user that the task is assigned to.
     */
    public function assignee() {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
