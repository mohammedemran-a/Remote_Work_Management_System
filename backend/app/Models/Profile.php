<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{

    protected $fillable = [
        'user_id',
        'avatar',
        'job_title',
        'status',
        'joined_at',
    ];

    // علاقة البروفايل مع المستخدم (belongsTo)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
