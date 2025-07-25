import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { MagnifyingGlassIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Index({ documents, filters, categories }) {
    const { flash } = usePage().props;
    const { toasts, success, error, info, removeToast } = useToast();

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
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
        router.get(route('member.documents.index'), {
            search,
            category,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filterType, value) => {
        router.get(route('member.documents.index'), {
            search,
            category: filterType === 'category' ? value : category,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes >= 1073741824) {
            return (bytes / 1073741824).toFixed(2) + ' GB';
        } else if (bytes >= 1048576) {
            return (bytes / 1048576).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return bytes + ' bytes';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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

        // Simulate download completion (since we can't track actual download)
        setTimeout(() => {
            setDownloadingDocuments(prev => {
                const newSet = new Set(prev);
                newSet.delete(documentId);
                return newSet;
            });
            success('Download Complete', `"${document.title}" has been downloaded successfully.`);
        }, 1500);
    };

    return (
        <SidebarLayout>
            <Head title="Documents" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            Documents
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Access group documents, meeting minutes, and important files
                        </p>
                    </div>

                    {/* Quick Category Links */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {Object.entries(categories).map(([key, label]) => (
                                <Link
                                    key={key}
                                    href={route('member.documents.category', key)}
                                    className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                                >
                                    <div className="text-2xl mb-2">
                                        {key === 'meeting_minutes' && '📋'}
                                        {key === 'policies' && '📜'}
                                        {key === 'procedures' && '📝'}
                                        {key === 'financial_reports' && '📊'}
                                        {key === 'legal_documents' && '⚖️'}
                                        {key === 'forms' && '📄'}
                                        {key === 'announcements' && '📢'}
                                        {key === 'other' && '📁'}
                                    </div>
                                    <span className="text-xs text-center text-gray-600 dark:text-gray-400">
                                        {label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Documents
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by title or description..."
                                            className="pl-10"
                                        />
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <SelectInput
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            handleFilterChange('category', e.target.value);
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        {Object.entries(categories).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.data.length === 0 ? (
                            <div className="col-span-full">
                                <div className="text-center py-12">
                                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {search || category ? 'Try adjusting your search criteria.' : 'No documents have been uploaded yet.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            documents.data.map((document) => (
                                <div key={document.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        {/* Document Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="text-3xl mr-3">
                                                    {document.file_icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                                                        {document.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {document.category_display}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Document Description */}
                                        {document.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                                {document.description}
                                            </p>
                                        )}

                                        {/* Document Meta */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">File:</span>
                                                <span className="ml-1">{document.file_name}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">Size:</span>
                                                <span className="ml-1">{formatFileSize(document.file_size)}</span>
                                            </div>
                                            {document.document_date && (
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">Date:</span>
                                                    <span className="ml-1">{formatDate(document.document_date)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">Uploaded:</span>
                                                <span className="ml-1">{formatDate(document.created_at)}</span>
                                            </div>
                                            {document.download_count > 0 && (
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
                                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${downloadingDocuments.has(document.id)
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
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
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
