/* ========================================
   KME Pest Control - Greeting Popup
   Configured for user requirements:
   - 20% scroll trigger (moderate)
   - Show again on refresh  
   - Keep current timing (20s/25s)
   - Marketing content
======================================== */

'use strict';

class GreetingPopup {
    constructor() {
        this.popup = document.getElementById('anaiPopup');
        this.closeBtn = document.getElementById('closePopup');
        
        if (!this.popup) {
            console.warn('Popup element not found');
            return;
        }
        
        // Configuration for 50% scroll trigger
        this.config = {
            timeThreshold: 2000, // 2 seconds minimum time on page
            scrollThreshold: 0.5, // 50% scroll required
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
        // Clear any previous session storage to ensure popup shows every time
        sessionStorage.removeItem('kme-popup-dismissed-session');
        
        console.log('Popup will trigger after 50% scroll + 2s on page');
        
        // Setup tracking
        this.setupTimeTracking();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupEventHandlers();
        
        console.log('Greeting popup initialized - 50% scroll trigger');
    }
    
    setupTimeTracking() {
        this.timeTracker = setInterval(() => {
            this.config.timeOnPage = Date.now() - this.config.startTime;
            this.checkTriggers();
        }, 100); // Check every 100ms for faster response
    }
    
    setupScrollTracking() {
        this.scrollHandler = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.config.scrollProgress = Math.min(scrollTop / docHeight, 1);
            
            // Mark as engaged if user scrolls at least 10%
            if (this.config.scrollProgress > 0.1) { // 10% scroll = engaged
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
        
        // Exit intent for desktop (optional)
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
        console.log('Checking triggers:', {
            isShown: this.config.isShown,
            isDismissed: this.config.isDismissed,
            hasEngaged: this.config.hasEngaged,
            timeOnPage: this.config.timeOnPage,
            timeThreshold: this.config.timeThreshold,
            scrollProgress: this.config.scrollProgress,
            scrollThreshold: this.config.scrollThreshold
        });
        
        if (this.shouldShow()) {
            console.log('✅ Popup should show!');
            this.showPopup('greeting-trigger');
        } else {
            console.log('❌ Popup conditions not met');
        }
    }
    
    showPopup(trigger) {
        // Prevent multiple shows
        if (this.config.isShown || this.config.isDismissed) {
            return;
        }
        
        this.config.isShown = true;
        this.popup.classList.add('active');
        document.body.classList.add('popup-open');
        
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
        
        console.log('Greeting popup shown:', trigger, 
                   `(${Math.round(this.config.scrollProgress * 100)}% scroll, ${Math.round(this.config.timeOnPage/1000)}s)`);
    }
    
    closePopup(reason) {
        this.popup.classList.remove('active');
        document.body.classList.remove('popup-open');
        this.config.isDismissed = true;
        
        // Don't store dismissal - popup will show again on next page load
        // sessionStorage.setItem('kme-popup-dismissed-session', 'true');
        
        // Complete cleanup
        this.stopChecking();
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_dismissed', {
                reason: reason
            });
        }
        
        console.log('Greeting popup dismissed:', reason, '(will show again on next page load)');
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
    }
    
    destroy() {
        this.closePopup('destroyed');
        this.stopChecking();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.greetingPopup = new GreetingPopup();
});

// Export for external use
window.GreetingPopup = GreetingPopup;
