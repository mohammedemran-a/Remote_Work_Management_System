<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); // المستخدم الحالي (لو تستخدم Sanctum)

        /* =========================
           الإحصائيات العلوية
        ========================= */

        $stats = [
            [
                'title' => 'المشاريع النشطة',
                'value' => Project::where('status', 'نشط')->count(),
            ],
            [
                'title' => 'المهام المكتملة',
                'value' => Task::where('status', 'مكتملة')->count(),
            ],
            [
                'title' => 'المهام المتأخرة',
                'value' => Task::where('status', 'متأخرة')
                    ->orWhere(function ($q) {
                        $q->where('status', '!=', 'مكتملة')
                          ->whereDate('due_date', '<', Carbon::today());
                    })
                    ->count(),
            ],
            [
                'title' => 'أعضاء الفريق',
                'value' => User::count(),
            ],
        ];

        /* =========================
           المشاريع الحديثة
        ========================= */

        $recentProjects = Project::latest()
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id'       => $project->id,
                    'name'     => $project->name,
                    'progress' => $project->tasks()->count() > 0
                        ? round(
                            ($project->tasks()->where('status', 'مكتملة')->count()
                            / $project->tasks()->count()) * 100
                          )
                        : 0,
                    'status'   => $project->status,
                    'dueDate'  => optional($project->end_date)->format('Y-m-d'),
                ];
            });

        /* =========================
           المهام الحديثة
        ========================= */

        $recentTasks = Task::with('assignee:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id'        => $task->id,
                    'title'     => $task->title,
                    'status'    => $task->status,
                    'priority'  => $task->priority,
                    'assignee'  => $task->assignee?->name ?? 'غير محدد',
                ];
            });

        /* =========================
           الاستجابة النهائية
        ========================= */

        return response()->json([
            'stats'          => $stats,
            'recentProjects' => $recentProjects,
            'recentTasks'    => $recentTasks,
        ]);
    }
}
