<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * إرجاع بيانات المستخدم الحالي + ملفه الشخصي
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

        // إضافة رابط الصورة الكامل للواجهة
        $profile->avatar_url = $profile->avatar 
            ? asset('storage/' . $profile->avatar)
            : null;

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    /**
     * تحديث البروفايل
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validation لقبول النصوص والملفات
        $data = $request->validate([
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'job_title' => 'nullable|string',
            'status' => 'nullable|string',
            'joined_at' => 'nullable|date',
        ]);

        // رفع الصورة إلى storage/public/avatars
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = $file->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        // جلب البروفايل وتحديثه
        $profile = Profile::where('user_id', $user->id)->firstOrFail();
        $profile->update($data);

        // إضافة رابط الصورة الكامل بعد التحديث
        $profile->avatar_url = $profile->avatar 
            ? asset('storage/' . $profile->avatar)
            : null;

        return response()->json([
            'message' => 'Profile updated successfully.',
            'profile' => $profile,
        ]);
    }

    /**
     * تحديث كلمة المرور
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'كلمة المرور الحالية غير صحيحة'], 400);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'تم تحديث كلمة المرور بنجاح']);
    }
}
