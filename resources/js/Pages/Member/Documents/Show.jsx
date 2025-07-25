import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { 
    ArrowLeftIcon, 
    ArrowDownTrayIcon,
    DocumentIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    GlobeAltIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function Show({ document }) {
    const { flash } = usePage().props;
    const { toasts, success, error, info, removeToast } = useToast();
    
    const [isDownloading, setIsDownloading] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            success('Success', flash.success);
        }
        if (flash?.error) {
            error('Error', flash.error);
        }
        if (flash?.info) {
            info('Info', flash.info);
        }
    }, [flash]);

    const handleDownload = () => {
        setIsDownloading(true);
        
        // Show download started message
        info('Download Started', `Downloading "${document.title}"...`);
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = route('documents.download', document.id);
        link.download = document.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Simulate download completion
        setTimeout(() => {
            setIsDownloading(false);
            success('Download Complete', `"${document.title}" has been downloaded successfully.`);
        }, 1500);
    };

    const getFileIcon = (fileType) => {
        const type = fileType?.toLowerCase();
        switch (type) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📋';
            case 'txt':
                return '📃';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return '🖼️';
            default:
                return '📁';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SidebarLayout>
            <Head title={`Document: ${document.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('member.documents.index')}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Documents
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        isDownloading
                                            ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
                                            : 'text-white bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {isDownloading ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                    )}
                                    {isDownloading ? 'Downloading...' : 'Download'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Document Details */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {document.title}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-2">{getFileIcon(document.file_type)}</span>
                                            <span>{document.file_name}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{formatFileSize(document.file_size)}</span>
                                        <span>•</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                                            {document.category_display}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Description */}
                                    {document.description && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                                Description
                                            </h3>
                                            <div className="prose dark:prose-invert max-w-none">
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {document.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {document.tags && document.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                                Tags
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {document.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                    >
                                                        <TagIcon className="h-3 w-3 mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Download Action */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                    Ready to Download
                                                </h4>
                                                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                                                    Click the download button to save this document to your device.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleDownload}
                                                disabled={isDownloading}
                                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                    isDownloading
                                                        ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
                                                        : 'text-white bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            >
                                                {isDownloading ? (
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                ) : (
                                                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                                )}
                                                {isDownloading ? 'Downloading...' : 'Download'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Document Info */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                            Document Information
                                        </h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    Category
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {document.category_display}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    Visibility
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                                                    {document.visibility_display}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    Uploaded By
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                                    <UserIcon className="h-4 w-4 mr-1" />
                                                    {document.uploader?.name || 'System'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    Upload Date
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    {formatDate(document.created_at)}
                                                </dd>
                                            </div>
                                            {document.document_date && (
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                        Document Date
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                                        {formatDate(document.document_date)}
                                                    </dd>
                                                </div>
                                            )}
                                            {document.download_count > 0 && (
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                        Downloads
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {document.download_count} times
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    {/* File Details */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                            File Details
                                        </h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    File Name
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                                                    {document.file_name}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    File Type
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {document.file_type?.toUpperCase()}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    File Size
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {formatFileSize(document.file_size)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </SidebarLayout>
    );
}
