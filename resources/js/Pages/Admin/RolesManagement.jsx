import React, { useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import {
    UserGroupIcon,
    ShieldCheckIcon,
    KeyIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UsersIcon,
    CogIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function RolesManagement() {
    const { props } = usePage();
    const { users, totalPages, roles, permissions } = props;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Form for creating/updating roles
    const { data: roleData, setData: setRoleData, post: createRole, put: updateRole, errors: roleErrors, reset: resetRole } = useForm({
        name: '',
        description: '',
    });

    // Form for creating/updating permissions
    const { data: permissionData, setData: setPermissionData, post: createPermission, put: updatePermission, errors: permissionErrors, reset: resetPermission } = useForm({
        name: '',
        description: '',
    });

    // Form for assigning permissions to roles
    const { data: assignData, setData: setAssignData, post: assignPermissions, errors: assignErrors } = useForm({
        role_id: '',
        permission_ids: [],
    });

    // Form for assigning roles to users
    const { data: userRoleData, setData: setUserRoleData, post: updateUserRole, errors: userRoleErrors } = useForm({
        user_id: '',
        role_id: '',
    });

    useEffect(() => {
        // Fetch users based on page and search query
        // This would be handled by a backend route with pagination and search
        // For now, it's handled by the props passed from the controller
    }, [currentPage, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Fetch users for the new page
        window.location.href = `/admin/roles?page=${page}&search=${searchQuery}`;
    };

    const handleCreateRole = (e) => {
        e.preventDefault();
        createRole('/admin/roles', {
            onSuccess: () => resetRole(),
        });
    };

    const handleUpdateRole = (roleId) => {
        updateRole(`/admin/roles/${roleId}`, {
            onSuccess: () => resetRole(),
        });
    };

    const handleDeleteRole = (roleId) => {
        if (confirm('Are you sure you want to delete this role?')) {
            // Assuming a delete method is available
            // deleteRole(`/admin/roles/${roleId}`);
        }
    };

    const handleCreatePermission = (e) => {
        e.preventDefault();
        createPermission('/admin/permissions', {
            onSuccess: () => resetPermission(),
        });
    };

    const handleUpdatePermission = (permissionId) => {
        updatePermission(`/admin/permissions/${permissionId}`, {
            onSuccess: () => resetPermission(),
        });
    };

    const handleDeletePermission = (permissionId) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            // Assuming a delete method is available
            // deletePermission(`/admin/permissions/${permissionId}`);
        }
    };

    const handleAssignPermissions = (e) => {
        e.preventDefault();
        assignPermissions(`/admin/roles/${assignData.role_id}/permissions`, {
            onSuccess: () => setAssignData({ role_id: '', permission_ids: [] }),
        });
    };

    const handleUpdateUserRole = (userId, roleId) => {
        setUserRoleData({ user_id: userId, role_id: roleId });
        updateUserRole(`/admin/users/${userId}/update-role`, {
            onSuccess: () => setUserRoleData({ user_id: '', role_id: '' }),
        });
    };

    const handlePermissionCheckboxChange = (permissionId) => {
        let updatedPermissions;
        if (assignData.permission_ids.includes(permissionId)) {
            updatedPermissions = assignData.permission_ids.filter(id => id !== permissionId);
        } else {
            updatedPermissions = [...assignData.permission_ids, permissionId];
        }
        setAssignData('permission_ids', updatedPermissions);
    };

    return (
        <SidebarLayout>
            {/* Page Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center">
                            <ShieldCheckIcon className="w-8 h-8 mr-3" />
                            Roles & Permissions Management
                        </h1>
                        <p className="text-indigo-100 text-lg">
                            Manage user roles, permissions, and access control for your system
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <UserGroupIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <KeyIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* User Role Assignment */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Role Assignment</h2>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {users?.length || 0} users
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search users by name or email..."
                                    className="pl-10 w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <UserGroupIcon className="w-4 h-4 mr-2" />
                                                User
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                                Current Role
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">New Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users?.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.role
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}>
                                                    {user.role ? user.role.name : 'No Role'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={userRoleData.user_id === user.id ? userRoleData.role_id : user.role_id || ''}
                                                    onChange={(e) => setUserRoleData({ user_id: user.id, role_id: e.target.value })}
                                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                                >
                                                    <option value="">Select Role</option>
                                                    {roles?.map(role => (
                                                        <option key={role.id} value={role.id}>{role.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleUpdateUserRole(user.id, userRoleData.role_id)}
                                                    disabled={userRoleData.user_id !== user.id || !userRoleData.role_id}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    )) || (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>No users found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                            Previous
                                        </button>

                                        <div className="flex space-x-1">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                            currentPage === page
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Next
                                            <ChevronRightIcon className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Role Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role Management</h2>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {roles?.length || 0} roles
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Create Role Form */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-6 mb-6 border border-green-200 dark:border-gray-600">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <PlusIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                Create New Role
                            </h3>
                            <form onSubmit={handleCreateRole}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="role_name" value="Role Name" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="role_name"
                                            type="text"
                                            value={roleData.name}
                                            onChange={(e) => setRoleData('name', e.target.value)}
                                            className="mt-2 w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter role name (e.g., Admin, Manager)"
                                            required
                                        />
                                        <InputError message={roleErrors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="role_description" value="Description" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="role_description"
                                            type="text"
                                            value={roleData.description}
                                            onChange={(e) => setRoleData('description', e.target.value)}
                                            className="mt-2 w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Brief description of the role"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Roles Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                                Role Name
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {roles?.map(role => (
                                        <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                            {role.name?.charAt(0)?.toUpperCase() || 'R'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {role.description || 'No description provided'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateRole(role.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                    >
                                                        <PencilIcon className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) || (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>No roles found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Permission Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <KeyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permission Management</h2>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {permissions?.length || 0} permissions
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Create Permission Form */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-6 mb-6 border border-purple-200 dark:border-gray-600">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <PlusIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                                Create New Permission
                            </h3>
                            <form onSubmit={handleCreatePermission}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="permission_name" value="Permission Name" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="permission_name"
                                            type="text"
                                            value={permissionData.name}
                                            onChange={(e) => setPermissionData('name', e.target.value)}
                                            className="mt-2 w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter permission name (e.g., create_users, edit_posts)"
                                            required
                                        />
                                        <InputError message={permissionErrors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="permission_description" value="Description" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="permission_description"
                                            type="text"
                                            value={permissionData.description}
                                            onChange={(e) => setPermissionData('description', e.target.value)}
                                            className="mt-2 w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Brief description of the permission"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Permission
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Permissions Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <KeyIcon className="w-4 h-4 mr-2" />
                                                Permission Name
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {permissions?.map(permission => (
                                        <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                                            {permission.name?.charAt(0)?.toUpperCase() || 'P'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {permission.description || 'No description provided'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleUpdatePermission(permission.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                    >
                                                        <PencilIcon className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePermission(permission.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) || (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <KeyIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>No permissions found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Assign Permissions to Roles */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <CogIcon className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assign Permissions to Roles</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-6 border border-orange-200 dark:border-gray-600">
                            <form onSubmit={handleAssignPermissions}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="role_select" value="Select Role" className="text-gray-700 dark:text-gray-300 font-medium mb-2" />
                                        <div className="relative">
                                            <select
                                                id="role_select"
                                                value={assignData.role_id}
                                                onChange={(e) => setAssignData('role_id', e.target.value)}
                                                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="">Choose a role to assign permissions</option>
                                                {roles?.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="Select Permissions" className="text-gray-700 dark:text-gray-300 font-medium mb-2" />
                                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 h-40 overflow-y-auto bg-white dark:bg-gray-800">
                                            {permissions?.length > 0 ? (
                                                <div className="space-y-3">
                                                    {permissions.map(permission => (
                                                        <div key={permission.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                                            <input
                                                                type="checkbox"
                                                                id={`permission_${permission.id}`}
                                                                checked={assignData.permission_ids.includes(permission.id)}
                                                                onChange={() => handlePermissionCheckboxChange(permission.id)}
                                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                            />
                                                            <label
                                                                htmlFor={`permission_${permission.id}`}
                                                                className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                                                            >
                                                                <div className="flex items-center">
                                                                    <KeyIcon className="w-4 h-4 mr-2 text-purple-500" />
                                                                    {permission.name}
                                                                </div>
                                                                {permission.description && (
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                                                        {permission.description}
                                                                    </div>
                                                                )}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                                    <KeyIcon className="w-8 h-8 mb-2 text-gray-300" />
                                                    <p className="text-sm">No permissions available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {assignData.permission_ids.length > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                                {assignData.permission_ids.length} permission{assignData.permission_ids.length !== 1 ? 's' : ''} selected
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!assignData.role_id || assignData.permission_ids.length === 0}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <CogIcon className="w-4 h-4 mr-2" />
                                        Assign Permissions
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
