/* ========================================
   KME Pest Control - Fixed Popup Script
   Solves auto-loop issue with proper state management
======================================== */

'use strict';

class SmartPopup {
    constructor() {
        this.popup = document.getElementById('anaiPopup');
        this.closeBtn = document.getElementById('closePopup');
        
        if (!this.popup) {
            console.warn('Popup element not found');
            return;
        }
        
        // Enhanced configuration
        this.config = {
            timeThreshold: window.innerWidth <= 768 ? 25000 : 20000, // Increased timing
            scrollThreshold: 0.4, // 40% scroll requirement
            hasEngaged: false,
            timeOnPage: 0,
            scrollProgress: 0,
            isShown: false,
            isDismissed: false,
            startTime: Date.now()
        };
        
        this.init();
    }
    
    init() {
        // Check if user has already interacted
        if (this.shouldSkipPopup()) {
            console.log('Popup skipped: user already interacted');
            return;
        }
        
        // Setup tracking
        this.setupTimeTracking();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupEventHandlers();
        
        console.log('Smart popup initialized with improved logic');
    }
    
    shouldSkipPopup() {
        const hasSeenPopup = localStorage.getItem('kme-popup-seen');
        const hasDismissedToday = sessionStorage.getItem('kme-popup-dismissed-today');
        const lastShown = localStorage.getItem('kme-popup-timestamp');
        
        const daysSinceLastShown = lastShown ? 
            Math.floor((Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)) : 999;
        
        // Skip if dismissed today OR seen within 3 days
        return hasDismissedToday || (hasSeenPopup && daysSinceLastShown < 3);
    }
    
    setupTimeTracking() {
        this.timeTracker = setInterval(() => {
            this.config.timeOnPage = Date.now() - this.config.startTime;
            this.checkTriggers();
        }, 1000);
    }
    
    setupScrollTracking() {
        this.scrollHandler = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.config.scrollProgress = Math.min(scrollTop / docHeight, 1);
            
            // Mark as engaged if user scrolls more than 10%
            if (this.config.scrollProgress > 0.1) {
                this.config.hasEngaged = true;
            }
            
            this.checkTriggers();
        };
        
        // Throttled scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(this.scrollHandler, 100);
        });
    }
    
    setupEngagementTracking() {
        const engagementEvents = ['click', 'keydown', 'mousemove'];
        
        const markEngaged = () => {
            this.config.hasEngaged = true;
        };
        
        engagementEvents.forEach(event => {
            document.addEventListener(event, markEngaged, { once: true });
        });
        
        // Exit intent for desktop
        if (window.innerWidth > 768) {
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && this.shouldShow()) {
                    this.showPopup('exit-intent');
                }
            });
        }
    }
    
    setupEventHandlers() {
        // Close button
        this.closeBtn.addEventListener('click', () => {
            this.closePopup('close-button');
        });
        
        // Click outside to close
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup('outside-click');
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.closePopup('escape-key');
            }
        });
    }
    
    shouldShow() {
        return !this.config.isShown &&
               !this.config.isDismissed &&
               this.config.hasEngaged &&
               this.config.timeOnPage >= this.config.timeThreshold &&
               this.config.scrollProgress >= this.config.scrollThreshold &&
               !this.popup.classList.contains('active');
    }
    
    checkTriggers() {
        if (this.shouldShow()) {
            this.showPopup('auto-trigger');
        }
    }
    
    showPopup(trigger) {
        // Prevent multiple shows
        if (this.config.isShown || this.config.isDismissed) {
            return;
        }
        
        this.config.isShown = true;
        this.popup.classList.add('active');
        
        // Store tracking data
        localStorage.setItem('kme-popup-seen', 'true');
        localStorage.setItem('kme-popup-timestamp', Date.now().toString());
        
        // Stop checking after showing
        this.stopChecking();
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_shown', {
                trigger: trigger,
                time_on_page: this.config.timeOnPage,
                scroll_progress: this.config.scrollProgress
            });
        }
        
        console.log('Popup shown:', trigger);
    }
    
    closePopup(reason) {
        this.popup.classList.remove('active');
        this.config.isDismissed = true;
        
        // Store dismissal for session AND persistent
        sessionStorage.setItem('kme-popup-dismissed-today', 'true');
        localStorage.setItem('kme-popup-seen', 'true');
        localStorage.setItem('kme-popup-timestamp', Date.now().toString());
        
        // Complete cleanup
        this.stopChecking();
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_dismissed', {
                reason: reason,
                time_shown: Date.now() - parseInt(localStorage.getItem('kme-popup-timestamp') || '0')
            });
        }
        
        console.log('Popup dismissed:', reason);
    }
    
    stopChecking() {
        // Clear time tracker
        if (this.timeTracker) {
            clearInterval(this.timeTracker);
            this.timeTracker = null;
        }
        
        // Remove scroll listener
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        console.log('Popup checking stopped');
    }
    
    destroy() {
        this.closePopup('destroyed');
        this.stopChecking();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smartPopup = new SmartPopup();
});

// Export for external use
window.SmartPopup = SmartPopup;
