import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ProgressBar from '@/Components/ProgressBar';

export default function FileUploadProgress({ 
    isUploading, 
    progress = 0, 
    fileName = '', 
    onCancel,
    error = null,
    success = false 
}) {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);

    useEffect(() => {
        let interval;
        if (isUploading) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        } else {
            setTimeElapsed(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isUploading]);

    useEffect(() => {
        if (progress > 0 && progress < 100 && timeElapsed > 0) {
            const rate = progress / timeElapsed;
            const remaining = (100 - progress) / rate;
            setEstimatedTimeRemaining(Math.ceil(remaining));
        } else {
            setEstimatedTimeRemaining(null);
        }
    }, [progress, timeElapsed]);

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isUploading && !error && !success) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center mb-4">
                    {success ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                    ) : error ? (
                        <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                    ) : (
                        <div className="h-8 w-8 mr-3">
                            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {success ? 'Upload Complete' : error ? 'Upload Failed' : 'Uploading Document'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {fileName}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                    <div className="mb-4">
                        <ProgressBar 
                            progress={progress} 
                            color="blue" 
                            animated={true}
                            showPercentage={true}
                        />
                    </div>
                )}

                {/* Status Information */}
                <div className="mb-4 space-y-2">
                    {isUploading && (
                        <>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Time elapsed:</span>
                                <span>{formatTime(timeElapsed)}</span>
                            </div>
                            {estimatedTimeRemaining && (
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Estimated remaining:</span>
                                    <span>{formatTime(estimatedTimeRemaining)}</span>
                                </div>
                            )}
                        </>
                    )}
                    
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {error}
                            </p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Document uploaded successfully!
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    {isUploading && onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    )}
                    
                    {(error || success) && (
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {error ? 'Try Again' : 'Continue'}
                        </button>
                    )}
                </div>

                {/* Upload Tips */}
                {isUploading && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Upload Tips:
                        </h4>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Keep this window open until upload completes</li>
                            <li>• Large files may take several minutes to upload</li>
                            <li>• Don't refresh the page during upload</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
