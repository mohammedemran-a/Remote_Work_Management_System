<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use App\Models\ActivityLog;

class LogAuthenticationActivity implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle($event)
    {
        $meta = [
            'ip' => request()->ip(),
            'agent' => request()->userAgent(),
        ];

        if ($event instanceof Login) {
            ActivityLog::create([
                'user_id' => $event->user->id,
                'action'  => 'تسجيل الدخول',
                'type'    => 'login',
                'target'  => null,
                'meta'    => $meta,
            ]);
        } elseif ($event instanceof Logout) {
            ActivityLog::create([
                'user_id' => $event->user->id,
                'action'  => 'تسجيل الخروج',
                'type'    => 'logout',
                'target'  => null,
                'meta'    => $meta,
            ]);
        } elseif ($event instanceof Failed) {
            ActivityLog::create([
                'user_id' => null,
                'action'  => 'فشل تسجيل الدخول للمستخدم: '.$event->credentials['email'],
                'type'    => 'login_failed',
                'target'  => null,
                'meta'    => $meta,
            ]);
        }
    }
}
