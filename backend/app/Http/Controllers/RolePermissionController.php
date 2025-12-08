<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionController extends Controller
{
    // 🔹 جلب جميع الأدوار مع الصلاحيات وعدد المستخدمين
    public function index()
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            // حساب عدد المستخدمين لكل دور بدون مشاكل guard
            $usersCount = User::whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role->name);
            })->count();

            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
                'usersCount' => $usersCount,
                'createdAt' => $role->created_at->toDateString(),
            ];
        });

        return response()->json($roles);
    }

    // 🔹 جلب جميع الصلاحيات المتاحة
    public function permissions()
    {
        $permissions = Permission::where('guard_name', 'web')->pluck('name');
        return response()->json($permissions);
    }

    // 🔹 إنشاء دور جديد مع صلاحياته
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'required|array|min:1',
        ]);

        // التحقق من وجود كل صلاحية مع guard web
        foreach ($request->permissions as $permName) {
            if (!Permission::where('name', $permName)->where('guard_name', 'web')->exists()) {
                return response()->json([
                    'message' => "Permission '$permName' does not exist."
                ], 422);
            }
        }

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);
        $role->syncPermissions($request->permissions);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions')
        ]);
    }

    // 🔹 تعديل دور موجود
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'required|array|min:1',
        ]);

        // التحقق من وجود كل صلاحية مع guard web
        foreach ($request->permissions as $permName) {
            if (!Permission::where('name', $permName)->where('guard_name', 'web')->exists()) {
                return response()->json([
                    'message' => "Permission '$permName' does not exist."
                ], 422);
            }
        }

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->load('permissions')
        ]);
    }

    // 🔹 حذف دور
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        $usersCount = User::whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role->name);
        })->count();

        if ($usersCount > 0) {
            return response()->json([
                'message' => 'Cannot delete a role assigned to users',
            ], 400);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }
}
