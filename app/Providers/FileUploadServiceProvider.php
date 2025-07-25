<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FileUploadServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Set PHP configuration for file uploads globally
        $this->configurePhpForFileUploads();
    }

    /**
     * Configure PHP settings for file uploads
     */
    private function configurePhpForFileUploads(): void
    {
        // Only set if we can modify these settings
        if (function_exists('ini_set')) {
            // File upload settings
            @ini_set('upload_max_filesize', '15M');
            @ini_set('post_max_size', '20M');
            @ini_set('max_file_uploads', '20');

            // Execution settings
            @ini_set('max_execution_time', '300');
            @ini_set('max_input_time', '300');
            @ini_set('memory_limit', '256M');

            // Input settings
            @ini_set('max_input_vars', '3000');
            @ini_set('default_socket_timeout', '300');
        }
    }
}
