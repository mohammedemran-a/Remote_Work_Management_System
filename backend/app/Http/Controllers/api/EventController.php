<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    // جلب كل الأحداث
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // تخزين حدث جديد
    public function store(Request $request)
    {
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

        $event = Event::create($validatedData);

        return response()->json($event, 201);
    }

    // جلب حدث محدد
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event);
    }

    // تحديث حدث
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'time' => 'nullable|string',
            'duration' => 'nullable|string',
            'type' => 'sometimes|required|string',
            'location' => 'nullable|string',
            'attendees' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $event->update($validatedData);

        return response()->json($event);
    }

    // حذف حدث
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
