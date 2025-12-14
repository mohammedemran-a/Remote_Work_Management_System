<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller; // ← تصحيح الاستدعاء
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    // دالة لجلب كل الأحداث
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // دالة لتخزين حدث جديد
    public function store(Request $request)
    {
        // التحقق من صحة البيانات القادمة من الواجهة الأمامية
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'duration' => 'nullable|string',
            'type' => 'required|string',
            'location' => 'nullable|string',
            'attendees' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        // إنشاء الحدث الجديد في قاعدة البيانات
        $event = Event::create($validatedData);

        // إرجاع الحدث الجديد مع رمز 201 (Created)
        return response()->json($event, 201);
    }
}
