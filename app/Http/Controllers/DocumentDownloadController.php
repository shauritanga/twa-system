<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentDownloadController extends Controller
{
    /**
     * Download a document
     */
    public function download(Document $document): BinaryFileResponse|Response
    {
        $user = Auth::user();

        // Check if user can view this document
        if (!$document->isVisibleTo($user)) {
            abort(403, 'You do not have permission to download this document.');
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }

        // Increment download count
        $document->incrementDownloadCount();

        // Log download activity
        if ($user) {
            $user->logActivity('document_downloaded', 'Document downloaded', [
                'document_id' => $document->id,
                'document_title' => $document->title,
                'file_name' => $document->file_name,
            ]);
        }

        // Get file path
        $filePath = Storage::disk('public')->path($document->file_path);

        // Return file download response
        return response()->download($filePath, $document->file_name, [
            'Content-Type' => Storage::disk('public')->mimeType($document->file_path),
        ]);
    }

    /**
     * Preview a document (for PDFs and images)
     */
    public function preview(Document $document): Response|BinaryFileResponse
    {
        $user = Auth::user();

        // Check if user can view this document
        if (!$document->isVisibleTo($user)) {
            abort(403, 'You do not have permission to preview this document.');
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }

        // Only allow preview for certain file types
        $previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
        if (!in_array(strtolower($document->file_type), $previewableTypes)) {
            return $this->download($document);
        }

        // Get file path
        $filePath = Storage::disk('public')->path($document->file_path);

        // Return file for preview
        return response()->file($filePath, [
            'Content-Type' => Storage::disk('public')->mimeType($document->file_path),
            'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
        ]);
    }
}
