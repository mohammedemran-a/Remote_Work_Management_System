<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'manager_id'
    ];

    // المدير المسؤول عن المشروع
    public function manager() {
        return $this->belongsTo(User::class, 'manager_id');
    }

    // المهام التابعة للمشروع
    public function tasks() {
        return $this->hasMany(Task::class);
    }

    // المستخدمين المشاركين بالمشروع
    public function users() {
        return $this->belongsToMany(User::class, 'project_users')
                    ->withPivot('role_in_project', 'joined_at')
                    ->withTimestamps();
    }

    // الملفات التابعة للمشروع
    public function files() {
        return $this->hasMany(ProjectFile::class);
    }

    // الفرق التابعة للمشروع
    public function teams() {
        return $this->belongsToMany(Team::class, 'project_team')->withTimestamps();
    }
}
