export default function ProgressBar({ 
    progress = 0, 
    className = '', 
    size = 'md',
    color = 'blue',
    showPercentage = true,
    animated = true 
}) {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-2';
            case 'md':
                return 'h-3';
            case 'lg':
                return 'h-4';
            default:
                return 'h-3';
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'blue':
                return 'bg-blue-600';
            case 'green':
                return 'bg-green-600';
            case 'red':
                return 'bg-red-600';
            case 'yellow':
                return 'bg-yellow-600';
            case 'purple':
                return 'bg-purple-600';
            default:
                return 'bg-blue-600';
        }
    };

    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${getSizeClasses()}`}>
                <div
                    className={`${getSizeClasses()} ${getColorClasses()} rounded-full transition-all duration-300 ease-out ${
                        animated ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {showPercentage && (
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Progress
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(clampedProgress)}%
                    </span>
                </div>
            )}
        </div>
    );
}

// Circular Progress Component
export function CircularProgress({ 
    progress = 0, 
    size = 'md', 
    color = 'blue',
    showPercentage = true,
    className = ''
}) {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return { width: 40, height: 40, strokeWidth: 4 };
            case 'md':
                return { width: 60, height: 60, strokeWidth: 6 };
            case 'lg':
                return { width: 80, height: 80, strokeWidth: 8 };
            default:
                return { width: 60, height: 60, strokeWidth: 6 };
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'blue':
                return 'text-blue-600';
            case 'green':
                return 'text-green-600';
            case 'red':
                return 'text-red-600';
            case 'yellow':
                return 'text-yellow-600';
            case 'purple':
                return 'text-purple-600';
            default:
                return 'text-blue-600';
        }
    };

    const { width, height, strokeWidth } = getSizeClasses();
    const radius = (width - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg
                width={width}
                height={height}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={width / 2}
                    cy={height / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={width / 2}
                    cy={height / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${getColorClass()} transition-all duration-300 ease-out`}
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-medium ${getColorClass()}`}>
                        {Math.round(clampedProgress)}%
                    </span>
                </div>
            )}
        </div>
    );
}
