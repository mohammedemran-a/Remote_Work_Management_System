<?php

// 🟢 تأكد من أن هذا الـ namespace يطابق مسار الملف
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator; // 🟢 إضافة استيراد Validator
use Illuminate\Validation\Rule;          // 🟢 إضافة استيراد Rule
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    // -----------------------------
    // 📋 جلب جميع المستخدمين
    // -----------------------------
    public function index(Request $request)
    {
        $users_data = User::with('roles')->latest()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department,
                'roles' => $user->roles->map(function($role) {
                    return ['id' => $role->id, 'name' => $role->name];
                }),
                // 🟢 إضافة created_at و updated_at لتوحيد الواجهة
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ];
        });

        return response()->json(['data' => $users_data]);
    }

    // -----------------------------
    // 🟢 إنشاء مستخدم جديد
    // -----------------------------
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'department' => 'nullable|string|max:255',
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'البيانات المرسلة غير صالحة', 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'department' => $request->department,
        ]);
        $user->syncRoles($request->roles);

        $newUser = User::with('roles')->find($user->id);
        $newUserData = [
            'id' => $newUser->id,
            'name' => $newUser->name,
            'email' => $newUser->email,
            'department' => $newUser->department,
            'roles' => $newUser->roles->map(function($role) {
                return ['id' => $role->id, 'name' => $role->name];
            }),
            'created_at' => $newUser->created_at,
            'updated_at' => $newUser->updated_at,
        ];

        return response()->json([
            'message' => 'تم إنشاء المستخدم بنجاح',
            'data' => $newUserData
        ], 201);
    }
    
    // -----------------------------
    // 🔄 تحديث مستخدم موجود (تمت إضافته الآن)
    // -----------------------------
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'department' => 'nullable|string|max:255',
            'roles' => 'sometimes|required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'البيانات المرسلة غير صالحة', 'errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $user->update($request->only(['name', 'email', 'department']));

        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }
        if (isset($validatedData['roles'])) {
            $user->syncRoles($validatedData['roles']);
        }
        $user->save();

        $updatedUser = User::with('roles')->find($user->id);
        $updatedUserData = [
            'id' => $updatedUser->id,
            'name' => $updatedUser->name,
            'email' => $updatedUser->email,
            'department' => $updatedUser->department,
            'roles' => $updatedUser->roles->map(function($role) {
                return ['id' => $role->id, 'name' => $role->name];
            }),
            'created_at' => $updatedUser->created_at,
            'updated_at' => $updatedUser->updated_at,
        ];

        return response()->json([
            'message' => 'تم تحديث المستخدم بنجاح!',
            'data' => $updatedUserData
        ]);
    }

    // -----------------------------
    // 🗑️ حذف مستخدم (تمت إضافته الآن)
    // -----------------------------
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'تم حذف المستخدم بنجاح.']);
    }
}
