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
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, HeartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Index({ campaigns, filters }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
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
        router.get(route('admin.fundraising-campaigns.index'), {
            search,
            status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filterType, value) => {
        router.get(route('admin.fundraising-campaigns.index'), {
            search,
            status: filterType === 'status' ? value : status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const confirmDelete = (campaign) => {
        setCampaignToDelete(campaign);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!campaignToDelete) return;

        setIsDeleting(true);
        router.delete(route('admin.fundraising-campaigns.destroy', campaignToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setCampaignToDelete(null);
                success('Success', 'Fundraising campaign deleted successfully');
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

    return (
        <SidebarLayout>
            <Head title="Fundraising Campaigns Management" />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                                <HeartIcon className="h-8 w-8 mr-3 text-red-600" />
                                Fundraising Campaigns
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage fundraising campaigns and donation drives
                            </p>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <Link href={route('admin.fundraising-campaigns.create')}>
                                <PrimaryButton>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Create Campaign
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <TextInput
                                        placeholder="Search campaigns..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <SelectInput
                                        value={status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="paused">Paused</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
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

                    {/* Campaigns Grid */}
                    {campaigns.data && campaigns.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {campaigns.data.map((campaign) => {
                                const progressPercentage = getProgressPercentage(campaign.raised_amount, campaign.goal_amount);
                                return (
                                    <div key={campaign.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                        {campaign.image_path && (
                                            <img 
                                                src={`/storage/${campaign.image_path}`} 
                                                alt={campaign.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {campaign.title}
                                                </h3>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                                {campaign.description.substring(0, 100)}...
                                            </p>
                                            
                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    <span>{formatCurrency(campaign.raised_amount)} raised</span>
                                                    <span>{progressPercentage.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                                        style={{ width: `${progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span>Goal: {formatCurrency(campaign.goal_amount)}</span>
                                                    {campaign.end_date && (
                                                        <span>Ends: {new Date(campaign.end_date).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex space-x-2">
                                                <Link href={route('admin.fundraising-campaigns.show', campaign.id)} className="flex-1">
                                                    <SecondaryButton size="sm" className="w-full">
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        View
                                                    </SecondaryButton>
                                                </Link>
                                                <Link href={route('admin.fundraising-campaigns.edit', campaign.id)} className="flex-1">
                                                    <SecondaryButton size="sm" className="w-full">
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </SecondaryButton>
                                                </Link>
                                                <DangerButton
                                                    size="sm"
                                                    onClick={() => confirmDelete(campaign)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </DangerButton>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-12 text-center">
                                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No campaigns</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Get started by creating a new fundraising campaign.
                                </p>
                                <div className="mt-6">
                                    <Link href={route('admin.fundraising-campaigns.create')}>
                                        <PrimaryButton>
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Create Campaign
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {campaigns.links && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {campaigns.from} to {campaigns.to} of {campaigns.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {campaigns.links.map((link, index) => (
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
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Campaign"
                description={`Are you sure you want to delete "${campaignToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                processing={isDeleting}
            />
        </SidebarLayout>
    );
}
