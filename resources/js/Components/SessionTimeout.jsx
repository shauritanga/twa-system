import { useEffect, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function SessionTimeout({ enabled = true }) {
    const [showWarning, setShowWarning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [timeoutMinutes, setTimeoutMinutes] = useState(15);
    const [isExtending, setIsExtending] = useState(false);

    // Format time display
    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    }, []);

    // Check for session timeout warning
    const checkWarning = useCallback(async () => {
        if (!enabled) return;

        try {
            const response = await fetch(route('session.warning'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.show_warning) {
                    setShowWarning(true);
                    setRemainingSeconds(data.remaining_seconds);
                    setTimeoutMinutes(data.timeout_minutes);
                }
            } else if (response.status === 401) {
                // Session already expired, redirect to login
                window.location.href = route('login');
            }
        } catch (error) {
            console.error('Error checking session warning:', error);
        }
    }, [enabled]);

    // Extend session
    const extendSession = async () => {
        setIsExtending(true);
        
        try {
            const response = await fetch(route('session.extend'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.success) {
                    setShowWarning(false);
                    setRemainingSeconds(data.new_remaining_seconds);
                    
                    // Show success message briefly
                    // You could add a toast notification here
                }
            } else if (response.status === 401) {
                // Session expired, redirect to login
                window.location.href = route('login');
            }
        } catch (error) {
            console.error('Error extending session:', error);
        } finally {
            setIsExtending(false);
        }
    };

    // Logout immediately
    const logoutNow = () => {
        router.post(route('logout'));
    };

    // Update remaining time countdown
    useEffect(() => {
        if (!showWarning || remainingSeconds <= 0) return;

        const timer = setInterval(() => {
            setRemainingSeconds(prev => {
                const newTime = prev - 1;
                
                if (newTime <= 0) {
                    // Time's up, redirect to login
                    window.location.href = route('login');
                    return 0;
                }
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showWarning, remainingSeconds]);

    // Check for warnings periodically
    useEffect(() => {
        if (!enabled) return;

        // Check immediately
        checkWarning();

        // Then check every 30 seconds
        const interval = setInterval(checkWarning, 30000);

        return () => clearInterval(interval);
    }, [enabled, checkWarning]);

    // Activity detection to update session
    useEffect(() => {
        if (!enabled) return;

        const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        let lastActivity = Date.now();

        const handleActivity = () => {
            const now = Date.now();
            
            // Only send heartbeat if it's been more than 30 seconds since last activity
            if (now - lastActivity > 30000) {
                lastActivity = now;
                
                // Send heartbeat to server
                fetch(route('session.heartbeat'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    },
                    credentials: 'same-origin',
                }).catch(error => {
                    console.error('Error sending heartbeat:', error);
                });
            }
        };

        // Add event listeners
        activities.forEach(activity => {
            document.addEventListener(activity, handleActivity, true);
        });

        // Cleanup
        return () => {
            activities.forEach(activity => {
                document.removeEventListener(activity, handleActivity, true);
            });
        };
    }, [enabled]);

    if (!enabled || !showWarning) {
        return null;
    }

    return (
        <Modal show={showWarning} onClose={() => {}} maxWidth="md" closeable={false}>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Session Timeout Warning
                        </h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your session will expire due to inactivity. You will be automatically logged out in:
                    </p>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-2">
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatTime(remainingSeconds)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Session timeout: {timeoutMinutes} minutes of inactivity
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between space-x-4">
                    <SecondaryButton
                        onClick={logoutNow}
                        className="flex-1"
                    >
                        Logout Now
                    </SecondaryButton>

                    <PrimaryButton
                        onClick={extendSession}
                        disabled={isExtending}
                        className="flex-1"
                    >
                        {isExtending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Extending...
                            </>
                        ) : (
                            'Stay Logged In'
                        )}
                    </PrimaryButton>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Click "Stay Logged In" to extend your session by another {timeoutMinutes} minutes.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
