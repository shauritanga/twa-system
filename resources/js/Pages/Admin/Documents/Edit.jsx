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

export default function Edit({ document, categories, visibilityOptions }) {
    const { flash } = usePage().props;
    const { toasts, success, error, warning, removeToast } = useToast();
    
    const [tags, setTags] = useState(document.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: document.title || '',
        description: document.description || '',
        category: document.category || '',
        visibility: document.visibility || 'members_only',
        document_date: document.document_date || '',
        tags: document.tags || [],
        file: null,
        status: document.status || 'active',
        _method: 'PUT',
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
        
        post(route('admin.documents.update', document.id), {
            forceFormData: true,
            onSuccess: () => {
                success('Document Updated', `"${data.title}" has been updated successfully.`);
            },
            onError: (errors) => {
                if (errors.file) {
                    error('Update Failed', errors.file);
                } else {
                    error('Update Failed', 'Failed to update document. Please check your input and try again.');
                }
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
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
        }
    };

    const getFileIcon = (fileType) => {
        const type = fileType?.toLowerCase();
        switch (type) {
            case 'pdf': return '📄';
            case 'doc':
            case 'docx': return '📝';
            case 'xls':
            case 'xlsx': return '📊';
            case 'ppt':
            case 'pptx': return '📋';
            case 'txt': return '📃';
            case 'jpg':
            case 'jpeg':
            case 'png': return '🖼️';
            default: return '📁';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <SidebarLayout>
            <Head title={`Edit Document: ${document.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('admin.documents.show', document.id)}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Document
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Document
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Update document information and optionally replace the file.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Current File Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                    Current File
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getFileIcon(document.file_type)}</span>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                            {document.file_name}
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            {formatFileSize(document.file_size)} • {document.file_type?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Replace File (Optional) */}
                            <div>
                                <InputLabel htmlFor="file" value="Replace File (Optional)" />
                                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                                    data.file 
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
                                                    New File Selected
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
                                                        <span>Upload a replacement file</span>
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
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Leave empty to keep the current file. Upload a new file to replace it.
                                </p>
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
                                    required
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
                                    placeholder="Enter a description for this document..."
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
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {Object.entries(categories).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
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
                                        required
                                    >
                                        {Object.entries(visibilityOptions).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.visibility} className="mt-2" />
                                </div>
                            </div>

                            {/* Document Date and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="document_date" value="Document Date" />
                                    <TextInput
                                        id="document_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.document_date}
                                        onChange={(e) => setData('document_date', e.target.value)}
                                    />
                                    <InputError message={errors.document_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <SelectInput
                                        id="status"
                                        className="mt-1 block w-full"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                        <option value="draft">Draft</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <InputLabel htmlFor="tags" value="Tags" />
                                <div className="mt-1">
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex">
                                        <TextInput
                                            type="text"
                                            className="flex-1"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            placeholder="Add a tag and press Enter"
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

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link href={route('admin.documents.show', document.id)}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing || isUploading} className="flex items-center">
                                    {(processing || isUploading) && (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    )}
                                    {processing || isUploading ? 'Updating Document...' : 'Update Document'}
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
