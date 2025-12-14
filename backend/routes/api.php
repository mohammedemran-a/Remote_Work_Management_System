<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\TaskController;

use App\Http\Controllers\api\EventController;
use App\Http\Controllers\api\TeamController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;

// مسار لجلب كل الأحداث
Route::get('/events', [EventController::class, 'index']);

// مسار لإنشاء حدث جديد
Route::post('/events', [EventController::class, 'store']);


use App\Http\Controllers\Api\ProjectFileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| هنا نقوم بتسجيل جميع مسارات الـ API الخاصة بالتطبيق.
|
*/

// =========================================================================
// 🔹 القسم العام: مسارات لا تتطلب تسجيل دخول
// =========================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// =========================================================================
// 🔹 القسم المحمي: كل المسارات هنا تتطلب توكن Sanctum (تسجيل الدخول)
// =========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- المصادقة ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);


    // --- المستخدمين والأدوار والصلاحيات ---
    Route::apiResource('/users', UsersController::class);

    // ------------------------
    // 🔹 إدارة المستخدمين (CRUD)
    // ------------------------
    Route::get('/users', [UsersController::class, 'index']);        // جلب كل المستخدمين
    Route::get('/users/{id}', [UsersController::class, 'show']);    // جلب مستخدم محدد
    Route::post('/users', [UsersController::class, 'store']);       // إنشاء مستخدم جديد
    Route::put('/users/{id}', [UsersController::class, 'update']);  // تعديل مستخدم
    Route::delete('/users/{id}', [UsersController::class, 'destroy']); // حذف مستخدم
});



Route::apiResource('projects', ProjectController::class);


Route::apiResource('tasks', TaskController::class);




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/project-files', [ProjectFileController::class, 'index']);
    Route::post('/project-files', [ProjectFileController::class, 'store']);
    Route::get('/project-files/{id}', [ProjectFileController::class, 'show']);
    Route::put('/project-files/{id}', [ProjectFileController::class, 'update']);
    Route::delete('/project-files/{id}', [ProjectFileController::class, 'destroy']);
    Route::get('/project-files/{id}/download', [ProjectFileController::class, 'download']);

});


Route::get('/roles', [RolePermissionController::class, 'index']);

    Route::get('/permissions', [RolePermissionController::class, 'permissions']);
    Route::apiResource('/roles', RolePermissionController::class);


    // --- المشاريع والمهام والأحداث ---
    Route::apiResource('/projects', ProjectController::class);
    Route::apiResource('/tasks', TaskController::class);
    Route::apiResource('/events', EventController::class);

    // --- أعضاء الفريق (Team Members) ---
    // 🟢 تم تصحيح المسار إلى 'team-members' وتضمين كل العمليات
    Route::apiResource('/team-members', TeamController::class);

    // --- ملفات المشاريع ---
    Route::get('/project-files/download/{id}', [ProjectFileController::class, 'download']);
    Route::apiResource('/project-files', ProjectFileController::class)->except(['update']);
    Route::post('/project-files/{id}', [ProjectFileController::class, 'update']); // لتصحيح مشكلة FormData مع PUT





Route::middleware('auth:sanctum')->group(function () {
    // جلب بيانات المستخدم الحالي
    Route::get('/profile/me', [ProfileController::class, 'me']);

    // تحديث الملف الشخصي
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);

    // تحديث كلمة المرور
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
});

use App\Http\Controllers\api\SettingController;

Route::get('/settings', [SettingController::class, 'index']);
Route::post('/settings', [SettingController::class, 'update']);


use App\Http\Controllers\Api\ActivityLogController;

Route::get('/activity-logs', [ActivityLogController::class, 'index']);
Route::delete('/activity-logs/{id}', [ActivityLogController::class, 'destroy']);
Route::delete('/activity-logs', [ActivityLogController::class, 'destroyMultiple']);


use App\Http\Controllers\NotificationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'clearAll']);

});
