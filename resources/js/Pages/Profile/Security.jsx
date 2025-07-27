import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm } from '@inertiajs/react';
import {
    ShieldCheckIcon,
    KeyIcon,
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ProfileSecurity({ user, recentLogins }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Role-specific navigation - no more role detection needed!
    const getDashboardUrl = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return '/admin/dashboard';
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

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const getPasswordUpdateUrl = () => {
        // Determine from current URL path
        if (window.location.pathname.startsWith('/admin/')) {
            return '/admin/profile/password';
        }
        return '/member/profile/password';
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        post(getPasswordUpdateUrl(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            }
        });
    };

    const getDeviceIcon = (userAgent) => {
        if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
            return <DevicePhoneMobileIcon className="w-5 h-5" />;
        }
        return <ComputerDesktopIcon className="w-5 h-5" />;
    };

    const getBrowserName = (userAgent) => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown Browser';
    };

    return (
        <SidebarLayout>
            <div className="p-6 w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <a
                            href={getProfileUrl()}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Profile
                        </a>
                        <span className="text-gray-400">•</span>
                        <a
                            href={getDashboardUrl()}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account security and login sessions</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Change Password */}
                    <div className="xl:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-fit">
                            <div className="flex items-center mb-6">
                                <KeyIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.current_password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.current_password}</p>}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Password Requirements:</h4>
                                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                        <li>• At least 8 characters long</li>
                                        <li>• Contains at least one uppercase letter</li>
                                        <li>• Contains at least one lowercase letter</li>
                                        <li>• Contains at least one number</li>
                                        <li>• Contains at least one special character</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Recent Login Activity */}
                    <div className="xl:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-6">
                                <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Login Activity</h2>
                            </div>

                            <div className="space-y-4">
                                {recentLogins && recentLogins.length > 0 ? (
                                    recentLogins.map((login, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    {getDeviceIcon(login.user_agent)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {getBrowserName(login.user_agent)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {login.ip_address} • {new Date(login.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                                <CheckCircleIcon className="w-5 h-5 mr-1" />
                                                <span className="text-sm font-medium">Successful</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">No recent login activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Tips - Full Width */}
                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200">Security Tips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                            <li>• Use a strong, unique password for your account</li>
                            <li>• Never share your password with anyone</li>
                        </ul>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                            <li>• Log out from shared or public computers</li>
                            <li>• Regularly review your login activity</li>
                        </ul>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                            <li>• Contact support if you notice suspicious activity</li>
                            <li>• Enable two-factor authentication when available</li>
                        </ul>
                    </div>
                </div>
            </div>

        </SidebarLayout>
    );
}
