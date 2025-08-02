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
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function Index({ announcements, filters }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const [search, setSearch] = useState(filters?.search || '');
    const [type, setType] = useState(filters?.type || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        router.get(route('admin.announcements.index'), {
            search,
            type,
            status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filterType, value) => {
        router.get(route('admin.announcements.index'), {
            search,
            type: filterType === 'type' ? value : type,
            status: filterType === 'status' ? value : status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const confirmDelete = (announcement) => {
        setAnnouncementToDelete(announcement);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!announcementToDelete) return;

        setIsDeleting(true);
        router.delete(route('admin.announcements.destroy', announcementToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setAnnouncementToDelete(null);
                success('Success', 'Announcement deleted successfully');
            },
            onError: () => {
                error('Error', 'Failed to delete announcement');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const getTypeColor = (type) => {
        const colors = {
            important: 'bg-red-100 text-red-800',
            event: 'bg-blue-100 text-blue-800',
            update: 'bg-yellow-100 text-yellow-800',
            general: 'bg-gray-100 text-gray-800',
        };
        return colors[type] || colors.general;
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            draft: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || colors.draft;
    };

    return (
        <SidebarLayout>
            <Head title="Announcements Management" />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                                <SpeakerWaveIcon className="h-8 w-8 mr-3 text-blue-600" />
                                Announcements Management
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage website announcements and notifications
                            </p>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <Link href={route('admin.announcements.create')}>
                                <PrimaryButton>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Create Announcement
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <TextInput
                                        placeholder="Search announcements..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <SelectInput
                                        value={type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">All Types</option>
                                        <option value="important">Important</option>
                                        <option value="event">Event</option>
                                        <option value="update">Update</option>
                                        <option value="general">General</option>
                                    </SelectInput>
                                </div>
                                <div>
                                    <SelectInput
                                        value={status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </SelectInput>
                                </div>
                                <div>
                                    <PrimaryButton type="submit" className="w-full">
                                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                        Search
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Announcements Table */}
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {announcements.data && announcements.data.length > 0 ? (
                                        announcements.data.map((announcement) => (
                                            <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {announcement.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {announcement.content.substring(0, 100)}...
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                                                        {announcement.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(announcement.status)}`}>
                                                        {announcement.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(announcement.announcement_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link href={route('admin.announcements.show', announcement.id)}>
                                                            <SecondaryButton size="sm">
                                                                <EyeIcon className="h-4 w-4" />
                                                            </SecondaryButton>
                                                        </Link>
                                                        <Link href={route('admin.announcements.edit', announcement.id)}>
                                                            <SecondaryButton size="sm">
                                                                <PencilIcon className="h-4 w-4" />
                                                            </SecondaryButton>
                                                        </Link>
                                                        <DangerButton
                                                            size="sm"
                                                            onClick={() => confirmDelete(announcement)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </DangerButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No announcements</h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Get started by creating a new announcement.
                                                </p>
                                                <div className="mt-6">
                                                    <Link href={route('admin.announcements.create')}>
                                                        <PrimaryButton>
                                                            <PlusIcon className="h-4 w-4 mr-2" />
                                                            Create Announcement
                                                        </PrimaryButton>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {announcements.links && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {announcements.from} to {announcements.to} of {announcements.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {announcements.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Announcement"
                description={`Are you sure you want to delete "${announcementToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                processing={isDeleting}
            />
        </SidebarLayout>
    );
}
