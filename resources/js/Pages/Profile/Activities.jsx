import React from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Link } from '@inertiajs/react';
import { 
    ClockIcon, 
    ArrowLeftIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    CameraIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    UserPlusIcon,
    CloudArrowUpIcon,
    InformationCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon as PrevIcon
} from '@heroicons/react/24/outline';

export default function ProfileActivities({ activities, auth }) {
    // Role-specific navigation - no more role detection needed!
    const getDashboardUrl = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return '/admin-portal/dashboard';
        }
        return '/member/dashboard';
    };

    const getProfileUrl = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return '/admin/profile';
        }
        return '/member/profile';
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case 'profile_updated':
                return <UserCircleIcon className="w-5 h-5" />;
            case 'password_changed':
                return <ShieldCheckIcon className="w-5 h-5" />;
            case 'avatar_uploaded':
            case 'avatar_removed':
                return <CameraIcon className="w-5 h-5" />;
            case 'login':
            case 'logout':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'contribution_made':
                return <CurrencyDollarIcon className="w-5 h-5" />;
            case 'member_created':
                return <UserPlusIcon className="w-5 h-5" />;
            case 'backup_created':
                return <CloudArrowUpIcon className="w-5 h-5" />;
            case 'preferences_updated':
                return <InformationCircleIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const getActivityColor = (action) => {
        switch (action) {
            case 'profile_updated':
                return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
            case 'password_changed':
                return 'text-green-500 bg-green-100 dark:bg-green-900/20';
            case 'avatar_uploaded':
            case 'avatar_removed':
                return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
            case 'login':
                return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20';
            case 'logout':
                return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
            case 'contribution_made':
                return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20';
            case 'member_created':
                return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20';
            case 'backup_created':
                return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
            case 'preferences_updated':
                return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20';
            default:
                return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    return (
        <SidebarLayout>
            <div className="p-6 w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href={getProfileUrl()}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Profile
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link
                            href={getDashboardUrl()}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Timeline</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Your complete account activity history</p>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    {activities.data && activities.data.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activities.data.map((activity, index) => (
                                <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <div className="flex items-start space-x-4">
                                        {/* Activity Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.action)}`}>
                                            {getActivityIcon(activity.action)}
                                        </div>

                                        {/* Activity Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {activity.description}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                                    {formatDate(activity.created_at)}
                                                </p>
                                            </div>

                                            {/* Activity Metadata */}
                                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {activity.ip_address && (
                                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded mr-2">
                                                            IP: {activity.ip_address}
                                                        </span>
                                                    )}
                                                    {activity.metadata.browser && (
                                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded mr-2">
                                                            {activity.metadata.browser}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Activity Details */}
                                            <div className="mt-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {activity.action.replace('_', ' ')} • {activity.ip_address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Activity Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400">Your account activity will appear here</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {activities.links && activities.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing {activities.from} to {activities.to} of {activities.total} activities
                                </div>
                                <div className="flex items-center space-x-2">
                                    {activities.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity Legend */}
                <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {[
                            { action: 'profile_updated', label: 'Profile Updated' },
                            { action: 'password_changed', label: 'Password Changed' },
                            { action: 'avatar_uploaded', label: 'Photo Updated' },
                            { action: 'login', label: 'Login' },
                            { action: 'contribution_made', label: 'Contribution' },
                            { action: 'backup_created', label: 'Backup Created' },
                            { action: 'preferences_updated', label: 'Settings Updated' },
                            { action: 'member_created', label: 'Member Added' },
                        ].map((item) => (
                            <div key={item.action} className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(item.action)}`}>
                                    {getActivityIcon(item.action)}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
