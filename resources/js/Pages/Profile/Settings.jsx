import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm } from '@inertiajs/react';
import { 
    CogIcon, 
    BellIcon, 
    ArrowLeftIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    CheckCircleIcon,
    GlobeAltIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function ProfileSettings({ user }) {
    const preferences = user.preferences || {};

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

    const { data, setData, post, processing, errors } = useForm({
        theme: preferences.theme || 'auto',
        notifications: {
            email: preferences.notifications?.email ?? true,
            sms: preferences.notifications?.sms ?? false,
            push: preferences.notifications?.push ?? true,
        },
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile/preferences', {
            preserveScroll: true,
        });
    };

    const themes = [
        { value: 'light', label: 'Light', icon: SunIcon },
        { value: 'dark', label: 'Dark', icon: MoonIcon },
        { value: 'auto', label: 'System', icon: ComputerDesktopIcon },
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'sw', label: 'Swahili' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
    ];

    const timezones = [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'Africa/Dar_es_Salaam', label: 'East Africa Time (EAT)' },
        { value: 'Africa/Nairobi', label: 'East Africa Time (Nairobi)' },
        { value: 'America/New_York', label: 'Eastern Time (US)' },
        { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    ];

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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your account preferences and notifications</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Theme Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center mb-6">
                            <SunIcon className="w-6 h-6 text-yellow-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Preference</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {themes.map((theme) => {
                                const IconComponent = theme.icon;
                                return (
                                    <label
                                        key={theme.value}
                                        className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            data.theme === theme.value
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={theme.value}
                                            checked={data.theme === theme.value}
                                            onChange={(e) => setData('theme', e.target.value)}
                                            className="sr-only"
                                        />
                                        <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
                                        <span className="font-medium text-gray-900 dark:text-white">{theme.label}</span>
                                        {data.theme === theme.value && (
                                            <CheckCircleIcon className="w-5 h-5 text-blue-500 ml-auto" />
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center mb-6">
                            <BellIcon className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 sm:space-y-0">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.notifications.email}
                                        onChange={(e) => setData('notifications', {
                                            ...data.notifications,
                                            email: e.target.checked
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 sm:space-y-0">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.notifications.sms}
                                        onChange={(e) => setData('notifications', {
                                            ...data.notifications,
                                            sms: e.target.checked
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 sm:space-y-0">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.notifications.push}
                                        onChange={(e) => setData('notifications', {
                                            ...data.notifications,
                                            push: e.target.checked
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Language & Region */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center mb-6">
                            <GlobeAltIcon className="w-6 h-6 text-green-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language & Region</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Language
                                </label>
                                <select
                                    value={data.language}
                                    onChange={(e) => setData('language', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Timezone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={data.timezone}
                                    onChange={(e) => setData('timezone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {timezones.map((tz) => (
                                        <option key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                        <a
                            href={getProfileUrl()}
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-center"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Save Preferences
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
