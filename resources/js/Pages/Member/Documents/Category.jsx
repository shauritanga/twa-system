import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { 
    ArrowLeftIcon,
    MagnifyingGlassIcon, 
    DocumentIcon, 
    EyeIcon, 
    ArrowDownTrayIcon,
    TagIcon,
    CalendarIcon,
    UserIcon
} from '@heroicons/react/24/outline';

export default function Category({ documents, category, categoryName, categories }) {
    const { flash } = usePage().props;
    const { toasts, success, error, info, removeToast } = useToast();
    
    const [search, setSearch] = useState('');
    const [downloadingDocuments, setDownloadingDocuments] = useState(new Set());

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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('member.documents.category', category), {
            search,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDownload = (document) => {
        const documentId = document.id;
        setDownloadingDocuments(prev => new Set(prev).add(documentId));
        
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
            setDownloadingDocuments(prev => {
                const newSet = new Set(prev);
                newSet.delete(documentId);
                return newSet;
            });
            success('Download Complete', `"${document.title}" has been downloaded successfully.`);
        }, 1500);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getCategoryIcon = (categoryKey) => {
        switch (categoryKey) {
            case 'meeting_minutes': return '📋';
            case 'policies': return '📜';
            case 'procedures': return '📝';
            case 'financial_reports': return '📊';
            case 'legal_documents': return '⚖️';
            case 'forms': return '📄';
            case 'announcements': return '📢';
            case 'other': return '📁';
            default: return '📁';
        }
    };

    return (
        <SidebarLayout>
            <Head title={`${categoryName} Documents`} />

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
                                    Back to All Documents
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-3">
                            <span className="text-3xl">{getCategoryIcon(category)}</span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {categoryName}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Browse documents in the {categoryName.toLowerCase()} category
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        placeholder={`Search ${categoryName.toLowerCase()}...`}
                                        className="pl-10 block w-full"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <PrimaryButton type="submit">
                                Search
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.data.length === 0 ? (
                            <div className="col-span-full">
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">{getCategoryIcon(category)}</span>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        No {categoryName.toLowerCase()} found
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {search ? 'Try adjusting your search criteria.' : `No ${categoryName.toLowerCase()} have been uploaded yet.`}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            documents.data.map((document) => (
                                <div key={document.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        {/* Document Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    {document.title}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    <span className="font-medium">File:</span>
                                                    <span className="ml-1">{document.file_name}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatFileSize(document.file_size)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {document.description && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                                    {document.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <UserIcon className="h-4 w-4 mr-1" />
                                                <span className="font-medium">Uploaded by:</span>
                                                <span className="ml-1">{document.uploader?.name || 'System'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                <span className="font-medium">Uploaded:</span>
                                                <span className="ml-1">{formatDate(document.created_at)}</span>
                                            </div>
                                            {document.download_count > 0 && (
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                                    <span className="font-medium">Downloads:</span>
                                                    <span className="ml-1">{document.download_count}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        {document.tags && document.tags.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {document.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                        >
                                                            <TagIcon className="h-3 w-3 mr-1" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {document.tags.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                            +{document.tags.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route('member.documents.show', document.id)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                                >
                                                    <EyeIcon className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDownload(document)}
                                                    disabled={downloadingDocuments.has(document.id)}
                                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                        downloadingDocuments.has(document.id)
                                                            ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
                                                            : 'text-white bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {downloadingDocuments.has(document.id) ? (
                                                        <LoadingSpinner size="sm" className="mr-1" />
                                                    ) : (
                                                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                                    )}
                                                    {downloadingDocuments.has(document.id) ? 'Downloading...' : 'Download'}
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {document.visibility_display}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {documents.links && documents.links.length > 3 && (
                        <div className="mt-8 flex items-center justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {documents.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                        } ${index === 0 ? 'rounded-l-md' : ''
                                        } ${index === documents.links.length - 1 ? 'rounded-r-md' : ''
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </SidebarLayout>
    );
}
