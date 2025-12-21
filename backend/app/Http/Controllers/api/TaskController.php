<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskNotification;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // عرض كل المهام
    public function index()
    {
        return Task::with(['project', 'assignee'])->latest()->get();
    }

    // إنشاء مهمة جديدة + إشعار
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string',
            'description' => 'nullable|string',
            'status'      => 'required|in:جديدة,قيد التنفيذ,مكتملة,متأخرة',
            'priority'    => 'required|in:عالية,متوسطة,منخفضة',
            'assigned_to' => 'required|exists:users,id',
            'project_id'  => 'required|exists:projects,id',
            'due_date'    => 'nullable|date',
        ]);

        $task = Task::create($request->all());

        // إرسال الإشعار للمكلّف بالمهمة
        $task->assignee->notify(new TaskNotification($task, 'created'));

        return response()->json([
            'message' => 'تم إنشاء المهمة بنجاح',
            'task'    => $task
        ], 201);
    }

    // عرض مهمة واحدة
    public function show($id)
    {
        return Task::with(['project', 'assignee'])->findOrFail($id);
    }

    // تحديث مهمة + إشعار
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $oldStatus = $task->status;

        $request->validate([
            'title'       => 'sometimes|string',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:جديدة,قيد التنفيذ,مكتملة,متأخرة',
            'priority'    => 'sometimes|in:عالية,متوسطة,منخفضة',
            'assigned_to' => 'sometimes|exists:users,id',
            'project_id'  => 'sometimes|exists:projects,id',
            'due_date'    => 'nullable|date',
        ]);

        $task->update($request->all());

        // تحديد نوع الإشعار
        $type = ($request->has('status') && $oldStatus !== $task->status)
            ? 'status_changed'
            : 'updated';

        $task->assignee->notify(new TaskNotification($task, $type));

        return response()->json([
            'message' => 'تم تحديث المهمة بنجاح',
            'task'    => $task
        ]);
    }

    // حذف مهمة + إشعار
    public function destroy($id)
    {
        $task = Task::with('assignee')->findOrFail($id);

        $task->assignee->notify(new TaskNotification($task, 'deleted'));

        $task->delete();

        return response()->json([
            'message' => 'تم حذف المهمة بنجاح'
        ]);
    }
}
