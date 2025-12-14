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

});
