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
            return;
        }
        
        this.config = {
            timeThreshold: 2000,
            scrollThreshold: 0.2,
            fallbackTime: 10000,
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
        sessionStorage.removeItem('kme-popup-dismissed-session');
        this.setupTimeTracking();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupEventHandlers();
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
            
            if (this.config.scrollProgress > 0.05) {
                this.config.hasEngaged = true;
            }
            
            this.checkTriggers();
        };
        
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
        
        if (window.innerWidth > 768) {
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && this.shouldShow()) {
                    this.showPopup('exit-intent');
                }
            });
        }
    }
    
    setupEventHandlers() {
        this.closeBtn.addEventListener('click', () => {
            this.closePopup('close-button');
        });
        
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup('outside-click');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.closePopup('escape-key');
            }
        });
    }
    
    shouldShow() {
        const basicConditions = !this.config.isShown &&
                               !this.config.isDismissed &&
                               this.config.hasEngaged &&
                               this.config.timeOnPage >= this.config.timeThreshold &&
                               !this.popup.classList.contains('active');
        
        const scrollCondition = this.config.scrollProgress >= this.config.scrollThreshold;
        const fallbackCondition = this.config.timeOnPage >= this.config.fallbackTime;
        
        return basicConditions && (scrollCondition || fallbackCondition);
    }
    
    checkTriggers() {
        if (this.shouldShow()) {
            this.showPopup('greeting-trigger');
        }
    }
    
    showPopup(trigger) {
        if (this.config.isShown || this.config.isDismissed) {
            return;
        }
        
        this.config.isShown = true;
        this.popup.classList.add('active');
        document.body.classList.add('popup-open');
        
        this.stopChecking();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_shown', {
                trigger: trigger,
                time_on_page: this.config.timeOnPage,
                scroll_progress: this.config.scrollProgress
            });
        }
    }
    
    closePopup(reason) {
        this.popup.classList.remove('active');
        document.body.classList.remove('popup-open');
        this.config.isDismissed = true;
        this.stopChecking();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_dismissed', {
                reason: reason
            });
        }
    }
    
    stopChecking() {
        if (this.timeTracker) {
            clearInterval(this.timeTracker);
            this.timeTracker = null;
        }
        
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

document.addEventListener('DOMContentLoaded', () => {
    window.greetingPopup = new GreetingPopup();
});

window.GreetingPopup = GreetingPopup;