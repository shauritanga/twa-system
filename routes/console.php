<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\BackupService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled backup commands based on settings
Schedule::command('backup:scheduled --type=full')->when(function () {
    $backupService = app(BackupService::class);

    if (!$backupService->isAutoBackupEnabled()) {
        return false;
    }

    $frequency = $backupService->getBackupFrequency();

    return match($frequency) {
        'daily' => true,
        'weekly' => now()->dayOfWeek === 0, // Sunday
        'monthly' => now()->day === 1, // First day of month
        default => false
    };
})->dailyAt('02:00')->name('scheduled-backup')->withoutOverlapping();

// Clean old backups daily - using a separate artisan command
Schedule::call(function () {
    $backupService = app(BackupService::class);
    $backupService->cleanOldBackups();
})->dailyAt('03:00')->name('cleanup-old-backups');
