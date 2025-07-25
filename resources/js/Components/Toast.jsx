import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Toast({ show = false, type = 'success', title = '', message = '', onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);

        if (show && duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose && onClose(), 300); // Wait for animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
            case 'error':
                return <XCircleIcon className="h-6 w-6 text-red-400" />;
            case 'warning':
                return <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" />;
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
            default:
                return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/20';
            default:
                return 'bg-green-50 dark:bg-green-900/20';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-green-200 dark:border-green-800';
            case 'error':
                return 'border-red-200 dark:border-red-800';
            case 'warning':
                return 'border-yellow-200 dark:border-yellow-800';
            case 'info':
                return 'border-blue-200 dark:border-blue-800';
            default:
                return 'border-green-200 dark:border-green-800';
        }
    };

    return (
        <Transition
            show={isVisible}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`max-w-sm w-full ${getBackgroundColor()} ${getBorderColor()} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {title}
                            </p>
                            {message && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {message}
                                </p>
                            )}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleClose}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        show={true}
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                ))}
            </div>
        </div>
    );
}
