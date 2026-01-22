<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

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
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);
        
        // Register model observers for automatic accounting entries
        \App\Models\Contribution::observe(\App\Observers\ContributionObserver::class);
        \App\Models\DisasterPayment::observe(\App\Observers\DisasterPaymentObserver::class);
        \App\Models\Expense::observe(\App\Observers\ExpenseObserver::class);
    }
}
