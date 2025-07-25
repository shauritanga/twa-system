import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { ToastContainer } from '@/Components/Toast';
import { useToast } from '@/Hooks/useToast';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { ArrowLeftIcon, DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Create({ categories, visibilityOptions }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        visibility: 'members_only',
        document_date: '',
        tags: [],
        file: null,
        publish_immediately: true,
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

        // Validation
        if (!data.file) {
            error('File Required', 'Please select a file to upload.');
            return;
        }

        if (!data.title.trim()) {
            error('Title Required', 'Please enter a document title.');
            return;
        }

        if (!data.category) {
            error('Category Required', 'Please select a document category.');
            return;
        }

        // Update tags in form data
        setData('tags', tags);
        setIsUploading(true);

        post(route('admin.documents.store'), {
            forceFormData: true,
            onSuccess: () => {
                success('Document Uploaded', `"${data.title}" has been uploaded successfully.`);
                reset();
                setTags([]);
                setUploadProgress(0);
            },
            onError: (errors) => {
                if (errors.file) {
                    error('Upload Failed', errors.file);
                } else {
                    error('Upload Failed', 'Failed to upload document. Please check your input and try again.');
                }
            },
            onFinish: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setData('tags', newTags);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setData('tags', newTags);
    };

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file size (15MB limit)
            if (file.size > 15 * 1024 * 1024) {
                error('File Too Large', `File size must be less than 15MB. Current file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                e.target.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png'];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                error('Invalid File Type', 'Please select a valid file type (PDF, DOC, XLS, PPT, TXT, or image).');
                e.target.value = '';
                return;
            }

            setData('file', file);
            success('File Selected', `"${file.name}" selected successfully.`);

            // Auto-fill title from filename if title is empty
            if (!data.title) {
                const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                setData('title', fileName);
            }
        }
    };

    return (
        <SidebarLayout>
            <Head title="Upload Document" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <Link
                                href={route('admin.documents.index')}
                                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                                Upload Document
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Upload a new document to share with group members
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* File Upload */}
                            <div>
                                <InputLabel htmlFor="file" value="Document File *" />
                                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${data.file
                                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <div className="space-y-1 text-center">
                                        {data.file ? (
                                            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                                        ) : (
                                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        )}

                                        {data.file ? (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    File Selected Successfully
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {data.file.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                                <label
                                                    htmlFor="file"
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-600 hover:text-blue-500 cursor-pointer"
                                                >
                                                    Change File
                                                    <input
                                                        id="file"
                                                        name="file"
                                                        type="file"
                                                        className="sr-only"
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label
                                                        htmlFor="file"
                                                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file"
                                                            name="file"
                                                            type="file"
                                                            className="sr-only"
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PDF, DOC, XLS, PPT, TXT, JPG, PNG up to 15MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <InputError message={errors.file} className="mt-2" />
                            </div>

                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Document Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter document title"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter document description (optional)"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Category and Visibility */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="category" value="Category *" />
                                    <SelectInput
                                        id="category"
                                        className="mt-1 block w-full"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {Object.entries(categories).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="visibility" value="Visibility *" />
                                    <SelectInput
                                        id="visibility"
                                        className="mt-1 block w-full"
                                        value={data.visibility}
                                        onChange={(e) => setData('visibility', e.target.value)}
                                    >
                                        {Object.entries(visibilityOptions).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.visibility} className="mt-2" />
                                </div>
                            </div>

                            {/* Document Date */}
                            <div>
                                <InputLabel htmlFor="document_date" value="Document Date" />
                                <TextInput
                                    id="document_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.document_date}
                                    onChange={(e) => setData('document_date', e.target.value)}
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    The date this document refers to (e.g., meeting date)
                                </p>
                                <InputError message={errors.document_date} className="mt-2" />
                            </div>

                            {/* Tags */}
                            <div>
                                <InputLabel htmlFor="tags" value="Tags" />
                                <div className="mt-1">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                                                >
                                                    <span className="sr-only">Remove tag</span>
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <TextInput
                                            type="text"
                                            className="flex-1"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            placeholder="Add tags (press Enter to add)"
                                        />
                                        <SecondaryButton
                                            type="button"
                                            onClick={addTag}
                                            className="ml-2"
                                        >
                                            Add
                                        </SecondaryButton>
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Add tags to help categorize and search for this document
                                </p>
                                <InputError message={errors.tags} className="mt-2" />
                            </div>

                            {/* Publish Option */}
                            <div className="flex items-center">
                                <input
                                    id="publish_immediately"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={data.publish_immediately}
                                    onChange={(e) => setData('publish_immediately', e.target.checked)}
                                />
                                <label htmlFor="publish_immediately" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Publish immediately (make visible to members)
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link href={route('admin.documents.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing || isUploading} className="flex items-center">
                                    {(processing || isUploading) && (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    )}
                                    {processing || isUploading ? 'Uploading Document...' : 'Upload Document'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </SidebarLayout>
    );
}
