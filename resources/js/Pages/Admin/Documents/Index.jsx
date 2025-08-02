import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ documents, filters, categories, statuses }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [publishingDocuments, setPublishingDocuments] = useState(new Set());

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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.documents.index'), {
            search,
            category,
            status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filterType, value) => {
        router.get(route('admin.documents.index'), {
            search,
            category: filterType === 'category' ? value : category,
            status: filterType === 'status' ? value : status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const confirmDelete = (document) => {
        setDocumentToDelete(document);
        setShowDeleteModal(true);
    };

    const deleteDocument = () => {
        if (!documentToDelete) return;

        setIsDeleting(true);
        router.delete(route('admin.documents.destroy', documentToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDocumentToDelete(null);
                success('Document Deleted', `"${documentToDelete.title}" has been deleted successfully.`);
            },
            onError: (errors) => {
                error('Delete Failed', 'Failed to delete the document. Please try again.');
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const togglePublish = (document) => {
        const documentId = document.id;
        setPublishingDocuments(prev => new Set(prev).add(documentId));

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
                setPublishingDocuments(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(documentId);
                    return newSet;
                });
            },
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

    const getStatusBadge = (document) => {
        if (document.status === 'draft') {
            return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Draft</span>;
        } else if (document.status === 'archived') {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Archived</span>;
        } else if (!document.published_at) {
            return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Unpublished</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Published</span>;
        }
    };

    return (
        <SidebarLayout>
            <Head title="Document Management" />
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                                Document Management
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage group documents, meeting minutes, and policies
                            </p>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <Link href={route('admin.documents.create')}>
                                <PrimaryButton>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Upload Document
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search documents..."
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <SelectInput
                                        value={status}
                                        onChange={(e) => {
                                            setStatus(e.target.value);
                                            handleFilterChange('status', e.target.value);
                                        }}
                                    >
                                        <option value="">All Statuses</option>
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </SelectInput>
                                </div>

                                <div className="flex items-end">
                                    <PrimaryButton type="submit" className="w-full">
                                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                        Search
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Documents Table */}
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Document
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Uploaded By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {documents.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-lg font-medium">No documents found</p>
                                                    <p className="text-sm">Upload your first document to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        documents.data.map((document) => (
                                            <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="text-2xl mr-3">
                                                            {document.file_icon}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {document.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {document.file_name} • {formatFileSize(document.file_size)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-200">
                                                        {document.category_display}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(document)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {document.uploader?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(document.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('admin.documents.show', document.id)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.documents.edit', document.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => togglePublish(document)}
                                                            disabled={publishingDocuments.has(document.id)}
                                                            className={`text-sm px-2 py-1 rounded flex items-center space-x-1 ${publishingDocuments.has(document.id)
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : document.published_at
                                                                    ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400'
                                                                    : 'text-green-600 hover:text-green-900 dark:text-green-400'
                                                                }`}
                                                        >
                                                            {publishingDocuments.has(document.id) && (
                                                                <LoadingSpinner size="sm" />
                                                            )}
                                                            <span>
                                                                {publishingDocuments.has(document.id)
                                                                    ? 'Processing...'
                                                                    : document.published_at ? 'Unpublish' : 'Publish'
                                                                }
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(document)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {documents.links && documents.links.length > 3 && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {documents.prev_page_url && (
                                            <Link
                                                href={documents.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {documents.next_page_url && (
                                            <Link
                                                href={documents.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing <span className="font-medium">{documents.from}</span> to{' '}
                                                <span className="font-medium">{documents.to}</span> of{' '}
                                                <span className="font-medium">{documents.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {documents.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            } ${index === 0 ? 'rounded-l-md' : ''
                                                            } ${index === documents.links.length - 1 ? 'rounded-r-md' : ''
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteDocument}
                title="Delete Document"
                message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone and the file will be permanently removed.`}
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
