<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;
use App\Models\Project;

class TeamController extends Controller
{
    // عرض جميع الفرق
    public function index() {
        return Team::with(['leader', 'members', 'projects'])->get();
    }

    // إنشاء فريق جديد وربطه بالمشاريع
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'leader_id' => 'required|exists:users,id',
            'project_ids.*' => 'exists:projects,id'
        ]);

        $team = Team::create($request->only('name', 'description', 'leader_id'));

        if($request->has('project_ids')){
            $team->projects()->sync($request->project_ids);
        }

        return response()->json($team->load('leader','projects'), 201);
    }

    // عرض فريق معين
    public function show($id) {
        return Team::with(['leader', 'members', 'projects'])->findOrFail($id);
    }

    // تحديث بيانات الفريق
    public function update(Request $request, $id) {
        $team = Team::findOrFail($id);
        $team->update($request->only('name','description','leader_id'));

        if($request->has('project_ids')){
            $team->projects()->sync($request->project_ids);
        }

        return response()->json($team->load('leader','projects'));
    }

    // حذف الفريق
    public function destroy($id) {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message'=>'تم حذف الفريق بنجاح']);
    }
}
 