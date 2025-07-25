import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon, 
    EyeIcon,
    ArrowDownTrayIcon,
    DocumentIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function Show({ document }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [publishingDocument, setPublishingDocument] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            success('Success', flash.success);
        }
        if (flash?.error) {
            error('Error', flash.error);
        }
        if (flash?.warning) {
            warning('Warning', flash.warning);
        }
    }, [flash]);

    const confirmDelete = () => {
        setShowDeleteModal(true);
    };

    const deleteDocument = () => {
        setIsDeleting(true);
        router.delete(route('admin.documents.destroy', document.id), {
            onSuccess: () => {
                success('Document Deleted', `"${document.title}" has been deleted successfully.`);
                // Redirect to index after successful deletion
                setTimeout(() => {
                    router.visit(route('admin.documents.index'));
                }, 1500);
            },
            onError: (errors) => {
                error('Delete Failed', 'Failed to delete the document. Please try again.');
            },
            onFinish: () => {
                setIsDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    const togglePublish = () => {
        setPublishingDocument(true);
        
        const routeName = document.published_at 
            ? 'admin.documents.unpublish' 
            : 'admin.documents.publish';
        
        const action = document.published_at ? 'unpublished' : 'published';
        
        router.post(route(routeName, document.id), {}, {
            onSuccess: () => {
                success(
                    `Document ${action.charAt(0).toUpperCase() + action.slice(1)}`, 
                    `"${document.title}" has been ${action} successfully.`
                );
            },
            onError: (errors) => {
                error('Action Failed', `Failed to ${action.replace('ed', '')} the document. Please try again.`);
            },
            onFinish: () => {
                setPublishingDocument(false);
            },
        });
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

    const getStatusBadge = () => {
        if (document.published_at) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    Published
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
                    Draft
                </span>
            );
        }
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
                                    href={route('admin.documents.index')}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Documents
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3">
                                <a
                                    href={route('documents.download', document.id)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                    Download
                                </a>
                                <Link
                                    href={route('admin.documents.edit', document.id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PencilIcon className="h-4 w-4 mr-1" />
                                    Edit
                                </Link>
                                <button
                                    onClick={togglePublish}
                                    disabled={publishingDocument}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        publishingDocument
                                            ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
                                            : document.published_at
                                            ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500'
                                            : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                                    }`}
                                >
                                    {publishingDocument && (
                                        <LoadingSpinner size="sm" className="mr-1" />
                                    )}
                                    {publishingDocument 
                                        ? 'Processing...' 
                                        : document.published_at ? 'Unpublish' : 'Publish'
                                    }
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    Delete
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
                                        {getStatusBadge()}
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
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
                                                    >
                                                        <TagIcon className="h-3 w-3 mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                                    {document.uploader?.name || 'Unknown'}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteDocument}
                title="Delete Document"
                message={`Are you sure you want to delete "${document.title}"? This action cannot be undone and the file will be permanently removed.`}
                confirmText="Delete Document"
                cancelText="Cancel"
                type="danger"
                isProcessing={isDeleting}
                processingText="Deleting..."
            />

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </SidebarLayout>
    );
}
