<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Models\User;
use App\Notifications\TeamNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    /**
     * عرض جميع أعضاء الفريق
     */
    public function index()
    {
        $teamMembers = TeamMember::with('user.roles')->latest()->get();
        return response()->json(['data' => $teamMembers]);
    }

    /**
     * إضافة عضو جديد + إشعار
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id|unique:team_members,user_id',
            'phone'      => 'nullable|string|max:20',
            'location'   => 'required|string|max:255',
            'join_date'  => 'required|date',
            'department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'البيانات المرسلة غير صالحة.',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 1️⃣ تحديث قسم المستخدم
        $user = User::find($request->user_id);
        if ($request->filled('department') && $user) {
            $user->update(['department' => $request->department]);
        }

        // 2️⃣ إنشاء عضو الفريق
        $teamMember = TeamMember::create(
            $request->only(['user_id', 'phone', 'location', 'join_date'])
        );

        $teamMember->load('user.roles');

        // 3️⃣ إشعار (إضافة عضو)
        $teamMember->user->notify(
            new TeamNotification($teamMember, 'created')
        );

        return response()->json([
            'message' => 'تمت إضافة العضو بنجاح!',
            'data'    => $teamMember
        ], 201);
    }

    /**
     * عرض عضو محدد
     */
    public function show(TeamMember $teamMember)
    {
        return response()->json([
            'data' => $teamMember->load('user.roles')
        ]);
    }

    /**
     * تحديث عضو + إشعار
     */
    public function update(Request $request, TeamMember $teamMember)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => ['required', 'exists:users,id', Rule::unique('team_members')->ignore($teamMember->id)],
            'phone'      => 'nullable|string|max:20',
            'location'   => 'required|string|max:255',
            'join_date'  => 'required|date',
            'department' => 'nullable|string|max:255',
            'status'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'البيانات المرسلة غير صالحة.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $oldStatus = $teamMember->status;

        // 1️⃣ تحديث قسم المستخدم
        $user = User::find($request->user_id);
        if ($request->filled('department') && $user) {
            $user->update(['department' => $request->department]);
        }

        // 2️⃣ تحديث بيانات عضو الفريق
        $teamMember->update(
            $request->only(['user_id', 'phone', 'location', 'join_date', 'status'])
        );

        $teamMember->load('user.roles');

        // 3️⃣ تحديد نوع الإشعار
        $type = ($request->has('status') && $oldStatus !== $teamMember->status)
            ? 'status_changed'
            : 'updated';

        // 4️⃣ إرسال الإشعار
        $teamMember->user->notify(
            new TeamNotification($teamMember, $type)
        );

        return response()->json([
            'message' => 'تم تحديث بيانات العضو بنجاح!',
            'data'    => $teamMember
        ]);
    }

    /**
     * حذف عضو + إشعار
     */
    public function destroy(TeamMember $teamMember)
    {
        $teamMember->load('user');

        // إشعار حذف
        $teamMember->user->notify(
            new TeamNotification($teamMember, 'deleted')
        );

        $teamMember->delete();

        return response()->json([
            'message' => 'تم حذف العضو من الفريق بنجاح.'
        ]);
    }
}
