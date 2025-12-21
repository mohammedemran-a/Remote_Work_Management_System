<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- استيراد كل الكنترولرات المستخدمة ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\TaskController;
use App\Http\Controllers\api\EventController;
use App\Http\Controllers\api\TeamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\ProjectFileController;
use App\Http\Controllers\api\ChatController;
use App\Http\Controllers\api\SettingController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\NotificationController;

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
    Route::apiResource('/roles', RolePermissionController::class);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);

    // --- المشاريع والمهام والأحداث ---
    Route::apiResource('/projects', ProjectController::class);
    Route::apiResource('/tasks', TaskController::class);
    Route::apiResource('/events', EventController::class);

    // --- أعضاء الفريق (Team Members) ---
    Route::apiResource('/team-members', TeamController::class);

    // --- ملفات المشاريع ---
    Route::get('/project-files/download/{id}', [ProjectFileController::class, 'download']);
    Route::apiResource('/project-files', ProjectFileController::class)->except(['update']);
    Route::post('/project-files/{id}', [ProjectFileController::class, 'update']); // لتصحيح مشكلة FormData مع PUT

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::post('/profile/account', [ProfileController::class, 'updateAccount']);
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
});

    // --- الإعدادات ---
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);

    // --- سجل النشاط ---
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::delete('/activity-logs/{id}', [ActivityLogController::class, 'destroy']);
    Route::delete('/activity-logs', [ActivityLogController::class, 'destroyMultiple']);

    // --- الإشعارات ---
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']); // ✅ جديد
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'clearAll']);

    // --- الدردشة (Chat) ---
    // 🟢 تم نقل هذه المسارات إلى هنا لتكون محمية
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/conversations/{conversation}/messages', [ChatController::class, 'getMessages']);
    Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage']);
    Route::post('/conversations', [ChatController::class, 'createConversation']);
Route::post('/conversations/{conversation}/members', [ChatController::class, 'addMembers']);
});
