/* ========================================
   KME Pest Control - Main JavaScript (Optimized)
   Core functionality with modular imports
======================================== */

'use strict';

// ========================================
// GLOBAL CONFIGURATION
// ========================================

const CONFIG = {
    API_BASE_URL: 'https://pakaranaianai.com/wp-json/wp/v2/',
    ANIMATION_DURATION: 300,
    CAROUSEL_AUTO_PLAY: true,
    CAROUSEL_INTERVAL: 5000,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
};

// Global state
const APP_STATE = {
    isMobile: window.innerWidth < CONFIG.MOBILE_BREAKPOINT,
    modules: {},
    isInitialized: false
};

// ========================================
// MODULE LOADER
// ========================================

class ModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
    }
    
    /**
     * Load a module dynamically
     */
    async loadModule(modulePath, moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }
        
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }
        
        const loadingPromise = this.importModule(modulePath, moduleName);
        this.loadingPromises.set(moduleName, loadingPromise);
        
        try {
            const module = await loadingPromise;
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            console.error(`Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }
    
    /**
     * Import module with fallback for older browsers
     */
    async importModule(modulePath, moduleName) {
        try {
            // Try dynamic import first (modern browsers)
            if (typeof import === 'function') {
                const module = await import(modulePath);
                return module;
            }
            
            // Fallback for older browsers
            return await this.loadModuleWithScript(modulePath, moduleName);
        } catch (error) {
            console.error(`Error importing module ${moduleName}:`, error);
            throw error;
        }
    }
    
    /**
     * Load module using script tag (fallback)
     */
    loadModuleWithScript(src, moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                // Check if module is available in global scope
                const module = window[moduleName] || window[`${moduleName}Module`];
                if (module) {
                    resolve(module);
                } else {
                    reject(new Error(`Module ${moduleName} not found in global scope`));
                }
            };
            script.onerror = () => reject(new Error(`Failed to load script ${src}`));
            document.head.appendChild(script);
        });
    }
    
    /**
     * Preload essential modules
     */
    async preloadEssentialModules() {
        const essentialModules = [
            { path: './modules/navigation.js', name: 'Navigation' },
            { path: './utils/helpers.js', name: 'helpers' }
        ];
        
        const loadPromises = essentialModules.map(module => 
            this.loadModule(module.path, module.name).catch(error => {
                console.warn(`Failed to preload essential module ${module.name}:`, error);
                return null;
            })
        );
        
        await Promise.all(loadPromises);
    }
}

// ========================================
// CORE APPLICATION
// ========================================

class KMEApp {
    constructor() {
        this.moduleLoader = new ModuleLoader();
        this.modules = {};
        this.isInitialized = false;
    }
    
    /**
     * Initialize application
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Set loading state
            document.body.classList.add('app-loading');
            
            // Preload essential modules
            await this.moduleLoader.preloadEssentialModules();
            
            // Initialize core functionality
            await this.initCore();
            
            // Initialize modules based on page requirements
            await this.initPageModules();
            
            // Mark as initialized
            this.isInitialized = true;
            APP_STATE.isInitialized = true;
            
            // Remove loading state
            document.body.classList.remove('app-loading');
            document.body.classList.add('app-ready');
            
            // Trigger ready event
            document.dispatchEvent(new CustomEvent('app:ready'));
            
            console.log('KME App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize KME App:', error);
            document.body.classList.add('app-error');
        }
    }
    
    /**
     * Initialize core functionality
     */
    async initCore() {
        // Initialize navigation (essential for all pages)
        try {
            const NavigationModule = await this.moduleLoader.loadModule('./modules/navigation.js', 'Navigation');
            if (NavigationModule && NavigationModule.Navigation) {
                this.modules.navigation = new NavigationModule.Navigation();
                APP_STATE.modules.navigation = this.modules.navigation;
            }
        } catch (error) {
            console.warn('Navigation module failed to load:', error);
        }
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Initialize responsive handlers
        this.initResponsiveHandlers();
        
        // Initialize performance optimizations
        this.initPerformanceOptimizations();
    }
    
    /**
     * Initialize page-specific modules
     */
    async initPageModules() {
        const currentPage = this.getCurrentPage();
        
        // Load page-specific modules
        const pageModules = this.getPageModules(currentPage);
        
        for (const module of pageModules) {
            try {
                const loadedModule = await this.moduleLoader.loadModule(module.path, module.name);
                if (loadedModule && module.init) {
                    await module.init(loadedModule);
                }
            } catch (error) {
                console.warn(`Failed to load page module ${module.name}:`, error);
            }
        }
    }
    
    /**
     * Get current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }
    
    /**
     * Get required modules for current page
     */
    getPageModules(currentPage) {
        const moduleMap = {
            'index': [
                { path: './modules/popup.js', name: 'Popup', init: (module) => {
                    if (module.Popup) {
                        this.modules.popup = new module.Popup();
                        APP_STATE.modules.popup = this.modules.popup;
                    }
                }}
            ],
            'about': [
                { path: './pages/about.js', name: 'AboutPage' },
                { path: './modules/popup.js', name: 'Popup' }
            ],
            'contact': [
                { path: './pages/contact.js', name: 'ContactPage' },
                { path: './modules/forms.js', name: 'Forms', init: (module) => {
                    if (module.Forms) {
                        this.modules.forms = new module.Forms();
                        APP_STATE.modules.forms = this.modules.forms;
                    }
                }}
            ],
            'services': [
                { path: './pages/services.js', name: 'ServicesPage' }
            ],
            'products': [
                { path: './modules/popup.js', name: 'Popup' }
            ],
            'booking': [
                { path: './modules/forms.js', name: 'Forms' }
            ]
        };
        
        return moduleMap[currentPage] || [];
    }
    
    /**
     * Initialize smooth scrolling
     */
    initSmoothScrolling() {
        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    /**
     * Initialize responsive handlers
     */
    initResponsiveHandlers() {
        let resizeTimeout;
        
        const handleResize = () => {
            APP_STATE.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
            
            // Trigger resize event for modules
            document.dispatchEvent(new CustomEvent('app:resize', {
                detail: { isMobile: APP_STATE.isMobile }
            }));
        };
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });
        
        // Initial call
        handleResize();
    }
    
    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            this.initLazyLoading();
        }
        
        // Prefetch critical resources
        this.prefetchCriticalResources();
    }
    
    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    /**
     * Prefetch critical resources
     */
    prefetchCriticalResources() {
        const criticalResources = [
            './modules/popup.js',
            './modules/forms.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Get loaded module
     */
    getModule(name) {
        return this.modules[name] || APP_STATE.modules[name];
    }
    
    /**
     * Load module on demand
     */
    async loadModule(path, name) {
        return await this.moduleLoader.loadModule(path, name);
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Create global app instance
window.KMEApp = new KMEApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.KMEApp.init();
    });
} else {
    window.KMEApp.init();
}

// Global utilities for backward compatibility
window.KME = {
    app: window.KMEApp,
    config: CONFIG,
    state: APP_STATE,
    
    // Utility functions
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
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
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KMEApp, CONFIG, APP_STATE };
}
