import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { ExclamationTriangleIcon, TrashIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ConfirmationModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // danger, warning, info, success
    isProcessing = false,
    processingText = 'Processing...',
}) {
    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <TrashIcon className="h-6 w-6 text-red-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
            default:
                return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
        }
    };

    const getIconBackground = () => {
        switch (type) {
            case 'danger':
                return 'bg-red-100 dark:bg-red-900/20';
            case 'warning':
                return 'bg-yellow-100 dark:bg-yellow-900/20';
            case 'success':
                return 'bg-green-100 dark:bg-green-900/20';
            case 'info':
                return 'bg-blue-100 dark:bg-blue-900/20';
            default:
                return 'bg-red-100 dark:bg-red-900/20';
        }
    };

    const getConfirmButton = () => {
        switch (type) {
            case 'danger':
                return (
                    <DangerButton onClick={onConfirm} disabled={isProcessing}>
                        {isProcessing ? processingText : confirmText}
                    </DangerButton>
                );
            case 'warning':
                return (
                    <PrimaryButton 
                        onClick={onConfirm} 
                        disabled={isProcessing}
                        className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                    >
                        {isProcessing ? processingText : confirmText}
                    </PrimaryButton>
                );
            case 'success':
                return (
                    <PrimaryButton 
                        onClick={onConfirm} 
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    >
                        {isProcessing ? processingText : confirmText}
                    </PrimaryButton>
                );
            case 'info':
                return (
                    <PrimaryButton onClick={onConfirm} disabled={isProcessing}>
                        {isProcessing ? processingText : confirmText}
                    </PrimaryButton>
                );
            default:
                return (
                    <DangerButton onClick={onConfirm} disabled={isProcessing}>
                        {isProcessing ? processingText : confirmText}
                    </DangerButton>
                );
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" closeable={!isProcessing}>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${getIconBackground()}`}>
                        {getIcon()}
                    </div>
                </div>
                
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                        <SecondaryButton 
                            onClick={onClose} 
                            disabled={isProcessing}
                        >
                            {cancelText}
                        </SecondaryButton>
                        {getConfirmButton()}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
