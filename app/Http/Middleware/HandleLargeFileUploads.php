<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Symfony\Component\HttpFoundation\Response;

class HandleLargeFileUploads
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the request is too large before processing
        $maxPostSize = $this->getMaxPostSize();
        $contentLength = $request->server('CONTENT_LENGTH');

        if ($contentLength && $contentLength > $maxPostSize) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'The uploaded file is too large.',
                    'errors' => [
                        'file' => ['The file size exceeds the maximum allowed size of ' . $this->formatBytes($maxPostSize) . '.']
                    ]
                ], 413);
            }

            return back()->withErrors([
                'file' => 'The file size exceeds the maximum allowed size of ' . $this->formatBytes($maxPostSize) . '. Please choose a smaller file.'
            ])->withInput();
        }

        try {
            return $next($request);
        } catch (PostTooLargeException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'The uploaded file is too large.',
                    'errors' => [
                        'file' => ['The file size exceeds the server limit. Please choose a smaller file.']
                    ]
                ], 413);
            }

            return back()->withErrors([
                'file' => 'The uploaded file is too large. Please choose a smaller file and try again.'
            ])->withInput();
        }
    }

    /**
     * Get the maximum post size in bytes
     */
    private function getMaxPostSize(): int
    {
        $postMaxSize = ini_get('post_max_size');
        return $this->parseSize($postMaxSize);
    }

    /**
     * Parse size string to bytes
     */
    private function parseSize(string $size): int
    {
        $size = trim($size);
        $last = strtolower($size[strlen($size) - 1]);
        $size = (int) $size;

        switch ($last) {
            case 'g':
                $size *= 1024;
            case 'm':
                $size *= 1024;
            case 'k':
                $size *= 1024;
        }

        return $size;
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
