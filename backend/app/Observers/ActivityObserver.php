<?php

namespace App\Observers;

use App\Models\ActivityLog;

class ActivityObserver
{
    /**
     * عند إنشاء سجل جديد
     */
    public function created($model)
    {
        $this->logActivity('create', $model);
    }

    /**
     * عند تحديث سجل
     */
    public function updated($model)
    {
        $this->logActivity('update', $model);
    }

    /**
     * عند حذف سجل
     */
    public function deleted($model)
    {
        $this->logActivity('delete', $model);
    }

    /**
     * تسجيل النشاط مع الترجمة العربية
     */
    protected function logActivity(string $action, $model)
    {
        // تجاهل activity_logs نفسه لتجنب الحلقات
        if ($model->getTable() === 'activity_logs') return;

        // جلب المستخدم الحالي عبر Sanctum
        $user = auth('sanctum')->user();
        $userId = $user ? $user->id : null;
        $userName = $user ? $user->name : "غير معروف";

        // ترجمة نوع الإجراء
        $actionNames = [
            'create' => 'إنشاء',
            'update' => 'تعديل',
            'delete' => 'حذف',
        ];

        // ترجمة أسماء الموديلات
        $modelNames = [
            'Event' => 'الفعالية',
            'Profile' => 'الملف الشخصي',
            'Project' => 'المشروع',
            'ProjectFile' => 'ملف المشروع',
            'ProjectUser' => 'مستخدم المشروع',
            'Setting' => 'الإعداد',
            'Task' => 'المهمة',
            'User' => 'المستخدم',
        ];

        $actionLabel = $actionNames[$action] ?? $action;
        $modelLabel = $modelNames[class_basename($model)] ?? class_basename($model);

        // بيانات التغييرات في حالة التحديث مع تجاهل الحقول الحساسة
        $changes = null;
        if ($action === 'update') {
            $hiddenFields = ['password', 'remember_token'];
            $changes = [
                'before' => collect($model->getOriginal())->except($hiddenFields)->toArray(),
                'after'  => collect($model->getChanges())->except($hiddenFields)->toArray(),
            ];
        }

        // إنشاء سجل النشاط بالعربية
        ActivityLog::create([
            'user_id' => $userId,
            'action'  => "$actionLabel $modelLabel", // مثال: "حذف المشروع"
            'type'    => $action,
            'target'  => $model->id,
            'meta'    => $changes,
        ]);
    }
}
