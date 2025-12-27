<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;
use App\Models\Project;

class TeamController extends Controller
{
    public function index() {
        return Team::with(['leader', 'members', 'projects'])->get();
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'leader_id' => 'required|exists:users,id',
            'project_ids.*' => 'exists:projects,id',
            'member_ids.*' => 'exists:users,id' // 🟢 إضافة التحقق من الأعضاء
        ]);

        $team = Team::create($request->only('name', 'description', 'leader_id'));

        if($request->has('project_ids')){
            $team->projects()->sync($request->project_ids);
        }

        // 🟢 إضافة ربط الأعضاء (تأكد من وجود علاقة members في موديل Team)
        if($request->has('member_ids')){
            $team->members()->sync($request->member_ids);
        }

        return response()->json($team->load('leader','projects','members'), 201);
    }

    public function show($id) {
        return Team::with(['leader', 'members', 'projects'])->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $team = Team::findOrFail($id);
        $team->update($request->only('name','description','leader_id'));

        if($request->has('project_ids')){
            $team->projects()->sync($request->project_ids);
        }

        // 🟢 تحديث ربط الأعضاء عند التعديل
        if($request->has('member_ids')){
            $team->members()->sync($request->member_ids);
        }

        return response()->json($team->load('leader','projects','members'));
    }

    public function destroy($id) {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message'=>'تم حذف الفريق بنجاح']);
    }
}