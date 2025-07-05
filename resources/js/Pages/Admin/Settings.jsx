import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { usePage, router } from '@inertiajs/react';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';
import { Cog6ToothIcon, ServerIcon, UserCircleIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Settings = () => {
    const { settings, recentLogins, users } = usePage().props;
    const [monthlyContribution, setMonthlyContribution] = useState(settings.monthly_contribution_amount ? settings.monthly_contribution_amount.value : 50000);
    const [penaltyRate, setPenaltyRate] = useState(settings.penalty_percentage_rate ? settings.penalty_percentage_rate.value : 10);
    const [applyToExisting, setApplyToExisting] = useState(settings.apply_penalty_to_existing ? settings.apply_penalty_to_existing.value === '1' : false);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(route('admin.settings.update'), {
            monthly_contribution_amount: monthlyContribution,
            penalty_percentage_rate: penaltyRate,
            apply_penalty_to_existing: applyToExisting ? 1 : 0,
        }, {
            onSuccess: () => {
                setMessage('Settings updated successfully.');
                setIsSaving(false);
                setTimeout(() => setMessage(''), 3000);
            },
            onError: () => {
                setMessage('Failed to update settings. Please check the values.');
                setIsSaving(false);
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight mb-8">Settings</h1>
            
            {message && (
                <div className="fixed top-4 right-4 p-4 text-sm text-white rounded-lg shadow-lg z-50 animate-fade-in-out" 
                     style={{ backgroundColor: message.includes('successfully') ? '#10B981' : '#EF4444' }}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* System Performance Placeholder */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <ServerIcon className="w-6 h-6 text-blue-500" /> System Performance
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">System performance metrics will be displayed here once implemented.</p>
                    {/* Future implementation for system performance metrics */}
                </div>

                {/* Recent Logins */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <UserCircleIcon className="w-6 h-6 text-indigo-500" /> Recently Logged In Members
                    </h2>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {recentLogins && recentLogins.length > 0 ? (
                                recentLogins.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.last_login || 'Never'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">No recent login data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial Settings */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-500" /> Financial Settings
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="monthly_contribution" value="Monthly Contribution Amount" className="text-gray-700 dark:text-gray-300" />
                            <TextInput
                                id="monthly_contribution"
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                min="0"
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The standard monthly contribution amount for members.</p>
                        </div>
                        <div>
                            <InputLabel htmlFor="penalty_rate" value="Penalty Percentage Rate" className="text-gray-700 dark:text-gray-300" />
                            <TextInput
                                id="penalty_rate"
                                type="number"
                                value={penaltyRate}
                                onChange={(e) => setPenaltyRate(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                min="0"
                                max="100"
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Percentage rate applied to missed contributions for penalties.</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="apply_to_existing"
                            type="checkbox"
                            checked={applyToExisting}
                            onChange={() => setApplyToExisting(!applyToExisting)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor="apply_to_existing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Apply penalty rate changes to existing unpaid penalties
                        </label>
                    </div>
                    <div>
                        <PrimaryButton type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSaving}>
                            {isSaving ? 'Saving' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            {/* Additional Admin Settings */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <Cog6ToothIcon className="w-6 h-6 text-gray-500" /> Additional Admin Settings
                </h2>
                <div className="space-y-8">
                    {/* Email Notifications */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Email Notifications</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="emailNewMember" className="text-sm text-gray-700 dark:text-gray-300">Notify on New Member Registration</label>
                                <input
                                    id="emailNewMember"
                                    type="checkbox"
                                    checked={settings.email_new_member ? settings.email_new_member.value === '1' : false}
                                    onChange={() => {
                                        const newValue = settings.email_new_member ? (settings.email_new_member.value === '1' ? 0 : 1) : 1;
                                        router.post(route('admin.settings.update'), { email_new_member: newValue });
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="emailContributionReminder" className="text-sm text-gray-700 dark:text-gray-300">Contribution Reminders</label>
                                <input
                                    id="emailContributionReminder"
                                    type="checkbox"
                                    checked={settings.email_contribution_reminder ? settings.email_contribution_reminder.value === '1' : false}
                                    onChange={() => {
                                        const newValue = settings.email_contribution_reminder ? (settings.email_contribution_reminder.value === '1' ? 0 : 1) : 1;
                                        router.post(route('admin.settings.update'), { email_contribution_reminder: newValue });
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="emailPenaltyNotice" className="text-sm text-gray-700 dark:text-gray-300">Penalty Notices</label>
                                <input
                                    id="emailPenaltyNotice"
                                    type="checkbox"
                                    checked={settings.email_penalty_notice ? settings.email_penalty_notice.value === '1' : false}
                                    onChange={() => {
                                        const newValue = settings.email_penalty_notice ? (settings.email_penalty_notice.value === '1' ? 0 : 1) : 1;
                                        router.post(route('admin.settings.update'), { email_penalty_notice: newValue });
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Data Backup Options */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Data Backup Options</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="autoBackup" className="text-sm text-gray-700 dark:text-gray-300">Enable Automatic Backups</label>
                                <input
                                    id="autoBackup"
                                    type="checkbox"
                                    checked={settings.auto_backup ? settings.auto_backup.value === '1' : false}
                                    onChange={() => {
                                        const newValue = settings.auto_backup ? (settings.auto_backup.value === '1' ? 0 : 1) : 1;
                                        router.post(route('admin.settings.update'), { auto_backup: newValue });
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label htmlFor="backupFrequency" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Backup Frequency</label>
                                <select
                                    id="backupFrequency"
                                    value={settings.backup_frequency ? settings.backup_frequency.value : 'weekly'}
                                    onChange={(e) => router.post(route('admin.settings.update'), { backup_frequency: e.target.value })}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <button
                                onClick={() => router.post(route('admin.settings.backup'), {}, { onSuccess: () => alert('Manual backup triggered successfully.') })}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Backup Now
                            </button>
                        </div>
                    </div>

                    {/* System Maintenance Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">System Maintenance</h3>
                        <div className="flex items-center justify-between">
                            <label htmlFor="maintenanceMode" className="text-sm text-gray-700 dark:text-gray-300">Enable Maintenance Mode</label>
                            <input
                                id="maintenanceMode"
                                type="checkbox"
                                checked={settings.maintenance_mode ? settings.maintenance_mode.value === '1' : false}
                                onChange={() => {
                                    const newValue = settings.maintenance_mode ? (settings.maintenance_mode.value === '1' ? 0 : 1) : 1;
                                    router.post(route('admin.settings.update'), { maintenance_mode: newValue });
                                }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white dark:bg-gray-700"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enabling maintenance mode will restrict access to the system for regular users during updates or fixes.</p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Settings;
