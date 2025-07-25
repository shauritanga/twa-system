export default function StatusBadge({ 
    status, 
    variant = 'default',
    size = 'md',
    className = '',
    icon = null 
}) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
            case 'error':
            case 'danger':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
            case 'secondary':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'purple':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
            case 'pink':
                return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
            case 'indigo':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-2 py-0.5 text-xs';
            case 'md':
                return 'px-2.5 py-0.5 text-xs';
            case 'lg':
                return 'px-3 py-1 text-sm';
            default:
                return 'px-2.5 py-0.5 text-xs';
        }
    };

    return (
        <span className={`
            inline-flex items-center font-medium rounded-full
            ${getVariantClasses()}
            ${getSizeClasses()}
            ${className}
        `}>
            {icon && (
                <span className="mr-1">
                    {icon}
                </span>
            )}
            {status}
        </span>
    );
}

// Predefined status badges for common use cases
export function PublishedBadge({ className = '' }) {
    return (
        <StatusBadge 
            status="Published" 
            variant="success" 
            className={className}
            icon={<span className="w-2 h-2 bg-green-500 rounded-full" />}
        />
    );
}

export function DraftBadge({ className = '' }) {
    return (
        <StatusBadge 
            status="Draft" 
            variant="secondary" 
            className={className}
            icon={<span className="w-2 h-2 bg-gray-500 rounded-full" />}
        />
    );
}

export function ArchivedBadge({ className = '' }) {
    return (
        <StatusBadge 
            status="Archived" 
            variant="warning" 
            className={className}
            icon={<span className="w-2 h-2 bg-yellow-500 rounded-full" />}
        />
    );
}

export function UnpublishedBadge({ className = '' }) {
    return (
        <StatusBadge 
            status="Unpublished" 
            variant="warning" 
            className={className}
            icon={<span className="w-2 h-2 bg-orange-500 rounded-full" />}
        />
    );
}

export function ProcessingBadge({ className = '' }) {
    return (
        <StatusBadge 
            status="Processing" 
            variant="info" 
            className={className}
            icon={
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            }
        />
    );
}
