import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import FileInput from '@/Components/FileInput';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import { ArrowLeftIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function Create() {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        type: 'general',
        status: 'draft',
        link_url: '',
        link_text: '',
        image_file: null,
        video_file: null,
        video_url: '',
        media_type: 'none',
        image_alt_text: '',
        announcement_date: new Date().toISOString().split('T')[0],
        expires_at: '',
        is_featured: false,
        sort_order: 0,
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            success('Success', flash.success);
        }
        if (flash?.error) {
            error('Error', flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            onSuccess: () => {
                success('Success', 'Announcement created successfully');
            },
            onError: () => {
                error('Error', 'Failed to create announcement');
            }
        });
    };

    return (
        <SidebarLayout>
            <Head title="Create Announcement" />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <Link href={route('admin.announcements.index')}>
                                <SecondaryButton>
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Announcements
                                </SecondaryButton>
                            </Link>
                        </div>
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                            <SpeakerWaveIcon className="h-8 w-8 mr-3 text-blue-600" />
                            Create New Announcement
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new announcement for the website
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="type" value="Type" />
                                    <SelectInput
                                        id="type"
                                        className="mt-1 block w-full"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="general">General</option>
                                        <option value="important">Important</option>
                                        <option value="event">Event</option>
                                        <option value="update">Update</option>
                                    </SelectInput>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <SelectInput
                                        id="status"
                                        className="mt-1 block w-full"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Content" />
                                <TextArea
                                    id="content"
                                    className="mt-1 block w-full"
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    required
                                />
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            {/* Media Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Media (Optional)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="media_type" value="Media Type" />
                                        <SelectInput
                                            id="media_type"
                                            className="mt-1 block w-full"
                                            value={data.media_type}
                                            onChange={(e) => setData('media_type', e.target.value)}
                                        >
                                            <option value="none">No Media</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video File</option>
                                            <option value="video_url">Video URL (YouTube)</option>
                                        </SelectInput>
                                        <InputError message={errors.media_type} className="mt-2" />
                                    </div>

                                    {data.media_type === 'image' && (
                                        <>
                                            <div className="md:col-span-2">
                                                <FileInput
                                                    id="image_file"
                                                    name="image_file"
                                                    label="Upload Image"
                                                    accept="image/*"
                                                    maxSize={5}
                                                    value={data.image_file}
                                                    onChange={(file, error) => {
                                                        setData('image_file', file);
                                                        if (error) {
                                                            // Handle error if needed
                                                            console.error('Image upload error:', error);
                                                        }
                                                    }}
                                                    error={errors.image_file}
                                                    description="JPEG, PNG, JPG, GIF, WebP up to 5MB"
                                                    preview={true}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor="image_alt_text" value="Image Alt Text" />
                                                <TextInput
                                                    id="image_alt_text"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.image_alt_text}
                                                    onChange={(e) => setData('image_alt_text', e.target.value)}
                                                    placeholder="Describe the image for accessibility"
                                                />
                                                <InputError message={errors.image_alt_text} className="mt-2" />
                                            </div>
                                        </>
                                    )}

                                    {data.media_type === 'video' && (
                                        <div className="md:col-span-2">
                                            <FileInput
                                                id="video_file"
                                                name="video_file"
                                                label="Upload Video"
                                                accept="video/*"
                                                maxSize={50}
                                                value={data.video_file}
                                                onChange={(file, error) => {
                                                    setData('video_file', file);
                                                    if (error) {
                                                        // Handle error if needed
                                                        console.error('Video upload error:', error);
                                                    }
                                                }}
                                                error={errors.video_file}
                                                description="MP4, AVI, MOV, WMV, FLV, WebM up to 50MB"
                                                preview={false}
                                            />
                                        </div>
                                    )}

                                    {data.media_type === 'video_url' && (
                                        <div>
                                            <InputLabel htmlFor="video_url" value="Video URL" />
                                            <TextInput
                                                id="video_url"
                                                type="url"
                                                className="mt-1 block w-full"
                                                value={data.video_url}
                                                onChange={(e) => setData('video_url', e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                            <InputError message={errors.video_url} className="mt-2" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Link Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Call to Action (Optional)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="link_url" value="Link URL" />
                                        <TextInput
                                            id="link_url"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.link_url}
                                            onChange={(e) => setData('link_url', e.target.value)}
                                            placeholder="https://example.com or #section"
                                        />
                                        <InputError message={errors.link_url} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="link_text" value="Link Text" />
                                        <TextInput
                                            id="link_text"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.link_text}
                                            onChange={(e) => setData('link_text', e.target.value)}
                                            placeholder="Learn More"
                                        />
                                        <InputError message={errors.link_text} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Scheduling */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Scheduling</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel htmlFor="announcement_date" value="Announcement Date" />
                                        <TextInput
                                            id="announcement_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.announcement_date}
                                            onChange={(e) => setData('announcement_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.announcement_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="expires_at" value="Expires At (Optional)" />
                                        <TextInput
                                            id="expires_at"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.expires_at}
                                            onChange={(e) => setData('expires_at', e.target.value)}
                                        />
                                        <InputError message={errors.expires_at} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sort_order" value="Sort Order" />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', e.target.value)}
                                            min="0"
                                        />
                                        <InputError message={errors.sort_order} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                            Featured announcement (appears prominently)
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link href={route('admin.announcements.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Announcement'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
        </SidebarLayout>
    );
}
