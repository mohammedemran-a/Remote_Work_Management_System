<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\TaskController;
use App\Http\Controllers\Api\ProjectFileController;
use App\Http\Controllers\RolePermissionController;
// ------------------------
// 🔹 التسجيل وتسجيل الدخول
// ------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ------------------------
// 🔹 كل العمليات المحمية بـ توكن Sanctum
// ------------------------
Route::middleware('auth:sanctum')->group(function () {

    // تسجيل الخروج
    Route::post('/logout', [AuthController::class, 'logout']);

    // بيانات المستخدم الحالي
    Route::get('/user', [AuthController::class, 'me']);

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
    Route::get('/project-files/download/{id}', [ProjectFileController::class, 'download']);
});


Route::get('/roles', [RolePermissionController::class, 'index']);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);
    Route::post('/roles', [RolePermissionController::class, 'store']);
    Route::put('/roles/{id}', [RolePermissionController::class, 'update']);
    Route::delete('/roles/{id}', [RolePermissionController::class, 'destroy']);

