<?php

namespace App\Providers;

use App\Models\UserRandom;
use App\Models\User;
use App\Observers\UserRandomObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        UserRandom::observe(UserRandomObserver::class);
        User::observe(UserObserver::class);
    }
}
