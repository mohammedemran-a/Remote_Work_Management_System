<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        // بحث نصي
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($u) use ($search) {
                    $u->where('name', 'like', "%$search%");
                })
                ->orWhere('action', 'like', "%$search%")
                ->orWhere('target', 'like', "%$search%");
            });
        }

        // فلترة حسب النوع
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function destroy($id)
    {
        $log = ActivityLog::find($id);
        if (!$log) return response()->json(['message' => 'السجل غير موجود'], 404);

        $log->delete();
        return response()->json(['message' => 'تم حذف السجل بنجاح']);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->ids;
        if (!is_array($ids) || empty($ids)) {
            return response()->json(['message' => 'يرجى تمرير قائمة صحيحة من معرفات السجلات'], 422);
        }

        $deletedCount = ActivityLog::whereIn('id', $ids)->delete();
        return response()->json(['message' => "تم حذف $deletedCount سجل بنجاح"]);
    }
}
