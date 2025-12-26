<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // المشاريع التي يديرها
    public function managedProjects() {
        return $this->hasMany(Project::class, 'manager_id');
    }

    // المشاريع التي يشارك فيها
    public function projects() {
        return $this->belongsToMany(Project::class, 'project_users')
                    ->withPivot('role_in_project', 'joined_at')
                    ->withTimestamps();
    }

    // المهام المكلفة له
    public function tasks() {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // الملفات التي رفعها المستخدم
    public function uploadedFiles() {
       return $this->hasMany(ProjectFile::class, 'uploaded_by');
    }

    // عضويته في الفرق
    public function teamMember() {
        return $this->hasOne(TeamMember::class);
    }

    public function teams() {
        return $this->belongsToMany(Team::class, 'team_members')
                    ->withPivot('role_in_team', 'status')
                    ->withTimestamps();
    }

    // الملف الشخصي
    public function profile() {
        return $this->hasOne(Profile::class);
    }

    // سجل النشاطات
    public function activityLogs() {
        return $this->hasMany(ActivityLog::class);
    }

    // المحادثات
    public function conversations() {
        return $this->belongsToMany(Conversation::class);
    }
}
