<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\ActivityObserver;

// استدعاء جميع الموديلات
use App\Models\ActivityLog;
use App\Models\Event;
use App\Models\Profile;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectUser;
use App\Models\Setting;
use App\Models\Task;
use App\Models\User;
    
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // قائمة الموديلات التي نريد تتبعها
        $models = [
            Event::class,
            Profile::class,
            Project::class,
            ProjectFile::class,
            ProjectUser::class,
            Setting::class,
            Task::class,
            User::class,
            // يمكن إضافة أي موديل آخر حسب الحاجة
        ];

        // تسجيل Observer عام لكل موديل
        foreach ($models as $model) {
            $model::observe(ActivityObserver::class);
        }
    }
}
