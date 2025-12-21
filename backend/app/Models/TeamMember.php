<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;
        protected $fillable = [
        'user_id',
        'phone',
        'location',
        'join_date',
        'status',
        'tasks_completed',
        'tasks_in_progress',
        'efficiency',
        'last_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
