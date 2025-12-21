<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * 🔹 جلب بيانات المستخدم الحالي + ملفه الشخصي
     */
    public function me(Request $request)
    {
        $user = $request->user();

        // إنشاء بروفايل تلقائي إذا لم يكن موجود
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'status' => 'active',
                'joined_at' => now(),
            ]
        );

        // رابط الصورة الكامل
        $profile->avatar_url = $profile->avatar
            ? asset('storage/' . $profile->avatar)
            : null;

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    /**
     * 🔹 تحديث بيانات الحساب (الاسم + البريد الإلكتروني)
     * ❗ لا علاقة له بكلمة المرور
     */
    public function updateAccount(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'تم تحديث الاسم والبريد الإلكتروني بنجاح',
            'user' => $user,
        ]);
    }

    /**
     * 🔹 تحديث بيانات الملف الشخصي (profiles)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'avatar'    => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'job_title' => 'nullable|string|max:255',
            'status'    => 'nullable|string',
            'joined_at' => 'nullable|date',
        ]);

        $profile = Profile::where('user_id', $user->id)->firstOrFail();

        // رفع صورة جديدة + حذف القديمة إن وجدت
        if ($request->hasFile('avatar')) {
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $profile->update($data);

        // رابط الصورة بعد التحديث
        $profile->avatar_url = $profile->avatar
            ? asset('storage/' . $profile->avatar)
            : null;

        return response()->json([
            'message' => 'تم تحديث بيانات الملف الشخصي بنجاح',
            'profile' => $profile,
        ]);
    }

    /**
     * 🔹 تحديث كلمة المرور
     * ❗ هذا الكود لم يتم تغييره نهائيًا
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'error' => 'كلمة المرور الحالية غير صحيحة'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'تم تحديث كلمة المرور بنجاح'
        ]);
    }
}
