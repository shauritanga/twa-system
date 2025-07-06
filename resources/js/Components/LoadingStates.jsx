import React from 'react';

// Spinner component
export const Spinner = ({ size = 'md', color = 'blue' }) => {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const colorClasses = {
        blue: 'text-blue-600',
        gray: 'text-gray-600',
        white: 'text-white',
        green: 'text-green-600',
        red: 'text-red-600',
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
};

// Loading button component
export const LoadingButton = ({ 
    loading = false, 
    children, 
    className = '', 
    disabled = false,
    loadingText = 'Loading...',
    ...props 
}) => {
    return (
        <button
            className={`btn-primary relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size="sm" color="white" />
                    <span className="ml-2 text-sm">{loadingText}</span>
                </div>
            )}
            <span className={loading ? 'invisible' : 'visible'}>
                {children}
            </span>
        </button>
    );
};

// Skeleton loader for cards
export const SkeletonCard = () => {
    return (
        <div className="card animate-pulse">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

// Skeleton loader for table rows
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="card">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {[...Array(columns)].map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[...Array(rows)].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {[...Array(columns)].map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Page loading overlay
export const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75">
            <div className="text-center">
                <Spinner size="xl" color="blue" />
                <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{message}</p>
            </div>
        </div>
    );
};

// Inline loading state
export const InlineLoader = ({ message = 'Loading...', size = 'md' }) => {
    return (
        <div className="flex items-center justify-center py-8">
            <Spinner size={size} color="blue" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">{message}</span>
        </div>
    );
};

// Progress bar component
export const ProgressBar = ({ progress = 0, className = '', showPercentage = true }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                {showPercentage && (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
                )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                ></div>
            </div>
        </div>
    );
};

// Pulse animation for loading states
export const PulseLoader = ({ className = '' }) => {
    return (
        <div className={`flex space-x-2 ${className}`}>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );
};

// Fade in animation wrapper
export const FadeIn = ({ children, delay = 0, className = '' }) => {
    return (
        <div 
            className={`animate-fade-in ${className}`}
            style={{ 
                animationDelay: `${delay}ms`,
                animationFillMode: 'both'
            }}
        >
            {children}
        </div>
    );
};

// Slide up animation wrapper
export const SlideUp = ({ children, delay = 0, className = '' }) => {
    return (
        <div 
            className={`animate-slide-up ${className}`}
            style={{ 
                animationDelay: `${delay}ms`,
                animationFillMode: 'both'
            }}
        >
            {children}
        </div>
    );
};
