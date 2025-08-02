/**
 * Session and Cache Utilities
 * Helps prevent login issues caused by browser caching and stale sessions
 */

/**
 * Clear browser cache for authentication-related data
 */
export const clearAuthCache = async () => {
    try {
        // Clear service worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            const authCaches = cacheNames.filter(name => 
                name.includes('auth') || 
                name.includes('login') || 
                name.includes('session')
            );
            
            await Promise.all(authCaches.map(name => caches.delete(name)));
        }

        // Clear localStorage auth data
        const authKeys = Object.keys(localStorage).filter(key =>
            key.includes('auth') ||
            key.includes('login') ||
            key.includes('session') ||
            key.includes('token')
        );
        
        authKeys.forEach(key => localStorage.removeItem(key));

        // Clear sessionStorage auth data
        const sessionKeys = Object.keys(sessionStorage).filter(key =>
            key.includes('auth') ||
            key.includes('login') ||
            key.includes('session') ||
            key.includes('token')
        );
        
        sessionKeys.forEach(key => sessionStorage.removeItem(key));

    } catch (error) {
        console.warn('Could not clear auth cache:', error);
    }
};

/**
 * Force page reload if coming from browser cache
 */
export const handleCacheNavigation = () => {
    // Check if page was loaded from cache
    if (performance.navigation?.type === 2) { // Back/forward cache
        window.location.reload();
        return true;
    }
    
    // Check for stale page indicators
    const pageLoadTime = performance.timing?.navigationStart;
    const now = Date.now();
    const timeDiff = now - pageLoadTime;
    
    // If page seems to be from cache (loaded very quickly), reload
    if (timeDiff < 100) {
        window.location.reload();
        return true;
    }
    
    return false;
};

/**
 * Add cache-busting parameters to requests
 */
export const addCacheBuster = (url) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}&_r=${Math.random()}`;
};

/**
 * Set up page visibility change handler to refresh stale sessions
 */
export const setupVisibilityHandler = () => {
    let isHidden = false;
    let hiddenTime = null;

    const handleVisibilityChange = () => {
        if (document.hidden) {
            isHidden = true;
            hiddenTime = Date.now();
        } else if (isHidden) {
            isHidden = false;
            const timeHidden = Date.now() - hiddenTime;
            
            // If page was hidden for more than 30 minutes, refresh
            if (timeHidden > 30 * 60 * 1000) {
                window.location.reload();
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
};

/**
 * Prevent form resubmission on page refresh
 */
export const preventFormResubmission = () => {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
};

/**
 * Check if current session is valid
 */
export const checkSessionValidity = async () => {
    try {
        const response = await fetch('/api/session-check', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            }
        });
        
        return response.ok;
    } catch (error) {
        console.warn('Session check failed:', error);
        return false;
    }
};

/**
 * Initialize session utilities
 */
export const initSessionUtils = () => {
    // Clear auth cache on initialization
    clearAuthCache();
    
    // Handle cache navigation
    handleCacheNavigation();
    
    // Set up visibility handler
    const cleanupVisibility = setupVisibilityHandler();
    
    // Prevent form resubmission
    preventFormResubmission();
    
    // Return cleanup function
    return () => {
        cleanupVisibility();
    };
};

/**
 * Handle logout with proper cleanup
 */
export const handleLogout = async () => {
    // Clear all auth-related data
    await clearAuthCache();
    
    // Clear cookies by setting them to expire
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes('session') || name.includes('auth') || name.includes('login')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    });
    
    // Force reload to ensure clean state
    window.location.href = '/';
};
