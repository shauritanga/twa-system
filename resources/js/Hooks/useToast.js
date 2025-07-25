import { useState, useCallback } from 'react';

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'success',
            duration: 5000,
            ...toast,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((title, message, options = {}) => {
        if (!title) return;
        return addToast({ type: 'success', title, message, ...options });
    }, [addToast]);

    const error = useCallback((title, message, options = {}) => {
        if (!title) return;
        return addToast({ type: 'error', title, message, duration: 7000, ...options });
    }, [addToast]);

    const warning = useCallback((title, message, options = {}) => {
        if (!title) return;
        return addToast({ type: 'warning', title, message, duration: 6000, ...options });
    }, [addToast]);

    const info = useCallback((title, message, options = {}) => {
        if (!title) return;
        return addToast({ type: 'info', title, message, ...options });
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearAll,
    };
}
