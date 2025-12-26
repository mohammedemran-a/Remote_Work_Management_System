<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TeamMember;

class TeamMemberController extends Controller
{
    // عرض جميع أعضاء الفرق
    public function index() {
        return TeamMember::with(['team','user'])->get();
    }

    // إضافة عضو إلى فريق
    public function store(Request $request) {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'user_id' => 'required|exists:users,id',
            'role_in_team' => 'required|in:قائد,عضو',
            'status' => 'nullable|string'
        ]);

        $member = TeamMember::create($request->all());

        return response()->json($member->load('team','user'), 201);
    }

    // عرض عضو معين
    public function show($id) {
        return TeamMember::with(['team','user'])->findOrFail($id);
    }

    // تحديث بيانات العضو
    public function update(Request $request, $id) {
        $member = TeamMember::findOrFail($id);
        $member->update($request->only('role_in_team','status'));
        return response()->json($member->load('team','user'));
    }

    // حذف العضو من الفريق
    public function destroy($id) {
        $member = TeamMember::findOrFail($id);
        $member->delete();
        return response()->json(['message'=>'تم حذف العضو من الفريق']);
    }
}
