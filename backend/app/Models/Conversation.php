<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
   // in app/Models/Conversation.php
protected $fillable = ['name', 'project_id'];

public function project() {
    return $this->belongsTo(Project::class);
}
public function messages() {
    return $this->hasMany(Message::class)->latest(); // جلب أحدث الرسائل أولاً
}
public function users() {
    return $this->belongsToMany(User::class);
}
public function latestMessage() {
    return $this->hasOne(Message::class)->latestOfMany();
}
 //
}
