/* ========================================
   KME Pest Control - Utility Helpers
   Reusable utility functions
======================================== */

'use strict';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function calls
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Get element by selector with error handling
 */
export const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
};

/**
 * Get all elements by selector
 */
export const getAllElements = (selector) => {
    return document.querySelectorAll(selector);
};

/**
 * Add class with existence check
 */
export const addClass = (element, className) => {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
};

/**
 * Remove class with existence check
 */
export const removeClass = (element, className) => {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
};

/**
 * Toggle class
 */
export const toggleClass = (element, className) => {
    if (element) {
        element.classList.toggle(className);
    }
};

/**
 * Check if element has class
 */
export const hasClass = (element, className) => {
    return element && element.classList.contains(className);
};

/**
 * Smooth scroll to element
 */
export const smoothScroll = (element, offset = 0) => {
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

/**
 * Get viewport dimensions
 */
export const getViewport = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewport = getViewport();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewport.height &&
        rect.right <= viewport.width
    );
};

/**
 * Wait for element to be available
 */
export const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format Malaysian phone numbers
    if (cleaned.startsWith('60')) {
        return `+${cleaned}`;
    } else if (cleaned.startsWith('01')) {
        return `+60${cleaned.substring(1)}`;
    } else if (cleaned.length === 9 || cleaned.length === 10) {
        return `+60${cleaned}`;
    }
    
    return phone;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Malaysian phone number
 */
export const isValidMalaysianPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    // Malaysian mobile numbers: 01x-xxxx-xxxx (10-11 digits)
    return /^(\+?6?01[0-9]{1}[0-9]{7,8})$/.test(cleaned) || /^(01[0-9]{1}[0-9]{7,8})$/.test(cleaned);
};

/**
 * Generate unique ID
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object (simple version)
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

/**
 * Local storage helpers with error handling
 */
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.warn('Failed to clear localStorage:', e);
            return false;
        }
    }
};

/**
 * Cookie helpers
 */
export const cookie = {
    set: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    delete: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};
