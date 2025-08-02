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
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Create() {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        full_description: '',
        goal_amount: '',
        status: 'draft',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        image_file: null,
        video_file: null,
        video_url: '',
        payment_methods: ['bank_transfer', 'mobile_money'],
        bank_details: '',
        mobile_money_number: '',
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

        // Transform data to ensure proper boolean handling
        const transformedData = {
            ...data,
            is_featured: data.is_featured ? 1 : 0
        };

        post(route('admin.fundraising-campaigns.store'), {
            data: transformedData,
            forceFormData: true,
            onSuccess: () => {
                success('Success', 'Fundraising campaign created successfully');
            },
            onError: (errors) => {
                console.log('Create errors:', errors);
                error('Error', 'Failed to create campaign. Please check the form for errors.');
            }
        });
    };

    const handlePaymentMethodChange = (method, checked) => {
        if (checked) {
            setData('payment_methods', [...data.payment_methods, method]);
        } else {
            setData('payment_methods', data.payment_methods.filter(m => m !== method));
        }
    };

    return (
        <SidebarLayout>
            <Head title="Create Fundraising Campaign" />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <Link href={route('admin.fundraising-campaigns.index')}>
                                <SecondaryButton>
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Campaigns
                                </SecondaryButton>
                            </Link>
                        </div>
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                            <HeartIcon className="h-8 w-8 mr-3 text-red-600" />
                            Create New Campaign
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new fundraising campaign
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="title" value="Campaign Title" />
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
                                    <InputLabel htmlFor="goal_amount" value="Goal Amount (TZS)" />
                                    <TextInput
                                        id="goal_amount"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.goal_amount}
                                        onChange={(e) => setData('goal_amount', e.target.value)}
                                        min="1"
                                        required
                                    />
                                    <InputError message={errors.goal_amount} className="mt-2" />
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
                                        <option value="paused">Paused</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Short Description" />
                                <TextArea
                                    id="description"
                                    className="mt-1 block w-full"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description for campaign cards"
                                    required
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="full_description" value="Full Description" />
                                <TextArea
                                    id="full_description"
                                    className="mt-1 block w-full"
                                    rows={6}
                                    value={data.full_description}
                                    onChange={(e) => setData('full_description', e.target.value)}
                                    placeholder="Detailed description of the campaign goals and impact"
                                />
                                <InputError message={errors.full_description} className="mt-2" />
                            </div>

                            {/* Media Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Media (Optional)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <FileInput
                                            id="image_file"
                                            name="image_file"
                                            label="Upload Campaign Image"
                                            accept="image/*"
                                            maxSize={5}
                                            value={data.image_file}
                                            onChange={(file, error) => {
                                                setData('image_file', file);
                                                if (error) {
                                                    console.error('Image upload error:', error);
                                                }
                                            }}
                                            error={errors.image_file}
                                            description="JPEG, PNG, JPG, GIF, WebP up to 5MB"
                                            preview={true}
                                        />
                                    </div>

                                    <div>
                                        <FileInput
                                            id="video_file"
                                            name="video_file"
                                            label="Upload Campaign Video (Optional)"
                                            accept="video/*"
                                            maxSize={50}
                                            value={data.video_file}
                                            onChange={(file, error) => {
                                                setData('video_file', file);
                                                if (error) {
                                                    console.error('Video upload error:', error);
                                                }
                                            }}
                                            error={errors.video_file}
                                            description="MP4, AVI, MOV, WMV, FLV, WebM up to 50MB"
                                            preview={false}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <InputLabel htmlFor="video_url" value="Or Video URL (YouTube/Vimeo)" />
                                    <TextInput
                                        id="video_url"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.video_url}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                                    />
                                    <InputError message={errors.video_url} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        You can either upload a video file above or provide a YouTube/Vimeo URL here
                                    </p>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { value: 'bank_transfer', label: 'Bank Transfer' },
                                            { value: 'mobile_money', label: 'Mobile Money' },
                                            { value: 'cash', label: 'Cash' },
                                        ].map((method) => (
                                            <label key={method.value} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={data.payment_methods.includes(method.value)}
                                                    onChange={(e) => handlePaymentMethodChange(method.value, e.target.checked)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {method.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="bank_details" value="Bank Details" />
                                            <TextArea
                                                id="bank_details"
                                                className="mt-1 block w-full"
                                                rows={4}
                                                value={data.bank_details}
                                                onChange={(e) => setData('bank_details', e.target.value)}
                                                placeholder="Account Name: Campaign Name&#10;Bank: Bank Name&#10;Account Number: 123456789"
                                            />
                                            <InputError message={errors.bank_details} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="mobile_money_number" value="Mobile Money Number" />
                                            <TextInput
                                                id="mobile_money_number"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.mobile_money_number}
                                                onChange={(e) => setData('mobile_money_number', e.target.value)}
                                                placeholder="+255 123 456 789"
                                            />
                                            <InputError message={errors.mobile_money_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scheduling */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Campaign Schedule</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Start Date" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="end_date" value="End Date (Optional)" />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
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
                                            Featured campaign (appears prominently)
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link href={route('admin.fundraising-campaigns.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Campaign'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
        </SidebarLayout>
    );
}
