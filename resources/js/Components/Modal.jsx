import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    title,
    className = '',
    icon = null,
    iconColor = 'indigo', // indigo, blue, red, green
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const getIconColorClasses = () => {
        const colorMap = {
            indigo: 'from-indigo-500 to-purple-600',
            blue: 'from-blue-500 to-indigo-600',
            red: 'from-red-500 to-orange-600',
            green: 'from-green-500 to-emerald-600',
        };
        return colorMap[iconColor] || colorMap.indigo;
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        '7xl': 'sm:max-w-7xl',
        full: 'sm:max-w-full',
    }[maxWidth];

    // Render modal at document root to avoid stacking context issues
    const modalContent = (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-[9999] overflow-y-auto"
                onClose={close}
                static={!closeable}
            >
                {/* Background overlay - must be above header */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" aria-hidden="true" />
                </TransitionChild>

                {/* Modal positioning */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel
                                className={`
                                    relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800
                                    text-left shadow-2xl transition-all border border-gray-200 dark:border-gray-700
                                    w-full max-w-lg sm:my-8 sm:w-full ${maxWidthClass}
                                    ${className}
                                `}
                            >
                                {/* Header with close button */}
                                {(title || closeable) && (
                                    <div className="bg-gradient-to-r from-gray-50 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-700 dark:to-gray-600 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        {title && (
                                            <div className="flex items-center">
                                                <div className={`p-2 bg-gradient-to-r ${getIconColorClasses()} rounded-xl shadow-lg mr-3`}>
                                                    {icon || (
                                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {title}
                                                </h3>
                                            </div>
                                        )}
                                        {closeable && (
                                            <button
                                                type="button"
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                                onClick={close}
                                                aria-label="Close modal"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Modal content */}
                                <div className={title || closeable ? '' : 'p-4 sm:p-6'}>
                                    {children}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    // Use portal to render at document root, avoiding stacking context issues
    return typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : modalContent;
}
