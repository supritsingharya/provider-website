
/**
 * Get device OS information for Web
 * @returns {string} Device OS
 */
export const getDeviceOS = () => {
    if (typeof window === 'undefined') return 'Server';
    const userAgent = window.navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/android/i.test(userAgent)) return 'Android';
    return 'Web';
};

/**
 * Create a User-Agent string for API requests
 * @returns {string} Custom User-Agent string
 */
export const createUserAgent = () => {
    if (typeof window === 'undefined') return 'ProviderApp/1.0 (Web; Server)';
    return window.navigator.userAgent || 'ProviderApp/1.0 (Web)';
};

/**
 * Get device headers for API requests
 * @returns {Object} Headers object with device information
 */
export const getDeviceHeaders = () => {
    return {
        'User-Agent': createUserAgent(),
        'X-Device-OS': getDeviceOS(),
        'X-Device-Model': 'Web Browser',
        'X-Device-Brand': 'Browser',
        'X-Device-Version': '1.0',
        'X-App-Platform': 'web',
    };
};
