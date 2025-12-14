<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use App\Listeners\LogAuthenticationActivity;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            LogAuthenticationActivity::class,
        ],
        Logout::class => [
            LogAuthenticationActivity::class,
        ],
        Failed::class => [
            LogAuthenticationActivity::class,
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
