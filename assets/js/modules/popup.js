/* ========================================
   KME Pest Control - Popup/Modal Module
   Handles popup and modal functionality
======================================== */

'use strict';

// ========================================
// POPUP MODULE
// ========================================

export class Popup {
    constructor() {
        this.activePopup = null;
        this.popupTriggers = [];
        this.init();
    }
    
    init() {
        this.setupPopupTriggers();
        this.bindGlobalEvents();
    }
    
    /**
     * Setup popup triggers
     */
    setupPopupTriggers() {
        // Find all elements with data-popup attribute
        const triggers = document.querySelectorAll('[data-popup]');
        
        triggers.forEach(trigger => {
            const popupId = trigger.getAttribute('data-popup');
            const popupElement = document.getElementById(popupId);
            
            if (popupElement) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPopup(popupId);
                });
                
                this.popupTriggers.push({
                    trigger,
                    popupId,
                    popupElement
                });
            }
        });
        
        // Setup close buttons
        const closeButtons = document.querySelectorAll('[data-popup-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.closePopup();
            });
        });
    }
    
    /**
     * Show popup by ID
     */
    showPopup(popupId, options = {}) {
        const popup = document.getElementById(popupId);
        if (!popup) {
            console.warn(`Popup with ID '${popupId}' not found`);
            return;
        }
        
        // Close any existing popup first
        if (this.activePopup) {
            this.closePopup();
        }
        
        // Set active popup
        this.activePopup = popup;
        
        // Show popup with animation
        popup.style.display = 'flex';
        popup.style.opacity = '0';
        
        // Force reflow
        popup.offsetHeight;
        
        // Animate in
        popup.style.opacity = '1';
        popup.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = popup.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Add escape key handler
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
        
        // Trigger custom event
        popup.dispatchEvent(new CustomEvent('popup:opened', {
            detail: { popupId, options }
        }));
    }
    
    /**
     * Close active popup
     */
    closePopup() {
        if (!this.activePopup) return;
        
        const popup = this.activePopup;
        
        // Animate out
        popup.style.opacity = '0';
        
        // Hide after animation
        setTimeout(() => {
            popup.style.display = 'none';
            popup.classList.remove('active');
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove escape key handler
        if (this.handleEscapeKey) {
            document.removeEventListener('keydown', this.handleEscapeKey);
            this.handleEscapeKey = null;
        }
        
        // Trigger custom event
        popup.dispatchEvent(new CustomEvent('popup:closed', {
            detail: { popupId: popup.id }
        }));
        
        // Clear active popup
        this.activePopup = null;
    }
    
    /**
     * Create dynamic popup
     */
    createPopup(content, options = {}) {
        const defaults = {
            id: `popup_${Date.now()}`,
            className: 'dynamic-popup',
            showCloseButton: true,
            closable: true,
            width: 'auto',
            height: 'auto'
        };
        
        const config = { ...defaults, ...options };
        
        // Create popup structure
        const popup = document.createElement('div');
        popup.id = config.id;
        popup.className = `popup-overlay ${config.className}`;
        popup.style.display = 'none';
        
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        
        if (config.width !== 'auto') {
            popupContent.style.width = config.width;
        }
        if (config.height !== 'auto') {
            popupContent.style.height = config.height;
        }
        
        // Add close button if requested
        if (config.showCloseButton) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'popup-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('data-popup-close', '');
            closeBtn.addEventListener('click', () => this.closePopup());
            popupContent.appendChild(closeBtn);
        }
        
        // Add content
        if (typeof content === 'string') {
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = content;
            popupContent.appendChild(contentDiv);
        } else if (content instanceof HTMLElement) {
            popupContent.appendChild(content);
        }
        
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        
        // Make it closable by clicking overlay if enabled
        if (config.closable) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closePopup();
                }
            });
        }
        
        return popup;
    }
    
    /**
     * Show confirmation dialog
     */
    showConfirmation(message, options = {}) {
        return new Promise((resolve) => {
            const defaults = {
                title: 'Confirmation',
                confirmText: 'OK',
                cancelText: 'Cancel',
                confirmClass: 'btn-primary',
                cancelClass: 'btn-secondary'
            };
            
            const config = { ...defaults, ...options };
            
            const content = `
                <div class="confirmation-popup">
                    <h3>${config.title}</h3>
                    <p>${message}</p>
                    <div class="popup-actions">
                        <button class="btn ${config.cancelClass}" data-action="cancel">
                            ${config.cancelText}
                        </button>
                        <button class="btn ${config.confirmClass}" data-action="confirm">
                            ${config.confirmText}
                        </button>
                    </div>
                </div>
            `;
            
            const popup = this.createPopup(content, {
                className: 'confirmation-popup-overlay',
                closable: false,
                showCloseButton: false
            });
            
            // Handle button clicks
            popup.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                if (action) {
                    this.closePopup();
                    document.body.removeChild(popup);
                    resolve(action === 'confirm');
                }
            });
            
            this.showPopup(popup.id);
        });
    }
    
    /**
     * Show alert dialog
     */
    showAlert(message, options = {}) {
        return new Promise((resolve) => {
            const defaults = {
                title: 'Alert',
                buttonText: 'OK',
                buttonClass: 'btn-primary'
            };
            
            const config = { ...defaults, ...options };
            
            const content = `
                <div class="alert-popup">
                    <h3>${config.title}</h3>
                    <p>${message}</p>
                    <div class="popup-actions">
                        <button class="btn ${config.buttonClass}" data-action="ok">
                            ${config.buttonText}
                        </button>
                    </div>
                </div>
            `;
            
            const popup = this.createPopup(content, {
                className: 'alert-popup-overlay',
                closable: false,
                showCloseButton: false
            });
            
            // Handle button click
            popup.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-action') === 'ok') {
                    this.closePopup();
                    document.body.removeChild(popup);
                    resolve();
                }
            });
            
            this.showPopup(popup.id);
        });
    }
    
    /**
     * Bind global events
     */
    bindGlobalEvents() {
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activePopup && 
                e.target.classList.contains('popup-overlay')) {
                this.closePopup();
            }
        });
    }
    
    /**
     * Check if popup is open
     */
    isOpen() {
        return this.activePopup !== null;
    }
    
    /**
     * Get active popup
     */
    getActivePopup() {
        return this.activePopup;
    }
    
    /**
     * Destroy popup system
     */
    destroy() {
        this.closePopup();
        
        // Remove event listeners
        this.popupTriggers.forEach(({ trigger }) => {
            trigger.removeEventListener('click', this.showPopup);
        });
        
        this.popupTriggers = [];
    }
}

// Auto-initialize if not imported as module
if (typeof window !== 'undefined' && !window.popupModule) {
    window.popupModule = new Popup();
}
