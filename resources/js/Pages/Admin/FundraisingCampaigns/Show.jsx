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
    HeartIcon,
    CalendarIcon,
    UserIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function Show({ campaign }) {
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
        router.delete(route('admin.fundraising-campaigns.destroy', campaign.id), {
            onSuccess: () => {
                success('Success', 'Campaign deleted successfully');
            },
            onError: () => {
                error('Error', 'Failed to delete campaign');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            paused: 'bg-orange-100 text-orange-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.draft;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getProgressPercentage = (raised, goal) => {
        if (goal <= 0) return 0;
        return Math.min(100, (raised / goal) * 100);
    };

    const progressPercentage = getProgressPercentage(campaign.raised_amount, campaign.goal_amount);

    return (
        <SidebarLayout>
            <Head title={`Campaign: ${campaign.title}`} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Link href={route('admin.fundraising-campaigns.index')}>
                        <SecondaryButton>
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Campaigns
                        </SecondaryButton>
                    </Link>
                    <div className="flex space-x-3">
                        <Link href={route('admin.fundraising-campaigns.edit', campaign.id)}>
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
                    <HeartIcon className="h-8 w-8 mr-3 text-red-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {campaign.title}
                        </h1>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                                {campaign.status}
                            </span>
                            {campaign.is_featured && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fundraising Progress</h2>
                
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{formatCurrency(campaign.raised_amount)} raised</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Goal: {formatCurrency(campaign.goal_amount)}</span>
                        <span>Remaining: {formatCurrency(campaign.goal_amount - campaign.raised_amount)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Raised</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(campaign.raised_amount)}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <BanknotesIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Goal</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(campaign.goal_amount)}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <HeartIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Remaining</p>
                        <p className="text-lg font-bold text-orange-600">{formatCurrency(campaign.goal_amount - campaign.raised_amount)}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Campaign Image */}
                    {campaign.image_path && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <img 
                                src={`/storage/${campaign.image_path}`} 
                                alt={campaign.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {campaign.description}
                            </p>
                        </div>
                    </div>

                    {/* Full Description */}
                    {campaign.full_description && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Full Description</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {campaign.full_description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Video */}
                    {campaign.video_url && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <VideoCameraIcon className="h-5 w-5 mr-2" />
                                Campaign Video
                            </h2>
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={campaign.video_url.replace('watch?v=', 'embed/')}
                                    title={campaign.title}
                                    className="w-full h-64 rounded-lg"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Campaign Details */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Start Date</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(campaign.start_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {campaign.end_date && (
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">End Date</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(campaign.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created By</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {campaign.creator?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(campaign.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    {(campaign.payment_methods && campaign.payment_methods.length > 0) && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h2>
                            <div className="space-y-3">
                                {campaign.payment_methods.includes('bank_transfer') && campaign.bank_details && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <BanknotesIcon className="h-5 w-5 text-blue-600 mr-2" />
                                            <span className="font-medium text-gray-900 dark:text-white">Bank Transfer</span>
                                        </div>
                                        <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {campaign.bank_details}
                                        </pre>
                                    </div>
                                )}

                                {campaign.payment_methods.includes('mobile_money') && campaign.mobile_money_number && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <DevicePhoneMobileIcon className="h-5 w-5 text-green-600 mr-2" />
                                            <span className="font-medium text-gray-900 dark:text-white">Mobile Money</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {campaign.mobile_money_number}
                                        </p>
                                    </div>
                                )}

                                {campaign.payment_methods.includes('cash') && (
                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <div className="flex items-center">
                                            <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                                            <span className="font-medium text-gray-900 dark:text-white">Cash Payment</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Contact us for cash payment arrangements
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Campaign"
                description={`Are you sure you want to delete "${campaign.title}"? This action cannot be undone.`}
                confirmText="Delete"
                processing={isDeleting}
            />
        </SidebarLayout>
    );
}
