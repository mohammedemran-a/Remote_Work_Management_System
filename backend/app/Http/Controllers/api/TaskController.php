<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // عرض كل المهام
    public function index()
    {
        $tasks = Task::with(['project', 'assignee'])->latest()->get();
        return response()->json($tasks);
    }

    // إنشاء مهمة جديدة
    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required|string',
            'description'   => 'nullable|string',
            'status'        => 'required|in:جديدة,قيد التنفيذ,مكتملة,متأخرة',
            'priority'      => 'required|in:عالية,متوسطة,منخفضة',
            'assigned_to'   => 'required|exists:users,id',
            'project_id'    => 'required|exists:projects,id',
            'due_date'      => 'nullable|date',
        ]);

        $task = Task::create($request->all());

        return response()->json([
            'message' => 'تم إنشاء المهمة بنجاح',
            'task'    => $task
        ], 201);
    }

    // عرض مهمة واحدة
    public function show($id)
    {
        $task = Task::with(['project', 'assignee'])->findOrFail($id);
        return response()->json($task);
    }

    // تحديث مهمة
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'title'         => 'sometimes|string',
            'description'   => 'nullable|string',
            'status'        => 'sometimes|in:جديدة,قيد التنفيذ,مكتملة,متأخرة',
            'priority'      => 'sometimes|in:عالية,متوسطة,منخفضة',
            'assigned_to'   => 'sometimes|exists:users,id',
            'project_id'    => 'sometimes|exists:projects,id',
            'due_date'      => 'nullable|date',
        ]);

        $task->update($request->all());

        return response()->json([
            'message' => 'تم تحديث المهمة بنجاح',
            'task'    => $task
        ]);
    }

    // حذف مهمة
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'تم حذف المهمة بنجاح'
        ]);
    }
}
