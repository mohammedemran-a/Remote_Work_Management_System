<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    // in app/Models/Message.php
protected $fillable = ['conversation_id', 'user_id', 'content', 'type', 'file_url', 'file_name'];

public function conversation() {
    return $this->belongsTo(Conversation::class);
}
public function user() {
    return $this->belongsTo(User::class);
}

}
