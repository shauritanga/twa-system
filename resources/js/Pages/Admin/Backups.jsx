import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { router } from '@inertiajs/react';
import { 
    CloudArrowUpIcon, 
    CloudArrowDownIcon, 
    TrashIcon,
    DocumentDuplicateIcon,
    ClockIcon,
    ServerIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Backups({ backups: initialBackups, settings }) {
    const [backups, setBackups] = useState(initialBackups || []);
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [isCreatingDbBackup, setIsCreatingDbBackup] = useState(false);
    const [isCleaningBackups, setIsCleaningBackups] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCleanModal, setShowCleanModal] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(null);

    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const refreshBackups = async () => {
        try {
            const response = await fetch('/admin/backups/list');
            const data = await response.json();
            if (data.success) {
                setBackups(data.backups);
            }
        } catch (error) {
            console.error('Failed to refresh backups:', error);
        }
    };

    const handleCreateBackup = async () => {
        setIsCreatingBackup(true);
        try {
            const response = await fetch('/admin/backups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(data.message, 'success');
                await refreshBackups();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Failed to create backup', 'error');
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const handleCreateDatabaseBackup = async () => {
        setIsCreatingDbBackup(true);
        try {
            const response = await fetch('/admin/backups/create-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(data.message, 'success');
                await refreshBackups();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Failed to create database backup', 'error');
        } finally {
            setIsCreatingDbBackup(false);
        }
    };

    const handleDeleteBackup = (filename) => {
        setSelectedBackup(filename);
        setShowDeleteModal(true);
    };

    const confirmDeleteBackup = async () => {
        try {
            const response = await fetch(`/admin/backups/${selectedBackup}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                await refreshBackups();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Failed to delete backup', 'error');
        } finally {
            setShowDeleteModal(false);
            setSelectedBackup(null);
        }
    };

    const handleCleanOldBackups = () => {
        setShowCleanModal(true);
    };

    const confirmCleanOldBackups = async () => {
        setIsCleaningBackups(true);
        try {
            const response = await fetch('/admin/backups/clean', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                await refreshBackups();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Failed to clean old backups', 'error');
        } finally {
            setIsCleaningBackups(false);
            setShowCleanModal(false);
        }
    };

    const handleDownload = (filename) => {
        window.location.href = `/admin/backups/download/${filename}`;
    };

    return (
        <SidebarLayout>
            <div className="p-6 w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Backup Management</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Create, manage, and download system backups</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                settings.auto_backup_enabled
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700'
                            }`}>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                        settings.auto_backup_enabled ? 'bg-green-500' : 'bg-gray-400'
                                    }`}></div>
                                    Auto Backup: {settings.auto_backup_enabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                                <div className="flex items-center">
                                    <ClockIcon className="w-4 h-4 mr-2" />
                                    Frequency: {settings.backup_frequency}
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                                <div className="flex items-center">
                                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                                    Total Backups: {backups.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        messageType === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                            : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                    }`}>
                        <div className="flex items-center">
                            {messageType === 'success' ? (
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                            ) : (
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                            )}
                            {message}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={handleCreateBackup}
                        disabled={isCreatingBackup}
                        className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        {isCreatingBackup ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                                Full Backup
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleCreateDatabaseBackup}
                        disabled={isCreatingDbBackup}
                        className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        {isCreatingDbBackup ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <ServerIcon className="w-5 h-5 mr-2" />
                                Database Only
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleCleanOldBackups}
                        disabled={isCleaningBackups}
                        className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        {isCleaningBackups ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Cleaning...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="w-5 h-5 mr-2" />
                                Clean Old
                            </>
                        )}
                    </button>

                    <button
                        onClick={refreshBackups}
                        className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                        Refresh List
                    </button>
                </div>

                {/* Backups List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Backups</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {backups.length} backup{backups.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    {backups.length === 0 ? (
                        <div className="p-12 text-center">
                            <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No backups found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first backup to get started</p>
                            <button
                                onClick={handleCreateBackup}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                                Create Backup
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Filename
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Created Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Created Time
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Age
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {backups.map((backup, index) => {
                                        const createdDate = new Date(backup.created_at);
                                        const backupType = backup.filename.includes('database') ? 'Database' : 'Full System';
                                        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000; // Less than 24 hours

                                        return (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <DocumentDuplicateIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                                                                {backup.filename}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        backupType === 'Database'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                    }`}>
                                                        {backupType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {backup.size}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {createdDate.toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {createdDate.toLocaleTimeString()}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {backup.age}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        isRecent
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                    }`}>
                                                        {isRecent ? 'Recent' : 'Archived'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleDownload(backup.filename)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-md transition-colors duration-200"
                                                            title="Download backup"
                                                        >
                                                            <CloudArrowDownIcon className="w-4 h-4 mr-1" />
                                                            Download
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBackup(backup.filename)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-medium rounded-md transition-colors duration-200"
                                                            title="Delete backup"
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Delete Backup
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    Are you sure you want to delete the backup file <strong>{selectedBackup}</strong>?
                                    This action cannot be undone and the backup will be permanently removed.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedBackup(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeleteBackup}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                                    >
                                        Delete Backup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Clean Old Backups Confirmation Modal */}
                {showCleanModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Clean Old Backups
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Remove expired backup files
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    This will permanently delete all backup files that exceed the retention period
                                    configured in your backup settings. This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowCleanModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmCleanOldBackups}
                                        disabled={isCleaningBackups}
                                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                                    >
                                        {isCleaningBackups ? 'Cleaning...' : 'Clean Old Backups'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
