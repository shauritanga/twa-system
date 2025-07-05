import React, { useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import DangerButton from '../../Components/DangerButton';
import SecondaryButton from '../../Components/SecondaryButton';
import InputError from '../../Components/InputError';

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
            <div className="p-6 w-full mx-auto">
                <h1 className="text-2xl font-bold mb-6">Roles & Permissions Management</h1>

                {/* User Role Assignment */}
                <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">User Role Assignment</h2>
                    <div className="mb-4">
                        <TextInput
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search users..."
                            className="w-full max-w-md"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assign New Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role ? user.role.name : 'None'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <select
                                                value={userRoleData.user_id === user.id ? userRoleData.role_id : user.role_id || ''}
                                                onChange={(e) => setUserRoleData({ user_id: user.id, role_id: e.target.value })}
                                                className="border border-gray-300 dark:border-gray-600 rounded p-2"
                                            >
                                                <option value="">Select Role</option>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <PrimaryButton
                                                onClick={() => handleUpdateUserRole(user.id, userRoleData.role_id)}
                                                disabled={userRoleData.user_id !== user.id || !userRoleData.role_id}
                                            >
                                                Update Role
                                            </PrimaryButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Role Management */}
                <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Role Management</h2>
                    <form onSubmit={handleCreateRole} className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="role_name" value="Role Name" />
                                <TextInput
                                    id="role_name"
                                    type="text"
                                    value={roleData.name}
                                    onChange={(e) => setRoleData('name', e.target.value)}
                                    className="w-full"
                                    required
                                />
                                <InputError message={roleErrors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="role_description" value="Description" />
                                <TextInput
                                    id="role_description"
                                    type="text"
                                    value={roleData.description}
                                    onChange={(e) => setRoleData('description', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <PrimaryButton type="submit" className="mt-4">Create Role</PrimaryButton>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {roles.map(role => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{role.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{role.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <SecondaryButton onClick={() => handleUpdateRole(role.id)}>Edit</SecondaryButton>
                                            <DangerButton onClick={() => handleDeleteRole(role.id)} className="ml-2">Delete</DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Permission Management */}
                <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Permission Management</h2>
                    <form onSubmit={handleCreatePermission} className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="permission_name" value="Permission Name" />
                                <TextInput
                                    id="permission_name"
                                    type="text"
                                    value={permissionData.name}
                                    onChange={(e) => setPermissionData('name', e.target.value)}
                                    className="w-full"
                                    required
                                />
                                <InputError message={permissionErrors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="permission_description" value="Description" />
                                <TextInput
                                    id="permission_description"
                                    type="text"
                                    value={permissionData.description}
                                    onChange={(e) => setPermissionData('description', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <PrimaryButton type="submit" className="mt-4">Create Permission</PrimaryButton>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {permissions.map(permission => (
                                    <tr key={permission.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{permission.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{permission.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <SecondaryButton onClick={() => handleUpdatePermission(permission.id)}>Edit</SecondaryButton>
                                            <DangerButton onClick={() => handleDeletePermission(permission.id)} className="ml-2">Delete</DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Assign Permissions to Roles */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Assign Permissions to Roles</h2>
                    <form onSubmit={handleAssignPermissions}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="role_select" value="Select Role" />
                                <select
                                    id="role_select"
                                    value={assignData.role_id}
                                    onChange={(e) => setAssignData('role_id', e.target.value)}
                                    className="border border-gray-300 dark:border-gray-600 rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Select a Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Select Permissions" />
                                <div className="border border-gray-300 dark:border-gray-600 rounded p-2 h-24 overflow-y-auto">
                                    {permissions.map(permission => (
                                        <div key={permission.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`permission_${permission.id}`}
                                                checked={assignData.permission_ids.includes(permission.id)}
                                                onChange={() => handlePermissionCheckboxChange(permission.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`permission_${permission.id}`} className="text-sm">{permission.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <PrimaryButton type="submit" className="mt-4">Assign Permissions</PrimaryButton>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
