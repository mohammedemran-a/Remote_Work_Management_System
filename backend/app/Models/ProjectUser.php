<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    protected $table = 'project_users';

    protected $fillable = [
        'project_id',
        'user_id',
        'role_in_project',
        'joined_at'
    ];
 
}
