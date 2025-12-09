<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    // -----------------------------
    // 🟡 جلب بيانات المستخدم الحالي
    // -----------------------------
    public function user(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $user->load('roles', 'permissions');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    // -----------------------------
    // 📋 جلب جميع المستخدمين
    // -----------------------------
    public function index(Request $request)
    {
        // نعيد نفس وظيفة allUsers باسم index
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        if (!$user->hasRole('admin') && !$user->can('users_view')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $users = User::with('roles')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'roles' => $u->getRoleNames(),
            ];
        });

        return response()->json(['users' => $users]);
    }

    // -----------------------------
    // 🟢 إنشاء مستخدم جديد
    // -----------------------------
    public function store(Request $request)
    {
        $admin = $request->user();
        if (!$admin || (!$admin->hasRole('admin') && !$admin->can('users_create'))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!Role::where('name', $value)->exists()) {
                        $fail("الدور المختار غير صالح.");
                    }
                },
            ],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ], 201);
    }

    // -----------------------------
    // ✏️ تعديل بيانات مستخدم
    // -----------------------------
    public function update(Request $request, $id)
    {
        $admin = $request->user();
        if (!$admin || (!$admin->hasRole('admin') && !$admin->can('users_edit'))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!Role::where('name', $value)->exists()) {
                        $fail("الدور المختار غير صالح.");
                    }
                },
            ],
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) $user->password = Hash::make($request->password);

        $user->save();
        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }

    // -----------------------------
    // ❌ حذف مستخدم
    // -----------------------------
    public function destroy(Request $request, $id)
    {
        $admin = $request->user();
        if (!$admin || (!$admin->hasRole('admin') && !$admin->can('users_delete'))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
