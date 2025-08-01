export default function LoadingSpinner({ size = 'md', className = '', text = '' }) {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-4 w-4';
            case 'md':
                return 'h-6 w-6';
            case 'lg':
                return 'h-8 w-8';
            case 'xl':
                return 'h-12 w-12';
            default:
                return 'h-6 w-6';
        }
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex items-center space-x-2">
                <svg
                    className={`animate-spin ${getSizeClasses()} text-blue-600`}
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
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                {text && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
}

// Overlay Loading Spinner
export function LoadingOverlay({ show, text = 'Loading...' }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
                <LoadingSpinner size="lg" text={text} />
            </div>
        </div>
    );
}
