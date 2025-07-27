<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class DebugImport extends Command
{
    protected $signature = 'debug:import {file?}';
    protected $description = 'Debug import functionality';

    public function handle()
    {
        $this->info('🔍 Debugging Import System...');
        
        // Check PHP settings
        $this->info('📋 PHP Configuration:');
        $this->line('Upload Max: ' . ini_get('upload_max_filesize'));
        $this->line('Post Max: ' . ini_get('post_max_size'));
        $this->line('Memory Limit: ' . ini_get('memory_limit'));
        $this->line('Max Execution Time: ' . ini_get('max_execution_time'));
        $this->line('Max Input Vars: ' . ini_get('max_input_vars'));
        
        // Check directories
        $this->info('📁 Directory Permissions:');
        $this->line('Storage writable: ' . (is_writable(storage_path()) ? '✅ YES' : '❌ NO'));
        $this->line('Storage/app writable: ' . (is_writable(storage_path('app')) ? '✅ YES' : '❌ NO'));
        $this->line('Temp dir writable: ' . (is_writable(sys_get_temp_dir()) ? '✅ YES' : '❌ NO'));
        
        // Check Laravel Excel
        $this->info('📊 Laravel Excel:');
        try {
            $readers = Excel::getReaders();
            $this->line('Available readers: ' . implode(', ', array_keys($readers)));
            $this->line('Excel package: ✅ Working');
        } catch (\Exception $e) {
            $this->error('Excel package error: ' . $e->getMessage());
        }
        
        // Check database connection
        $this->info('🗄️ Database:');
        try {
            \DB::connection()->getPdo();
            $this->line('Database connection: ✅ Working');
        } catch (\Exception $e) {
            $this->error('Database error: ' . $e->getMessage());
        }
        
        // Test file if provided
        $file = $this->argument('file');
        if ($file && file_exists($file)) {
            $this->info('📄 Testing File: ' . $file);
            try {
                $extension = pathinfo($file, PATHINFO_EXTENSION);
                $this->line('File extension: ' . $extension);
                $this->line('File size: ' . $this->formatBytes(filesize($file)));
                
                if ($extension === 'csv') {
                    $data = array_map('str_getcsv', file($file));
                    $this->line('CSV rows: ' . count($data));
                    $this->line('CSV headers: ' . implode(', ', $data[0] ?? []));
                } else {
                    $collection = Excel::toArray([], $file);
                    $this->line('Excel sheets: ' . count($collection));
                    $this->line('Excel rows: ' . count($collection[0] ?? []));
                    $this->line('Excel headers: ' . implode(', ', $collection[0][0] ?? []));
                }
                
                $this->line('File test: ✅ Readable');
            } catch (\Exception $e) {
                $this->error('File test error: ' . $e->getMessage());
            }
        }
        
        $this->info('🎉 Debug complete!');
    }
    
    private function formatBytes($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
