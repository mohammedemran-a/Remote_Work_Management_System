<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    /**
     * عرض قائمة بجميع أعضاء الفريق.
     */
    public function index()
    {
        $teamMembers = TeamMember::with('user.roles')->latest()->get();
        return response()->json(['data' => $teamMembers]);
    }

    /**
     * تخزين عضو فريق جديد في قاعدة البيانات.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id|unique:team_members,user_id',
            'phone' => 'nullable|string|max:20',
            'location' => 'required|string|max:255',
            'join_date' => 'required|date',
            'department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'البيانات المرسلة غير صالحة.', 'errors' => $validator->errors()], 422);
        }

        // 1. تحديث قسم المستخدم في جدول 'users'
        $user = User::find($request->user_id);
        if ($request->has('department') && $user) {
            $user->department = $request->department;
            $user->save();
        }
        
        // 🟢 2. إنشاء موديل TeamMember فقط بالحقول التي تخصه
        $teamMember = TeamMember::create($request->only(['user_id', 'phone', 'location', 'join_date']));

        // 3. تحميل البيانات الكاملة بعد الإنشاء
        $teamMember->load('user.roles');

        return response()->json([
            'message' => 'تمت إضافة العضو بنجاح!',
            'data' => $teamMember
        ], 201);
    }

    /**
     * عرض بيانات عضو فريق محدد.
     */
    public function show(TeamMember $teamMember)
    {
        return response()->json(['data' => $teamMember->load('user.roles')]);
    }

    /**
     * تحديث بيانات عضو فريق موجود.
     */
    public function update(Request $request, TeamMember $teamMember)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id', Rule::unique('team_members')->ignore($teamMember->id)],
            'phone' => 'nullable|string|max:20',
            'location' => 'required|string|max:255',
            'join_date' => 'required|date',
            'department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'البيانات المرسلة غير صالحة.', 'errors' => $validator->errors()], 422);
        }

        // 1. تحديث قسم المستخدم في جدول 'users'
        $user = User::find($request->user_id);
        if ($request->has('department') && $user) {
            $user->department = $request->department;
            $user->save();
        }

        // 2. تحديث موديل TeamMember فقط بالحقول التي تخصه
        $teamMember->update($request->only(['user_id', 'phone', 'location', 'join_date']));

        // 3. تحميل البيانات الكاملة بعد التحديث
        $teamMember->load('user.roles');

        return response()->json([
            'message' => 'تم تحديث بيانات العضو بنجاح!',
            'data' => $teamMember
        ]);
    }

    /**
     * حذف عضو من الفريق.
     */
    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();
        return response()->json(['message' => 'تم حذف العضو من الفريق بنجاح.']);
    }
}
