import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { usePage, router, Link } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ArchivedMembers = ({ archivedMembers }) => {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState('');
    const [restoringMember, setRestoringMember] = useState(null);
    const [deletingMember, setDeletingMember] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // Filter archived members based on search
    const filteredMembers = archivedMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone_number && member.phone_number.includes(searchTerm))
    );

    const handleRestore = (member) => {
        setRestoringMember(member);
        router.post(route('members.restore', member.id), {}, {
            onSuccess: () => {
                toast.success('Member restored successfully!');
                setRestoringMember(null);
            },
            onError: () => {
                toast.error('Failed to restore member. Please try again.');
                setRestoringMember(null);
            }
        });
    };

    const handlePermanentDelete = () => {
        if (deleteConfirmation !== deletingMember?.name) {
            return;
        }

        router.delete(route('members.force-delete', deletingMember.id), {
            onSuccess: () => {
                toast.success('Member permanently deleted from the system.');
                setDeletingMember(null);
                setDeleteConfirmation('');
            },
            onError: () => {
                toast.error('Failed to permanently delete member. Please try again.');
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <SidebarLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg mr-4">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Archived Members
                                </h2>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    View and manage archived members. You can restore or permanently delete them.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={route('admin.members.index')}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Active Members
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search archived members by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full">
                                {filteredMembers.length} archived member{filteredMembers.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {filteredMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {searchTerm ? 'No archived members match your search' : 'No archived members'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {searchTerm 
                                    ? 'Try adjusting your search terms to find what you\'re looking for.'
                                    : 'All members are currently active. Archived members will appear here when members are archived.'
                                }
                            </p>
                            {!searchTerm && (
                                <Link
                                    href={route('admin.members.index')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    View Active Members
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Archived Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-white">
                                                                {member.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            ID: {member.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {member.email}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {member.phone_number || 'No phone'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(member.deleted_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleRestore(member)}
                                                    disabled={restoringMember?.id === member.id}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-4 disabled:opacity-50"
                                                >
                                                    {restoringMember?.id === member.id ? 'Restoring...' : 'Restore'}
                                                </button>
                                                <button
                                                    onClick={() => setDeletingMember(member)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                                >
                                                    Delete Forever
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Permanent Delete Confirmation Modal */}
                {deletingMember && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                            <div className="mt-3">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
                                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white text-center mt-4">
                                    Permanently Delete Member
                                </h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        This action cannot be undone. This will permanently delete the member and all associated data from the system.
                                    </p>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        placeholder={`Type "${deletingMember?.name || ''}" to confirm`}
                                        className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="items-center px-4 py-3">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => {
                                                setDeletingMember(null);
                                                setDeleteConfirmation('');
                                            }}
                                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePermanentDelete}
                                            disabled={deleteConfirmation !== deletingMember?.name}
                                            className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Delete Forever
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer position="top-right" />
            </div>
        </SidebarLayout>
    );
};

export default ArchivedMembers;
