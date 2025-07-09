import React, { useState } from 'react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { useForm } from '@inertiajs/react';
import {
    UserCircleIcon,
    CameraIcon,
    TrashIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ProfileEdit({ user }) {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const { data, setData, patch, processing, errors, progress } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        bio: user.bio || '',
        address: user.address || '',
        city: user.city || '',
        region: user.region || '',
        postal_code: user.postal_code || '',
    });

    const { data: avatarData, setData: setAvatarData, post: postAvatar, processing: avatarProcessing } = useForm({
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/profile', {
            preserveScroll: true,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarData('avatar', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = () => {
        if (avatarData.avatar) {
            setIsUploading(true);
            postAvatar('/profile/avatar', {
                preserveScroll: true,
                onSuccess: () => {
                    setAvatarPreview(null);
                    setAvatarData('avatar', null);
                    setIsUploading(false);
                },
                onError: () => {
                    setIsUploading(false);
                }
            });
        }
    };

    const removeAvatar = () => {
        if (confirm('Are you sure you want to remove your profile photo?')) {
            fetch('/profile/avatar', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            }).then(() => {
                window.location.reload();
            });
        }
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Update your personal information and preferences</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Profile Photo Section */}
                    <div className="xl:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-fit">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>

                            <div className="text-center">
                                <div className="relative inline-block">
                                    <img
                                        src={avatarPreview || user.avatar_url}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                                    />
                                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors duration-200">
                                        <CameraIcon className="w-5 h-5" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {avatarPreview && (
                                    <div className="mt-4 space-y-2">
                                        <button
                                            onClick={uploadAvatar}
                                            disabled={avatarProcessing || isUploading}
                                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            {avatarProcessing || isUploading ? 'Uploading...' : 'Save Photo'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAvatarPreview(null);
                                                setAvatarData('avatar', null);
                                            }}
                                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {user.avatar && !avatarPreview && (
                                    <button
                                        onClick={removeAvatar}
                                        className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Remove Photo
                                    </button>
                                )}

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    JPG, PNG or GIF. Max size 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Form */}
                    <div className="xl:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {/* Name */}
                                <div className="md:col-span-2 xl:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2 xl:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.date_of_birth && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>}
                                </div>

                                {/* Bio */}
                                <div className="md:col-span-2 xl:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Tell us about yourself..."
                                    />
                                    {errors.bio && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2 xl:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
                                </div>

                                {/* Region */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Region/State
                                    </label>
                                    <input
                                        type="text"
                                        value={data.region}
                                        onChange={(e) => setData('region', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.region && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.region}</p>}
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.postal_code && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.postal_code}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
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
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
