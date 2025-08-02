import { useState } from 'react';
import { DocumentIcon, PhotoIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FileInput({ 
    id,
    name,
    accept,
    maxSize = 5, // MB
    value,
    onChange,
    error,
    label,
    description,
    preview = true,
    className = '',
    disabled = false
}) {
    const [dragOver, setDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file) => {
        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `File size must be less than ${maxSize}MB. Current size: ${formatFileSize(file.size)}`;
        }

        // Check file type if accept is specified
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const mimeType = file.type;
            
            const isValidType = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type;
                }
                return mimeType.match(type.replace('*', '.*'));
            });

            if (!isValidType) {
                return `Invalid file type. Accepted types: ${accept}`;
            }
        }

        return null;
    };

    const handleFileChange = (file) => {
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            onChange(null, validationError);
            return;
        }

        // Create preview URL for images
        if (preview && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }

        onChange(file, null);
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        if (disabled) return;
        
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!disabled) {
            setDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const clearFile = () => {
        setPreviewUrl(null);
        onChange(null, null);
        // Clear the input
        const input = document.getElementById(id);
        if (input) input.value = '';
    };

    const getFileIcon = (file) => {
        if (!file) return <DocumentIcon className="w-8 h-8" />;
        
        if (file.type.startsWith('image/')) {
            return <PhotoIcon className="w-8 h-8" />;
        } else if (file.type.startsWith('video/')) {
            return <VideoCameraIcon className="w-8 h-8" />;
        }
        return <DocumentIcon className="w-8 h-8" />;
    };

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 transition-colors
                    ${dragOver 
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${error ? 'border-red-300 dark:border-red-600' : ''}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && document.getElementById(id)?.click()}
            >
                <input
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="sr-only"
                    disabled={disabled}
                />

                {value ? (
                    <div className="space-y-4">
                        {/* File Preview */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 text-gray-400">
                                {getFileIcon(value)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {value.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatFileSize(value.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="mt-4">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        )}

                        {/* Change File Button */}
                        <div className="text-center">
                            <span className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Click to change file
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                            <DocumentIcon className="w-full h-full" />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                Click to upload
                            </span>
                            {' or drag and drop'}
                        </div>
                        {description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
