<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    // ==========================
    // جلب جميع الإعدادات
    // ==========================
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->map(function ($value, $key) {
            // تحويل "true"/"false" إلى boolean
            if ($value === 'true') return true;
            if ($value === 'false') return false;

            // إذا كان الشعار، أعطه رابط كامل
            if ($key === 'logo' && $value) {
                $value = asset('storage/' . $value);
            }

            return $value;
        });

        return response()->json($settings);
    }

    // ==========================
    // تحديث الإعدادات
    // ==========================
    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {

            // إذا كان شعار مرفوع
            if ($key === 'logo' && $request->hasFile('logo')) {
                $oldLogo = Setting::where('key', 'logo')->first()?->value;
                if ($oldLogo) {
                    Storage::disk('public')->delete($oldLogo); // حذف القديم
                }

                $path = $request->file('logo')->store('logos', 'public');
                $value = $path;
            }

            // تحويل boolean إلى string قبل الحفظ
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'تم حفظ الإعدادات بنجاح']);
    }
}
