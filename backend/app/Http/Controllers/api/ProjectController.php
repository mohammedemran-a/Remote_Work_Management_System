<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\User;
use App\Notifications\NewProjectNotification;
use App\Notifications\ProjectUpdatedNotification;
use App\Notifications\ProjectStatusChangedNotification;
use App\Notifications\ProjectDeletedNotification;

class ProjectController extends Controller
{
    // عرض كل المشاريع
    public function index()
    {
        $projects = Project::with(['manager', 'tasks', 'users'])->latest()->get();
        return response()->json($projects);
    }

    // إنشاء مشروع جديد
    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string',
            'description'   => 'required|string',
            'status'        => 'required|in:نشط,مكتمل,مؤجل,مؤرشف',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'manager_id'    => 'required|exists:users,id',
        ]);

        $project = Project::create($request->all());

        $manager = User::find($request->manager_id);
        $manager->notify(new NewProjectNotification($project));

        return response()->json([
            'message' => 'تم إنشاء المشروع بنجاح',
            'project' => $project
        ], 201);
    }

    // عرض مشروع محدد
    public function show($id)
    {
        $project = Project::with(['manager', 'tasks', 'users'])->findOrFail($id);
        return response()->json($project);
    }

    // تحديث مشروع
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $oldStatus = $project->status;

        $request->validate([
            'name'          => 'sometimes|string',
            'description'   => 'sometimes|string',
            'status'        => 'sometimes|in:نشط,مكتمل,مؤجل,مؤرشف',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'manager_id'    => 'sometimes|exists:users,id',
        ]);

        $project->update($request->all());

        $manager = User::find($project->manager_id);

        $manager->notify(new ProjectUpdatedNotification($project));

        if ($request->has('status') && $oldStatus !== $project->status) {
            $manager->notify(new ProjectStatusChangedNotification($project, $oldStatus, $project->status));
        }

        return response()->json([
            'message' => 'تم تحديث المشروع بنجاح',
            'project' => $project
        ]);
    }

    // حذف مشروع
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        $manager = User::find($project->manager_id);
        $manager->notify(new ProjectDeletedNotification($project));

        $project->delete();

        return response()->json([
            'message' => 'تم حذف المشروع بنجاح'
        ]);
    }
}
