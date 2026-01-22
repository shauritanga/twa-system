<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class BackupController extends Controller
{
    protected BackupService $backupService;

    public function __construct(BackupService $backupService)
    {
        $this->backupService = $backupService;
    }

    public function index(): Response
    {
        $backups = $this->backupService->listBackups();
        
        return Inertia::render('AdminPortal/Backups', [
            'backups' => $backups,
            'settings' => [
                'auto_backup_enabled' => $this->backupService->isAutoBackupEnabled(),
                'backup_frequency' => $this->backupService->getBackupFrequency(),
            ]
        ]);
    }

    public function create(): JsonResponse
    {
        $result = $this->backupService->createManualBackup();
        
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'backup' => $result['backup_info']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 500);
        }
    }

    public function createDatabase(): JsonResponse
    {
        $result = $this->backupService->createDatabaseBackup();
        
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'backup' => $result['backup_info']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 500);
        }
    }

    public function download(string $filename)
    {
        $download = $this->backupService->downloadBackup($filename);
        
        if ($download) {
            return $download;
        }
        
        return redirect()->back()->withErrors(['backup' => 'Backup file not found']);
    }

    public function delete(string $filename): JsonResponse
    {
        $result = $this->backupService->deleteBackup($filename);
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }

    public function clean(): JsonResponse
    {
        $result = $this->backupService->cleanOldBackups();
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }
}
