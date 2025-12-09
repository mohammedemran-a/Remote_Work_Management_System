<?php
// in database/migrations/...._create_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('date'); // مهم جدًا أن يكون النوع date
            $table->string('time')->nullable();
            $table->string('duration')->nullable();
            $table->string('type');
            $table->string('location')->nullable();
            $table->json('attendees')->nullable(); // استخدام JSON لتخزين مصفوفة المشاركين
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
