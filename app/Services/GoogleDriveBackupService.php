<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class GoogleDriveBackupService
{
    /**
     * Upload backup to Google Drive
     * 
     * @param string $backupPath
     * @param string $filename
     * @return array
     */
    public function uploadToGoogleDrive(string $backupPath, string $filename): array
    {
        try {
            // Check if Google Drive is configured
            if (!$this->isGoogleDriveConfigured()) {
                return [
                    'success' => false,
                    'message' => 'Google Drive is not configured. Please set up Google Drive credentials.'
                ];
            }

            // Get the backup file content
            $backupDisk = Storage::disk(config('backup.backup.destination.disks')[0]);
            
            if (!$backupDisk->exists($backupPath)) {
                return [
                    'success' => false,
                    'message' => 'Backup file not found: ' . $backupPath
                ];
            }

            // Upload to Google Drive
            $googleDrive = Storage::disk('google');
            $backupContent = $backupDisk->get($backupPath);
            
            $googleDrivePath = 'backups/' . date('Y/m/') . $filename;
            $uploaded = $googleDrive->put($googleDrivePath, $backupContent);

            if ($uploaded) {
                Log::info('Backup uploaded to Google Drive successfully', [
                    'filename' => $filename,
                    'google_drive_path' => $googleDrivePath,
                    'size' => strlen($backupContent)
                ]);

                return [
                    'success' => true,
                    'message' => 'Backup uploaded to Google Drive successfully',
                    'google_drive_path' => $googleDrivePath
                ];
            } else {
                throw new Exception('Failed to upload backup to Google Drive');
            }

        } catch (Exception $e) {
            Log::error('Failed to upload backup to Google Drive: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to upload to Google Drive: ' . $e->getMessage()
            ];
        }
    }

    /**
     * List backups from Google Drive
     * 
     * @return array
     */
    public function listGoogleDriveBackups(): array
    {
        try {
            if (!$this->isGoogleDriveConfigured()) {
                return [];
            }

            $googleDrive = Storage::disk('google');
            $files = $googleDrive->allFiles('backups');
            
            $backups = [];
            foreach ($files as $file) {
                if (str_ends_with($file, '.zip')) {
                    $backups[] = [
                        'filename' => basename($file),
                        'path' => $file,
                        'size' => $this->formatBytes($googleDrive->size($file)),
                        'created_at' => $googleDrive->lastModified($file),
                        'location' => 'Google Drive'
                    ];
                }
            }

            return $backups;

        } catch (Exception $e) {
            Log::error('Failed to list Google Drive backups: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Download backup from Google Drive
     * 
     * @param string $googleDrivePath
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|null
     */
    public function downloadFromGoogleDrive(string $googleDrivePath)
    {
        try {
            if (!$this->isGoogleDriveConfigured()) {
                return null;
            }

            $googleDrive = Storage::disk('google');
            
            if (!$googleDrive->exists($googleDrivePath)) {
                return null;
            }

            return $googleDrive->download($googleDrivePath);

        } catch (Exception $e) {
            Log::error('Failed to download from Google Drive: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete backup from Google Drive
     * 
     * @param string $googleDrivePath
     * @return array
     */
    public function deleteFromGoogleDrive(string $googleDrivePath): array
    {
        try {
            if (!$this->isGoogleDriveConfigured()) {
                return [
                    'success' => false,
                    'message' => 'Google Drive is not configured'
                ];
            }

            $googleDrive = Storage::disk('google');
            
            if (!$googleDrive->exists($googleDrivePath)) {
                return [
                    'success' => false,
                    'message' => 'File not found in Google Drive'
                ];
            }

            $googleDrive->delete($googleDrivePath);
            
            Log::info('Backup deleted from Google Drive: ' . $googleDrivePath);

            return [
                'success' => true,
                'message' => 'Backup deleted from Google Drive successfully'
            ];

        } catch (Exception $e) {
            Log::error('Failed to delete from Google Drive: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to delete from Google Drive: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Sync local backups to Google Drive
     * 
     * @return array
     */
    public function syncToGoogleDrive(): array
    {
        try {
            if (!$this->isGoogleDriveConfigured()) {
                return [
                    'success' => false,
                    'message' => 'Google Drive is not configured',
                    'synced_count' => 0
                ];
            }

            $backupService = app(BackupService::class);
            $localBackups = $backupService->listBackups();
            $googleDriveBackups = $this->listGoogleDriveBackups();
            
            // Get list of files already in Google Drive
            $googleDriveFiles = array_column($googleDriveBackups, 'filename');
            
            $syncedCount = 0;
            $errors = [];

            foreach ($localBackups as $backup) {
                // Skip if already exists in Google Drive
                if (in_array($backup['filename'], $googleDriveFiles)) {
                    continue;
                }

                $result = $this->uploadToGoogleDrive($backup['path'], $backup['filename']);
                
                if ($result['success']) {
                    $syncedCount++;
                } else {
                    $errors[] = $backup['filename'] . ': ' . $result['message'];
                }
            }

            $message = "Synced {$syncedCount} backup(s) to Google Drive";
            if (!empty($errors)) {
                $message .= '. Errors: ' . implode(', ', $errors);
            }

            Log::info($message);

            return [
                'success' => true,
                'message' => $message,
                'synced_count' => $syncedCount,
                'errors' => $errors
            ];

        } catch (Exception $e) {
            Log::error('Failed to sync backups to Google Drive: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to sync to Google Drive: ' . $e->getMessage(),
                'synced_count' => 0
            ];
        }
    }

    /**
     * Check if Google Drive is configured
     * 
     * @return bool
     */
    private function isGoogleDriveConfigured(): bool
    {
        try {
            // Check if Google Drive disk is configured
            $config = config('filesystems.disks.google');
            
            return !empty($config) && 
                   !empty($config['clientId']) && 
                   !empty($config['clientSecret']) && 
                   !empty($config['refreshToken']);
                   
        } catch (Exception $e) {
            return false;
        }
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
     * Get Google Drive setup instructions
     * 
     * @return array
     */
    public function getSetupInstructions(): array
    {
        return [
            'title' => 'Google Drive Setup Instructions',
            'steps' => [
                '1. Install Google Drive package: composer require nao-pon/flysystem-google-drive',
                '2. Create a Google Cloud Project at https://console.cloud.google.com/',
                '3. Enable Google Drive API for your project',
                '4. Create OAuth 2.0 credentials (Web application)',
                '5. Add your domain to authorized redirect URIs',
                '6. Add Google Drive configuration to config/filesystems.php',
                '7. Set environment variables: GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN',
                '8. Run the Google Drive authorization flow to get refresh token'
            ],
            'config_example' => [
                'google' => [
                    'driver' => 'google',
                    'clientId' => 'env(GOOGLE_DRIVE_CLIENT_ID)',
                    'clientSecret' => 'env(GOOGLE_DRIVE_CLIENT_SECRET)',
                    'refreshToken' => 'env(GOOGLE_DRIVE_REFRESH_TOKEN)',
                    'folderId' => 'env(GOOGLE_DRIVE_FOLDER_ID, null)',
                ]
            ]
        ];
    }
}
