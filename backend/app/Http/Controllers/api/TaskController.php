<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Notifications\TaskNotification;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // عرض كل المهام
    public function index()
    {
        // ✅ جلب العلاقات اللازمة للعرض
        return Task::with(['project', 'assignee'])->latest()->get();
    }

    // إنشاء مهمة جديدة + إشعار
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string',
            'description' => 'nullable|string',
            'priority'    => 'required|in:عالية,متوسطة,منخفضة',
            'assigned_to' => 'required|exists:users,id',
            'project_id'  => 'required|exists:projects,id',
            'due_date'    => 'nullable|date',
        ]);

        // ✅ الحالة الافتراضية دائمًا "جديدة" عند الإنشاء
        $data = $request->all();
        $data['status'] = 'جديدة';

        $task = Task::create($data);

        // إرسال الإشعار للمكلّف بالمهمة
        $task->assignee->notify(new TaskNotification($task, 'created'));

        return response()->json([
            'message' => 'تم إنشاء المهمة بنجاح',
            'task'    => $task->load('assignee', 'project') // إرجاع المهمة مع العلاقات
        ], 201);
    }

    // عرض مهمة واحدة
    public function show($id)
    {
        return Task::with(['project', 'assignee'])->findOrFail($id);
    }

    // تحديث مهمة + إشعار
   // في ملف app/Http/Controllers/Api/TaskController.php

// ...

// تحديث مهمة + إشعار
public function update(Request $request, $id)
{
    $task = Task::findOrFail($id);

    $request->validate([
        'title'       => 'sometimes|string',
        'description' => 'nullable|string',
        'priority'    => 'sometimes|in:عالية,متوسطة,منخفضة',
        'assigned_to' => 'sometimes|exists:users,id',
        'project_id'  => 'sometimes|exists:projects,id',
        'due_date'    => 'nullable|date',
        'status'      => 'sometimes|in:جديدة,قيد التنفيذ,قيد المراجعة,مكتملة', // السماح بتحديث الحالة
    ]);

    // ✅✅✅====== هذا هو الإصلاح الحاسم ======✅✅✅
    // استبدل ->except('status') بـ ->all() للسماح بتحديث الحالة
    $data = $request->all(); 
    $task->update($data);

    // إرسال إشعار التحديث
    if ($task->assignee) {
        $task->assignee->notify(new TaskNotification($task, 'updated'));
    }

    return response()->json([
        'message' => 'تم تحديث المهمة بنجاح',
        'task'    => $task->load('assignee', 'project')
    ]);
}

// ...


    // حذف مهمة + إشعار
    public function destroy($id)
    {
        $task = Task::with('assignee')->findOrFail($id);

        // إرسال إشعار الحذف قبل الحذف الفعلي
        $task->assignee->notify(new TaskNotification($task, 'deleted'));

        $task->delete();

        return response()->json(['message' => 'تم حذف المهمة بنجاح']);
    }

    // ✅✅✅====== الدوال الجديدة والمُعدّلة تبدأ من هنا ======✅✅✅

    /**
     * إرسال المهمة للمراجعة من قبل العضو
     * POST: /api/tasks/{id}/submit-review
     */
    public function submitForReview(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if (auth()->id() != $task->assigned_to) {
            return response()->json(['message' => 'ليس لديك صلاحية لتنفيذ هذا الإجراء'], 403);
        }

        $task->status = 'قيد المراجعة';
        $task->review_notes = null;
        $task->save();

        // إشعار مدير المشروع بأن هناك مهمة جاهزة للمراجعة
        $projectManager = $task->project->manager;
        if ($projectManager) {
            // افترض أن TaskNotification يمكنها التعامل مع نوع 'submitted_for_review'
            $projectManager->notify(new TaskNotification($task, 'submitted_for_review'));
        }

        return response()->json(['message' => 'تم إرسال المهمة للمراجعة بنجاح', 'task' => $task->load('assignee', 'project')]);
    }

    /**
     * مراجعة المهمة من قبل المشرف (قبول أو رفض)
     * POST: /api/tasks/{id}/review
     */
    // في ملف app/Http/Controllers/Api/TaskController.php

/**
 * مراجعة المهمة من قبل المشرف (قبول أو رفض)
 * POST: /api/tasks/{id}/review
 */
public function reviewTask(Request $request, $id)
{
    $request->validate([
        'action' => 'required|in:approve,reject',
        'notes'  => 'nullable|string|required_if:action,reject',
    ]);

    $task = Task::findOrFail($id);
    $project = $task->project;

    if (auth()->id() != $project->manager_id) {
        return response()->json(['message' => 'ليس لديك صلاحية لمراجعة هذه المهمة'], 403);
    }

    if ($request->action === 'approve') {
        $task->status = 'مكتملة';
        $task->review_notes = null;
        
        // ✅✅✅====== هذا هو الإصلاح الحاسم ======✅✅✅
        // قم بحفظ التغييرات أولاً، ثم أرسل الإشعار فقط إذا كان هناك assignee
        $task->save(); 
        
        if ($task->assignee) {
            $task->assignee->notify(new TaskNotification($task, 'approved'));
        }

    } else { // 'reject'
        $task->status = 'قيد التنفيذ';
        $task->review_notes = $request->notes;

        // ✅ الأفضل أن نطبق نفس المنطق هنا أيضًا للأمان
        $task->save();

        if ($task->assignee) {
            $task->assignee->notify(new TaskNotification($task, 'rejected'));
        }
    }

    // لقد قمنا بنقل save() إلى داخل كل كتلة، لذا يمكن إزالة هذا السطر أو تركه
    // $task->save(); 

    return response()->json(['message' => 'تمت مراجعة المهمة بنجاح', 'task' => $task->load('assignee', 'project')]);
}

    
}
