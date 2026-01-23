import React from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { Link } from '@inertiajs/react';
import { 
    UserCircleIcon, 
    PencilIcon, 
    MapPinIcon, 
    PhoneIcon, 
    EnvelopeIcon,
    CalendarIcon,
    ShieldCheckIcon,
    CogIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ProfileShow({ user, recentActivities, profileCompletion, isProfileComplete }) {
    // Role-specific navigation - no more role detection needed!
    const getDashboardUrl = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return '/admin-portal/dashboard';
        }
        return '/member/dashboard';
    };

    const getDashboardLabel = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return 'Admin Dashboard';
        }
        return 'Member Dashboard';
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case 'profile_updated':
                return <UserCircleIcon className="w-5 h-5" />;
            case 'password_changed':
                return <ShieldCheckIcon className="w-5 h-5" />;
            case 'avatar_uploaded':
                return <UserCircleIcon className="w-5 h-5" />;
            case 'login':
                return <CheckCircleIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const getActivityColor = (action) => {
        switch (action) {
            case 'profile_updated':
                return 'text-blue-500';
            case 'password_changed':
                return 'text-green-500';
            case 'avatar_uploaded':
                return 'text-purple-500';
            case 'login':
                return 'text-emerald-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <SidebarLayout>
            <div className="p-6 w-full">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link
                            href={getDashboardUrl()}
                            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                        >
                            {getDashboardLabel()}
                        </Link>
                        <span>›</span>
                        <span className="text-gray-900 dark:text-white font-medium">Profile</span>
                    </nav>
                </div>

                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <Link
                                        href="/profile/edit"
                                        className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                                    >
                                        <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </Link>
                                </div>
                                <div className="text-white">
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    <p className="text-blue-100 text-lg capitalize">{user.role?.name || 'Member'}</p>
                                    <p className="text-blue-200 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Link
                                    href="/profile/edit"
                                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <PencilIcon className="w-5 h-5 mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profile Completion */}
                    {!isProfileComplete && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-3" />
                                <div className="flex-1">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Your profile is {profileCompletion}% complete. 
                                        <Link href="/profile/edit" className="font-medium underline ml-1">
                                            Complete your profile
                                        </Link>
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-32 bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${profileCompletion}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Personal Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                                <Link
                                    href="/profile/edit"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                                >
                                    Edit
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                                        </div>
                                    </div>

                                    {user.phone && (
                                        <div className="flex items-center space-x-3">
                                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {user.date_of_birth && (
                                        <div className="flex items-center space-x-3">
                                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(user.date_of_birth).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {user.full_address && (
                                        <div className="flex items-start space-x-3">
                                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.full_address}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                {user.role?.name || 'Member'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {user.bio && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</h3>
                                    <p className="text-gray-900 dark:text-white">{user.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/profile/edit"
                                    className="flex items-center w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                >
                                    <PencilIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Edit Profile</span>
                                </Link>
                                <Link
                                    href="/profile/security"
                                    className="flex items-center w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                >
                                    <ShieldCheckIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Security Settings</span>
                                </Link>
                                <Link
                                    href="/profile/settings"
                                    className="flex items-center w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                >
                                    <CogIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-900 dark:text-white">Account Settings</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                                <Link
                                    href="/profile/activities"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.slice(0, 5).map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className={`${getActivityColor(activity.action)} mt-0.5`}>
                                                {getActivityIcon(activity.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(activity.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
