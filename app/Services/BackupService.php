<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Process;
use Carbon\Carbon;
use Exception;

class BackupService
{
    /**
     * Cache key for backup settings
     */
    const CACHE_KEY = 'backup_settings';

    /**
     * Cache duration in minutes
     */
    const CACHE_DURATION = 60;

    /**
     * Create a manual backup
     *
     * @return array
     */
    public function createManualBackup(): array
    {
        try {
            Log::info('Manual backup initiated by user: ' . (auth()->user()->email ?? 'system'));

            // Run the backup command using Process for better error handling
            $result = Process::timeout(300)->run([
                'php',
                base_path('artisan'),
                'backup:run',
                '--disable-notifications'
            ]);

            Log::info('Backup command output: ' . $result->output());

            if ($result->successful()) {
                // Wait a moment for file system to sync
                sleep(1);

                $backupInfo = $this->getLatestBackupInfo();

                Log::info('Manual backup completed successfully', $backupInfo);

                return [
                    'success' => true,
                    'message' => 'Backup completed successfully',
                    'backup_info' => $backupInfo
                ];
            } else {
                Log::error('Backup command failed. Output: ' . $result->output() . '. Error: ' . $result->errorOutput());
                throw new Exception('Backup command failed: ' . $result->errorOutput());
            }

        } catch (Exception $e) {
            Log::error('Manual backup failed: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Backup failed: ' . $e->getMessage(),
                'backup_info' => null
            ];
        }
    }

    /**
     * Create database-only backup
     *
     * @return array
     */
    public function createDatabaseBackup(): array
    {
        try {
            Log::info('Database backup initiated');

            // Run the backup command using Process for better error handling
            $result = Process::timeout(300)->run([
                'php',
                base_path('artisan'),
                'backup:run',
                '--only-db',
                '--disable-notifications'
            ]);

            Log::info('Database backup command output: ' . $result->output());

            if ($result->successful()) {
                // Wait a moment for file system to sync
                sleep(1);

                $backupInfo = $this->getLatestBackupInfo();

                return [
                    'success' => true,
                    'message' => 'Database backup completed successfully',
                    'backup_info' => $backupInfo
                ];
            } else {
                Log::error('Database backup command failed. Output: ' . $result->output() . '. Error: ' . $result->errorOutput());
                throw new Exception('Database backup command failed: ' . $result->errorOutput());
            }

        } catch (Exception $e) {
            Log::error('Database backup failed: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Database backup failed: ' . $e->getMessage(),
                'backup_info' => null
            ];
        }
    }

    /**
     * Get list of all backups
     * 
     * @return array
     */
    public function listBackups(): array
    {
        try {
            $backupDisk = Storage::disk(config('backup.backup.destination.disks')[0]);
            $backupPath = config('backup.backup.name');
            
            if (!$backupDisk->exists($backupPath)) {
                return [];
            }

            $files = $backupDisk->files($backupPath);
            $backups = [];

            foreach ($files as $file) {
                if (str_ends_with($file, '.zip')) {
                    $backups[] = [
                        'filename' => basename($file),
                        'path' => $file,
                        'size' => $this->formatBytes($backupDisk->size($file)),
                        'created_at' => Carbon::createFromTimestamp($backupDisk->lastModified($file)),
                        'age' => Carbon::createFromTimestamp($backupDisk->lastModified($file))->diffForHumans(),
                    ];
                }
            }

            // Sort by creation date (newest first)
            usort($backups, function ($a, $b) {
                return $b['created_at']->timestamp - $a['created_at']->timestamp;
            });

            return $backups;

        } catch (Exception $e) {
            Log::error('Failed to list backups: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Delete a backup file
     * 
     * @param string $filename
     * @return array
     */
    public function deleteBackup(string $filename): array
    {
        try {
            $backupDisk = Storage::disk(config('backup.backup.destination.disks')[0]);
            $backupPath = config('backup.backup.name') . '/' . $filename;

            if (!$backupDisk->exists($backupPath)) {
                return [
                    'success' => false,
                    'message' => 'Backup file not found'
                ];
            }

            $backupDisk->delete($backupPath);
            
            Log::info('Backup deleted: ' . $filename);

            return [
                'success' => true,
                'message' => 'Backup deleted successfully'
            ];

        } catch (Exception $e) {
            Log::error('Failed to delete backup: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to delete backup: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Download a backup file
     * 
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|null
     */
    public function downloadBackup(string $filename)
    {
        try {
            $backupDisk = Storage::disk(config('backup.backup.destination.disks')[0]);
            $backupPath = config('backup.backup.name') . '/' . $filename;

            if (!$backupDisk->exists($backupPath)) {
                return null;
            }

            return $backupDisk->download($backupPath);

        } catch (Exception $e) {
            Log::error('Failed to download backup: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Clean old backups based on retention settings
     * 
     * @return array
     */
    public function cleanOldBackups(): array
    {
        try {
            $retentionDays = $this->getBackupRetentionDays();
            $cutoffDate = Carbon::now()->subDays($retentionDays);
            
            $backups = $this->listBackups();
            $deletedCount = 0;

            foreach ($backups as $backup) {
                if ($backup['created_at']->lt($cutoffDate)) {
                    $result = $this->deleteBackup($backup['filename']);
                    if ($result['success']) {
                        $deletedCount++;
                    }
                }
            }

            Log::info("Cleaned {$deletedCount} old backups (retention: {$retentionDays} days)");

            return [
                'success' => true,
                'message' => "Cleaned {$deletedCount} old backups",
                'deleted_count' => $deletedCount
            ];

        } catch (Exception $e) {
            Log::error('Failed to clean old backups: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to clean old backups: ' . $e->getMessage(),
                'deleted_count' => 0
            ];
        }
    }

    /**
     * Get latest backup information
     * 
     * @return array|null
     */
    private function getLatestBackupInfo(): ?array
    {
        $backups = $this->listBackups();
        return !empty($backups) ? $backups[0] : null;
    }

    /**
     * Get backup retention days from settings
     * 
     * @return int
     */
    private function getBackupRetentionDays(): int
    {
        return Cache::remember(self::CACHE_KEY . '_retention', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'backup_retention_days')->first();
            return $setting ? (int) $setting->value : 30;
        });
    }

    /**
     * Format bytes to human readable format
     * 
     * @param int $bytes
     * @return string
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if auto backup is enabled
     * 
     * @return bool
     */
    public function isAutoBackupEnabled(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_auto_enabled', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'auto_backup')->first();
            return $setting ? $setting->value === '1' : false;
        });
    }

    /**
     * Get backup frequency
     * 
     * @return string
     */
    public function getBackupFrequency(): string
    {
        return Cache::remember(self::CACHE_KEY . '_frequency', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'backup_frequency')->first();
            return $setting ? $setting->value : 'weekly';
        });
    }

    /**
     * Clear backup settings cache
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_retention');
        Cache::forget(self::CACHE_KEY . '_auto_enabled');
        Cache::forget(self::CACHE_KEY . '_frequency');
    }
}
