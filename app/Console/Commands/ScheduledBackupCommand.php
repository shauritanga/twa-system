<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Command;

class ScheduledBackupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:scheduled 
                            {--type=full : Type of backup (full, database)}
                            {--force : Force backup even if auto backup is disabled}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run scheduled backup based on system settings';

    protected BackupService $backupService;

    /**
     * Create a new command instance.
     */
    public function __construct(BackupService $backupService)
    {
        parent::__construct();
        $this->backupService = $backupService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $force = $this->option('force');

        // Check if auto backup is enabled (unless forced)
        if (!$force && !$this->backupService->isAutoBackupEnabled()) {
            $this->info('Auto backup is disabled. Use --force to run anyway.');
            return 0;
        }

        $this->info('Starting scheduled backup...');

        // Run the appropriate backup type
        if ($type === 'database') {
            $result = $this->backupService->createDatabaseBackup();
        } else {
            $result = $this->backupService->createManualBackup();
        }

        if ($result['success']) {
            $this->info('✅ ' . $result['message']);
            
            if ($result['backup_info']) {
                $backup = $result['backup_info'];
                $this->table(['Property', 'Value'], [
                    ['Filename', $backup['filename']],
                    ['Size', $backup['size']],
                    ['Created', $backup['created_at']->format('Y-m-d H:i:s')],
                ]);
            }

            // Clean old backups after successful backup
            $this->info('Cleaning old backups...');
            $cleanResult = $this->backupService->cleanOldBackups();
            
            if ($cleanResult['success']) {
                $this->info('✅ ' . $cleanResult['message']);
            } else {
                $this->warn('⚠️ ' . $cleanResult['message']);
            }

        } else {
            $this->error('❌ ' . $result['message']);
            return 1;
        }

        return 0;
    }
}
