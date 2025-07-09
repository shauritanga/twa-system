import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { usePage, router } from '@inertiajs/react';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import {
    ArchiveBoxIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
    BellIcon,
    ShieldCheckIcon,
    CloudArrowUpIcon,
    WrenchScrewdriverIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentDuplicateIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import { LiaCoinsSolid } from "react-icons/lia";

const Settings = () => {
    const { settings, recentLogins, systemStats } = usePage().props;
    const [monthlyContribution, setMonthlyContribution] = useState(settings.monthly_contribution_amount ? settings.monthly_contribution_amount.value : 50000);
    const [penaltyRate, setPenaltyRate] = useState(settings.penalty_percentage_rate ? settings.penalty_percentage_rate.value : 10);
    const [applyToExisting, setApplyToExisting] = useState(settings.apply_penalty_to_existing ? settings.apply_penalty_to_existing.value === '1' : false);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Individual loading states for each section
    const [isSecuritySaving, setIsSecuritySaving] = useState(false);
    const [isSystemSaving, setIsSystemSaving] = useState(false);
    const [isBackupSaving, setIsBackupSaving] = useState(false);
    const [isMaintenanceSaving, setIsMaintenanceSaving] = useState(false);
    const [isManualBackupRunning, setIsManualBackupRunning] = useState(false);

    // Individual messages for each section
    const [securityMessage, setSecurityMessage] = useState('');
    const [systemMessage, setSystemMessage] = useState('');
    const [backupMessage, setBackupMessage] = useState('');
    const [maintenanceMessage, setMaintenanceMessage] = useState('');

    // Email Settings
    const [emailNewMember, setEmailNewMember] = useState(settings.email_new_member ? settings.email_new_member.value === '1' : true);
    const [emailContributionReminder, setEmailContributionReminder] = useState(settings.email_contribution_reminder ? settings.email_contribution_reminder.value === '1' : true);
    const [emailPenaltyNotice, setEmailPenaltyNotice] = useState(settings.email_penalty_notice ? settings.email_penalty_notice.value === '1' : true);
    const [emailSystemAlerts, setEmailSystemAlerts] = useState(settings.email_system_alerts ? settings.email_system_alerts.value === '1' : true);
    const [emailBackupReports, setEmailBackupReports] = useState(settings.email_backup_reports ? settings.email_backup_reports.value === '1' : false);

    // Admin Settings
    const [allowAdminAssignment, setAllowAdminAssignment] = useState(settings.allow_admin_assignment ? settings.allow_admin_assignment.value === '1' : true);

    // Backup Settings
    const [autoBackup, setAutoBackup] = useState(settings.auto_backup ? settings.auto_backup.value === '1' : false);
    const [backupFrequency, setBackupFrequency] = useState(settings.backup_frequency ? settings.backup_frequency.value : 'weekly');
    const [backupRetentionDays, setBackupRetentionDays] = useState(settings.backup_retention_days ? settings.backup_retention_days.value : 30);
    const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode ? settings.maintenance_mode.value === '1' : false);

    // Security Settings
    const [sessionTimeout, setSessionTimeout] = useState(settings.session_timeout_minutes ? settings.session_timeout_minutes.value : 120);
    const [maxLoginAttempts, setMaxLoginAttempts] = useState(settings.max_login_attempts ? settings.max_login_attempts.value : 5);
    const [requireEmailVerification, setRequireEmailVerification] = useState(settings.require_email_verification ? settings.require_email_verification.value === '1' : true);
    const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(settings.enable_two_factor_auth ? settings.enable_two_factor_auth.value === '1' : false);

    // System Settings
    const [systemTimezone, setSystemTimezone] = useState(settings.system_timezone ? settings.system_timezone.value : 'Africa/Dar_es_Salaam');
    const [dateFormat, setDateFormat] = useState(settings.date_format ? settings.date_format.value : 'Y-m-d');
    const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol ? settings.currency_symbol.value : 'TZS');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(route('admin.settings.update'), {
            monthly_contribution_amount: monthlyContribution,
            penalty_percentage_rate: penaltyRate,
            apply_penalty_to_existing: applyToExisting ? 1 : 0,
            email_new_member: emailNewMember ? 1 : 0,
            email_contribution_reminder: emailContributionReminder ? 1 : 0,
            email_penalty_notice: emailPenaltyNotice ? 1 : 0,
            email_system_alerts: emailSystemAlerts ? 1 : 0,
            email_backup_reports: emailBackupReports ? 1 : 0,
        }, {
            onSuccess: () => {
                setMessage('Financial settings updated successfully.');
                setIsSaving(false);
                setTimeout(() => setMessage(''), 3000);
            },
            onError: () => {
                setMessage('Failed to update financial settings. Please check the values.');
                setIsSaving(false);
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    const handleSecuritySubmit = (e) => {
        e.preventDefault();
        setIsSecuritySaving(true);
        router.post(route('admin.settings.update'), {
            session_timeout_minutes: sessionTimeout,
            max_login_attempts: maxLoginAttempts,
            require_email_verification: requireEmailVerification ? 1 : 0,
            enable_two_factor_auth: enableTwoFactorAuth ? 1 : 0,
            allow_admin_assignment: allowAdminAssignment ? 1 : 0,
        }, {
            onSuccess: () => {
                setSecurityMessage('Security settings updated successfully.');
                setIsSecuritySaving(false);
                setTimeout(() => setSecurityMessage(''), 3000);
            },
            onError: () => {
                setSecurityMessage('Failed to update security settings. Please check the values.');
                setIsSecuritySaving(false);
                setTimeout(() => setSecurityMessage(''), 3000);
            }
        });
    };

    const handleSystemSubmit = (e) => {
        e.preventDefault();
        setIsSystemSaving(true);
        router.post(route('admin.settings.update'), {
            system_timezone: systemTimezone,
            date_format: dateFormat,
            currency_symbol: currencySymbol,
        }, {
            onSuccess: () => {
                setSystemMessage('System configuration updated successfully.');
                setIsSystemSaving(false);
                setTimeout(() => setSystemMessage(''), 3000);
            },
            onError: () => {
                setSystemMessage('Failed to update system configuration. Please check the values.');
                setIsSystemSaving(false);
                setTimeout(() => setSystemMessage(''), 3000);
            }
        });
    };

    const handleBackupSubmit = (e) => {
        e.preventDefault();
        setIsBackupSaving(true);
        router.post(route('admin.settings.update'), {
            auto_backup: autoBackup ? 1 : 0,
            backup_frequency: backupFrequency,
            backup_retention_days: backupRetentionDays,
        }, {
            onSuccess: () => {
                setBackupMessage('Backup settings updated successfully.');
                setIsBackupSaving(false);
                setTimeout(() => setBackupMessage(''), 3000);
            },
            onError: () => {
                setBackupMessage('Failed to update backup settings. Please check the values.');
                setIsBackupSaving(false);
                setTimeout(() => setBackupMessage(''), 3000);
            }
        });
    };

    const handleMaintenanceSubmit = (e) => {
        e.preventDefault();
        setIsMaintenanceSaving(true);
        router.post(route('admin.settings.update'), {
            maintenance_mode: maintenanceMode ? 1 : 0,
        }, {
            onSuccess: () => {
                setMaintenanceMessage('Maintenance settings updated successfully.');
                setIsMaintenanceSaving(false);
                setTimeout(() => setMaintenanceMessage(''), 3000);
            },
            onError: () => {
                setMaintenanceMessage('Failed to update maintenance settings. Please check the values.');
                setIsMaintenanceSaving(false);
                setTimeout(() => setMaintenanceMessage(''), 3000);
            }
        });
    };

    const handleManualBackup = () => {
        setIsManualBackupRunning(true);
        router.post(route('admin.settings.backup'), {}, {
            onSuccess: () => {
                setBackupMessage('Manual backup completed successfully.');
                setIsManualBackupRunning(false);
                setTimeout(() => setBackupMessage(''), 5000);
            },
            onError: (errors) => {
                setBackupMessage('Manual backup failed. Please try again.');
                setIsManualBackupRunning(false);
                setTimeout(() => setBackupMessage(''), 5000);
                console.error('Backup error:', errors);
            }
        });
    };

    return (
        <SidebarLayout>
            {/* Professional Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl mb-8 overflow-hidden">
                <div className="px-8 py-12 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                                <Cog6ToothIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">System Settings</h1>
                                <p className="text-white/80 text-lg">Configure and manage your system preferences</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-300 mr-2" />
                                <span className="text-white text-sm font-medium">System Online</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <ShieldCheckIcon className="w-5 h-5 text-blue-300 mr-2" />
                                <span className="text-white text-sm font-medium">Security Active</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <ClockIcon className="w-5 h-5 text-yellow-300 mr-2" />
                                <span className="text-white text-sm font-medium">Auto-Backup Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Toast Notification */}
            {message && (
                <div className={`fixed top-4 right-4 p-4 text-sm text-white rounded-xl shadow-2xl z-50 animate-fade-in-out backdrop-blur-sm border ${
                    message.includes('successfully')
                        ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-400'
                        : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400'
                }`}>
                    <div className="flex items-center">
                        {message.includes('successfully') ? (
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                        ) : (
                            <XCircleIcon className="w-5 h-5 mr-2" />
                        )}
                        {message}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Enhanced System Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-500 rounded-lg mr-3">
                                <CpuChipIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Performance</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Performance Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Users</p>
                                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{systemStats?.total_users || 0}</p>
                                        </div>
                                        <UserCircleIcon className="w-8 h-8 text-green-500" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Online Users</p>
                                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{systemStats?.online_users || 0}</p>
                                        </div>
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Verified Members</p>
                                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{systemStats?.verified_members || 0}</p>
                                        </div>
                                        <ShieldCheckIcon className="w-8 h-8 text-purple-500" />
                                    </div>
                                </div>
                            </div>

                            {/* System Resources */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Database Size</p>
                                            <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{systemStats?.database_size || 0} MB</p>
                                        </div>
                                        <CpuChipIcon className="w-8 h-8 text-orange-500" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Storage Used</p>
                                            <p className="text-xl font-bold text-teal-700 dark:text-teal-300">{systemStats?.storage_used || 0} MB</p>
                                        </div>
                                        <CloudArrowUpIcon className="w-8 h-8 text-teal-500" />
                                    </div>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Connection</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connected</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cache System</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Service</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Operational</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Recent Logins */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-500 rounded-lg mr-3">
                                <UserCircleIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentLogins && recentLogins.length > 0 ? (
                            <div className="space-y-4">
                                {recentLogins.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl hover:shadow-md transition-all duration-200">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.formatted_last_login || 'Never'}
                                                    </p>
                                                    <div className="flex items-center justify-end mt-1">
                                                        {user.is_online ? (
                                                            <>
                                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Offline</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <UserCircleIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No recent login data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Financial Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-500 rounded-lg mr-3">
                            <LiaCoinsSolid className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Configuration</h2>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Manage contribution amounts and penalty rates</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Monthly Contribution */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-blue-500 rounded-lg mr-3">
                                        <LiaCoinsSolid className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Contribution</h3>
                                </div>
                                <InputLabel htmlFor="monthly_contribution" value="Amount (TZS)" className="text-gray-700 dark:text-gray-300 font-medium" />
                                <div className="relative mt-2">
                                    <TextInput
                                        id="monthly_contribution"
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(e.target.value)}
                                        className="block w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
                                        min="0"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">TZS</span>
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Standard monthly contribution amount for all members</p>
                            </div>

                            {/* Penalty Rate */}
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-orange-500 rounded-lg mr-3">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Penalty Rate</h3>
                                </div>
                                <InputLabel htmlFor="penalty_rate" value="Percentage (%)" className="text-gray-700 dark:text-gray-300 font-medium" />
                                <div className="relative mt-2">
                                    <TextInput
                                        id="penalty_rate"
                                        type="number"
                                        value={penaltyRate}
                                        onChange={(e) => setPenaltyRate(e.target.value)}
                                        className="block w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">Applied to missed contributions as penalty</p>
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Cog6ToothIcon className="w-5 h-5 text-purple-500 mr-2" />
                                Advanced Options
                            </h3>
                            <div className="flex items-start space-x-3">
                                <input
                                    id="apply_to_existing"
                                    type="checkbox"
                                    checked={applyToExisting}
                                    onChange={() => setApplyToExisting(!applyToExisting)}
                                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 mt-0.5"
                                />
                                <div>
                                    <label htmlFor="apply_to_existing" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Apply penalty rate changes to existing unpaid penalties
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        When enabled, the new penalty rate will be applied to all existing unpaid penalties retroactively.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Changes will take effect immediately after saving
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                        setMonthlyContribution(settings.monthly_contribution_amount ? settings.monthly_contribution_amount.value : 50000);
                                        setPenaltyRate(settings.penalty_percentage_rate ? settings.penalty_percentage_rate.value : 10);
                                        setApplyToExisting(settings.apply_penalty_to_existing ? settings.apply_penalty_to_existing.value === '1' : false);
                                    }}
                                >
                                    Reset to Default
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Enhanced Additional Admin Settings */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Email Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-500 rounded-lg mr-3">
                                <BellIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Notifications</h2>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Configure automated email alerts</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* New Member Registration */}
                            <div className="flex items-start justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <UserCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">New Member Registration</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when new members join the system</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={settings.email_new_member ? settings.email_new_member.value === '1' : false}
                                        onChange={() => {
                                            const newValue = settings.email_new_member ? (settings.email_new_member.value === '1' ? 0 : 1) : 1;
                                            router.post(route('admin.settings.update'), { email_new_member: newValue });
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Contribution Reminders */}
                            <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <LiaCoinsSolid className="w-5 h-5 text-blue-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Contribution Reminders</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Send automatic reminders for monthly contributions</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={settings.email_contribution_reminder ? settings.email_contribution_reminder.value === '1' : false}
                                        onChange={() => {
                                            const newValue = settings.email_contribution_reminder ? (settings.email_contribution_reminder.value === '1' ? 0 : 1) : 1;
                                            router.post(route('admin.settings.update'), { email_contribution_reminder: newValue });
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Penalty Notices */}
                            <div className="flex items-start justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Penalty Notices</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert members about penalty charges and overdue payments</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={settings.email_penalty_notice ? settings.email_penalty_notice.value === '1' : false}
                                        onChange={() => {
                                            const newValue = settings.email_penalty_notice ? (settings.email_penalty_notice.value === '1' ? 0 : 1) : 1;
                                            router.post(route('admin.settings.update'), { email_penalty_notice: newValue });
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-500 rounded-lg mr-3">
                                <ShieldCheckIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Configure authentication and security policies</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleSecuritySubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Session Timeout (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="15"
                                        max="1440"
                                        value={sessionTimeout}
                                        onChange={(e) => setSessionTimeout(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                        placeholder="120"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How long users stay logged in (15-1440 minutes)</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Max Login Attempts
                                    </label>
                                    <input
                                        type="number"
                                        min="3"
                                        max="10"
                                        value={maxLoginAttempts}
                                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                        placeholder="5"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum failed login attempts before lockout</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Email Verification</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Require email verification for new accounts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={requireEmailVerification}
                                            onChange={(e) => setRequireEmailVerification(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Enable 2FA for enhanced security</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={enableTwoFactorAuth}
                                            onChange={(e) => setEnableTwoFactorAuth(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Admin Role Assignment</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Allow administrators to assign roles to users</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={allowAdminAssignment}
                                            onChange={(e) => setAllowAdminAssignment(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Security changes will take effect immediately after saving
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                        setSessionTimeout(settings.session_timeout_minutes ? settings.session_timeout_minutes.value : 120);
                                        setMaxLoginAttempts(settings.max_login_attempts ? settings.max_login_attempts.value : 5);
                                        setRequireEmailVerification(settings.require_email_verification ? settings.require_email_verification.value === '1' : true);
                                        setEnableTwoFactorAuth(settings.enable_two_factor_auth ? settings.enable_two_factor_auth.value === '1' : false);
                                        setAllowAdminAssignment(settings.allow_admin_assignment ? settings.allow_admin_assignment.value === '1' : false);
                                    }}
                                >
                                    Reset to Default
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSecuritySaving}
                                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSecuritySaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                            Save Security Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Security Settings Message */}
                        {securityMessage && (
                            <div className={`mt-4 p-4 rounded-lg ${securityMessage.includes('successfully')
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}>
                                {securityMessage}
                            </div>
                        )}
                        </form>
                    </div>
                </div>
            </div>

            {/* System Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-8 mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-500 rounded-lg mr-3">
                            <Cog6ToothIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Configuration</h2>
                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Configure system-wide settings and preferences</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSystemSubmit} className="space-y-8">
                    {/* Regional Settings */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            Regional Settings
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    System Timezone
                                </label>
                                <select
                                    value={systemTimezone}
                                    onChange={(e) => setSystemTimezone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-purple-300"
                                >
                                    <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (GMT+3)</option>
                                    <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                                    <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                                    <option value="UTC">UTC (GMT+0)</option>
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Default timezone for system operations and user displays</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Date Format
                                </label>
                                <select
                                    value={dateFormat}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-purple-300"
                                >
                                    <option value="Y-m-d">YYYY-MM-DD (2024-12-25)</option>
                                    <option value="d/m/Y">DD/MM/YYYY (25/12/2024)</option>
                                    <option value="m/d/Y">MM/DD/YYYY (12/25/2024)</option>
                                    <option value="d-m-Y">DD-MM-YYYY (25-12-2024)</option>
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400">How dates will be displayed throughout the system</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Settings */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            Financial Configuration
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Currency Symbol
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={currencySymbol}
                                        onChange={(e) => setCurrencySymbol(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-purple-300"
                                        placeholder="TZS"
                                        maxLength="10"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <LiaCoinsSolid className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Currency symbol used in financial displays and reports</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Currency Preview
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Sample amounts:</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                        {currencySymbol || 'TZS'} 50,000.00
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {currencySymbol || 'TZS'} 1,250,000.00
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Preview of how currency will appear in the system</p>
                            </div>
                        </div>
                    </div>

                    {/* System Configuration Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            System changes will take effect immediately after saving
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                onClick={() => {
                                    setSystemTimezone(settings.system_timezone ? settings.system_timezone.value : 'Africa/Dar_es_Salaam');
                                    setDateFormat(settings.date_format ? settings.date_format.value : 'Y-m-d');
                                    setCurrencySymbol(settings.currency_symbol ? settings.currency_symbol.value : 'TZS');
                                }}
                            >
                                Reset to Default
                            </button>
                            <button
                                type="submit"
                                disabled={isSystemSaving}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSystemSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Cog6ToothIcon className="w-5 h-5 mr-2" />
                                        Save System Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* System Configuration Message */}
                    {systemMessage && (
                        <div className={`mt-4 p-4 rounded-lg ${systemMessage.includes('successfully')
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                            {systemMessage}
                        </div>
                    )}
                    </form>
                </div>
            </div>

            {/* Data Backup & System Maintenance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data Backup Options */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center">
                                <div className="p-2 bg-cyan-500 rounded-lg mr-3">
                                    <CloudArrowUpIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Backup</h2>
                                    <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-1">Protect your data with automated backups</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleBackupSubmit} className="space-y-8">
                                {/* Auto Backup Toggle */}
                                <div className="flex items-start justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Automatic Backups</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable scheduled automatic data backups</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                                        <input
                                            type="checkbox"
                                            checked={autoBackup}
                                            onChange={(e) => setAutoBackup(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    </label>
                                </div>

                                {/* Backup Frequency */}
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                                    <div className="flex items-center mb-3">
                                        <ClockIcon className="w-5 h-5 text-blue-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Backup Frequency</h4>
                                    </div>
                                    <select
                                        value={backupFrequency}
                                        onChange={(e) => setBackupFrequency(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="daily">Daily Backups</option>
                                        <option value="weekly">Weekly Backups</option>
                                        <option value="monthly">Monthly Backups</option>
                                    </select>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">How often automatic backups are created</p>
                                </div>

                                {/* Backup Retention */}
                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
                                    <div className="flex items-center mb-3">
                                        <ArchiveBoxIcon className="w-5 h-5 text-orange-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Backup Retention</h4>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={backupRetentionDays}
                                            onChange={(e) => setBackupRetentionDays(e.target.value)}
                                            className="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="30"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">days</span>
                                    </div>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">How long to keep backup files before deletion</p>
                                </div>



                            {/* Data Backup Action Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Backup settings will be applied immediately after saving
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                        onClick={() => {
                                            setAutoBackup(settings.auto_backup ? settings.auto_backup.value === '1' : false);
                                            setBackupFrequency(settings.backup_frequency ? settings.backup_frequency.value : 'daily');
                                            setBackupRetentionDays(settings.backup_retention_days ? settings.backup_retention_days.value : 30);
                                        }}
                                    >
                                        Reset to Default
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isBackupSaving}
                                        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isBackupSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                                                Save Backup Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Data Backup Message */}
                            {backupMessage && (
                                <div className={`mt-4 p-4 rounded-lg ${backupMessage.includes('successfully')
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                }`}>
                                    {backupMessage}
                                </div>
                            )}
                            </form>

                            {/* Manual Backup Section - Outside Form */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <DocumentDuplicateIcon className="w-5 h-5 text-purple-500 mr-2" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Manual Backup</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Create an immediate backup of all system data</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => router.get('/admin/backups')}
                                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                                            >
                                                <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                                                Manage Backups
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleManualBackup}
                                                disabled={isManualBackupRunning}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center disabled:cursor-not-allowed"
                                            >
                                                {isManualBackupRunning ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Creating Backup...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                                                        Backup Now
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Maintenance */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-500 rounded-lg mr-3">
                                    <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Maintenance</h2>
                                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Control system access during maintenance</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleMaintenanceSubmit} className="space-y-8">
                                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-3">
                                                <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Mode</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Enable maintenance mode to restrict system access for regular users during updates or fixes.
                                            </p>
                                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                                                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                                                    ⚠️ Warning: Enabling maintenance mode will prevent all non-admin users from accessing the system.
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer ml-6">
                                            <input
                                                type="checkbox"
                                                checked={maintenanceMode}
                                                onChange={(e) => setMaintenanceMode(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* System Maintenance Action Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Maintenance mode changes will take effect immediately after saving
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                            onClick={() => {
                                                setMaintenanceMode(settings.maintenance_mode ? settings.maintenance_mode.value === '1' : false);
                                            }}
                                        >
                                            Reset to Default
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isMaintenanceSaving}
                                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {isMaintenanceSaving ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                                                    Save Maintenance Settings
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* System Maintenance Message */}
                                {maintenanceMessage && (
                                    <div className={`mt-4 p-4 rounded-lg ${maintenanceMessage.includes('successfully')
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                    }`}>
                                        {maintenanceMessage}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
            </div>
        </SidebarLayout>
    );
};

export default Settings;
