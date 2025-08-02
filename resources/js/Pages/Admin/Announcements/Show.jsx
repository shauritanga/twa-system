import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon, 
    SpeakerWaveIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    GlobeAltIcon,
    LinkIcon,
    PhotoIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function Show({ announcement }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            success('Success', flash.success);
        }
        if (flash?.error) {
            error('Error', flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.announcements.destroy', announcement.id), {
            onSuccess: () => {
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
            <Head title={`Announcement: ${announcement.title}`} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Link href={route('admin.announcements.index')}>
                        <SecondaryButton>
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Announcements
                        </SecondaryButton>
                    </Link>
                    <div className="flex space-x-3">
                        <Link href={route('admin.announcements.edit', announcement.id)}>
                            <PrimaryButton>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                            </PrimaryButton>
                        </Link>
                        <DangerButton onClick={() => setShowDeleteModal(true)}>
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </DangerButton>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <SpeakerWaveIcon className="h-8 w-8 mr-3 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {announcement.title}
                        </h1>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                                {announcement.type}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(announcement.status)}`}>
                                {announcement.status}
                            </span>
                            {announcement.is_featured && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {announcement.content}
                            </p>
                        </div>

                        {/* Media Section */}
                        {announcement.media_type !== 'none' && (
                            <div className="mt-6">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Media</h3>
                                
                                {announcement.media_type === 'image' && announcement.image_path && (
                                    <div className="space-y-2">
                                        <img 
                                            src={`/storage/${announcement.image_path}`} 
                                            alt={announcement.image_alt_text || announcement.title}
                                            className="max-w-full h-auto rounded-lg shadow-md"
                                        />
                                        {announcement.image_alt_text && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {announcement.image_alt_text}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {announcement.media_type === 'video' && announcement.video_path && (
                                    <video 
                                        controls 
                                        className="max-w-full h-auto rounded-lg shadow-md"
                                    >
                                        <source src={`/storage/${announcement.video_path}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}

                                {announcement.media_type === 'video_url' && announcement.video_url && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        <iframe
                                            src={announcement.video_url.replace('watch?v=', 'embed/')}
                                            title={announcement.title}
                                            className="w-full h-64 rounded-lg shadow-md"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Call to Action */}
                        {announcement.link_url && announcement.link_text && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                    <LinkIcon className="h-5 w-5 mr-2" />
                                    Call to Action
                                </h3>
                                <a 
                                    href={announcement.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {announcement.link_text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Details */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Announcement Date</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(announcement.announcement_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {announcement.expires_at && (
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Expires At</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(announcement.expires_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created By</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {announcement.creator?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sort Order</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {announcement.sort_order}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(announcement.updated_at).toLocaleDateString()}
                                    </p>
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
                onConfirm={handleDelete}
                title="Delete Announcement"
                description={`Are you sure you want to delete "${announcement.title}"? This action cannot be undone.`}
                confirmText="Delete"
                processing={isDeleting}
            />
        </SidebarLayout>
    );
}
