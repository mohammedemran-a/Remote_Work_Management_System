<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'description',
        'leader_id',
    ];

    // قائد الفريق
    public function leader() {
        return $this->belongsTo(User::class, 'leader_id');
    }

    // أعضاء الفريق
    public function members() {
        return $this->belongsToMany(User::class, 'team_members')
                    ->withPivot('role_in_team', 'status')
                    ->withTimestamps();
    }

    // المشاريع التي ينتمي لها الفريق
    public function projects() {
        return $this->belongsToMany(Project::class, 'project_team')->withTimestamps();
    }
}
