<?php

namespace App\Http\Controllers;

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

    /**
     * Display backup management page
     * 
     * @return Response
     */
    public function index(): Response
    {
        $backups = $this->backupService->listBackups();
        
        return Inertia::render('Admin/Backups', [
            'backups' => $backups,
            'settings' => [
                'auto_backup_enabled' => $this->backupService->isAutoBackupEnabled(),
                'backup_frequency' => $this->backupService->getBackupFrequency(),
            ]
        ]);
    }

    /**
     * Create a manual backup
     * 
     * @return JsonResponse
     */
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

    /**
     * Create a database-only backup
     * 
     * @return JsonResponse
     */
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

    /**
     * Download a backup file
     * 
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\RedirectResponse
     */
    public function download(string $filename)
    {
        $download = $this->backupService->downloadBackup($filename);
        
        if ($download) {
            return $download;
        }
        
        return redirect()->back()->withErrors(['backup' => 'Backup file not found']);
    }

    /**
     * Delete a backup file
     * 
     * @param string $filename
     * @return JsonResponse
     */
    public function delete(string $filename): JsonResponse
    {
        $result = $this->backupService->deleteBackup($filename);
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }

    /**
     * Clean old backups
     * 
     * @return JsonResponse
     */
    public function clean(): JsonResponse
    {
        $result = $this->backupService->cleanOldBackups();
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }

    /**
     * Get backup list (AJAX)
     * 
     * @return JsonResponse
     */
    public function list(): JsonResponse
    {
        $backups = $this->backupService->listBackups();
        
        return response()->json([
            'success' => true,
            'backups' => $backups
        ]);
    }
}
