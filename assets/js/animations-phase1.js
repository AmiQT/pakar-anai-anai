/* ========================================
   KME Pest Control - Phase 1 Animation Enhancements
   Interactive JavaScript for Enhanced UX
======================================== */

'use strict';

// ========================================
// ENHANCED BUTTON INTERACTIONS
// ========================================

class EnhancedButtons {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRippleEffects();
        this.setupLoadingStates();
        this.setupPulseAnimations();
    }
    
    /**
     * Setup ripple effects for buttons
     */
    setupRippleEffects() {
        const buttons = document.querySelectorAll('.btn-whatsapp-primary, .btn-whatsapp-secondary, .btn-outline');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    /**
     * Create ripple effect on button click
     */
    createRipple(event, button) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Ensure button has position relative
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    /**
     * Setup loading states for form buttons
     */
    setupLoadingStates() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                form.addEventListener('submit', () => {
                    this.setButtonLoading(submitBtn, true);
                    
                    // Remove loading after form completion (handled by main form handler)
                    setTimeout(() => {
                        this.setButtonLoading(submitBtn, false);
                    }, 5000); // Fallback timeout
                });
            }
        });
    }
    
    /**
     * Set button loading state
     */
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            
            // Store original text
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }
            button.textContent = 'Menghantar...';
            
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            
            // Restore original text
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }
    
    /**
     * Enhanced pulse animations for emergency buttons
     */
    setupPulseAnimations() {
        const emergencyBtns = document.querySelectorAll('.btn-emergency');
        
        emergencyBtns.forEach(btn => {
            // Add enhanced pulse on hover
            btn.addEventListener('mouseenter', () => {
                btn.style.animationPlayState = 'paused';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.animationPlayState = 'running';
            });
        });
    }
}

// ========================================
// ENHANCED FORM INTERACTIONS
// ========================================

class EnhancedForms {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFloatingLabels();
        this.setupValidationAnimations();
        this.setupProgressIndicators();
    }
    
    /**
     * Setup floating label functionality
     */
    setupFloatingLabels() {
        const formFields = document.querySelectorAll('.form-field');
        
        formFields.forEach(field => {
            const input = field.querySelector('input, textarea, select');
            const label = field.querySelector('label');
            
            if (input && label) {
                // Set placeholder to space to trigger :not(:placeholder-shown)
                if (!input.placeholder) {
                    input.placeholder = ' ';
                }
                
                // Initial check for pre-filled values
                this.checkInputValue(input, label);
                
                // Listen for input changes
                input.addEventListener('input', () => {
                    this.checkInputValue(input, label);
                });
                
                input.addEventListener('focus', () => {
                    field.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    field.classList.remove('focused');
                    this.validateField(field, input);
                });
            }
        });
    }
    
    /**
     * Check input value and update label position
     */
    checkInputValue(input, label) {
        if (input.value.trim() !== '') {
            label.classList.add('floating');
        } else {
            label.classList.remove('floating');
        }
    }
    
    /**
     * Setup validation animations
     */
    setupValidationAnimations() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    const field = input.closest('.form-field');
                    if (field) {
                        this.validateField(field, input);
                    }
                });
                
                // Clear validation on focus
                input.addEventListener('focus', () => {
                    const field = input.closest('.form-field');
                    if (field) {
                        field.classList.remove('error', 'success');
                    }
                });
            });
        });
    }
    
    /**
     * Validate individual form field
     */
    validateField(field, input) {
        const isRequired = input.hasAttribute('required');
        const value = input.value.trim();
        const type = input.type;
        
        // Clear previous states
        field.classList.remove('error', 'success');
        
        // Required field validation
        if (isRequired && !value) {
            this.showFieldError(field, 'Medan ini diperlukan');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Format email tidak sah');
                return false;
            }
        }
        
        // Phone validation (Malaysian numbers)
        if ((type === 'tel' || input.name === 'phone') && value) {
            if (!this.isValidMalaysianPhone(value)) {
                this.showFieldError(field, 'Nombor telefon Malaysia tidak sah');
                return false;
            }
        }
        
        // Success state
        if (value) {
            this.showFieldSuccess(field);
        }
        
        return true;
    }
    
    /**
     * Show field error with animation
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: var(--error);
            font-size: 0.875rem;
            margin-top: 5px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        field.appendChild(errorEl);
        
        // Trigger animation
        requestAnimationFrame(() => {
            errorEl.style.opacity = '1';
            errorEl.style.transform = 'translateY(0)';
        });
    }
    
    /**
     * Show field success state
     */
    showFieldSuccess(field) {
        field.classList.add('success');
        
        // Remove error message if exists
        const errorMsg = field.querySelector('.field-error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    /**
     * Validate Malaysian phone number
     */
    isValidMalaysianPhone(phone) {
        // Remove all non-digits
        let digits = phone.replace(/\D/g, '');
        
        // Remove country code if present
        if (digits.startsWith('60')) {
            digits = digits.slice(2);
        } else if (digits.startsWith('0')) {
            digits = digits.slice(1);
        }
        
        // Malaysian mobile pattern: 1[0-46-9] followed by 7-8 digits
        const mobileRegex = /^1[0-46-9][0-9]{7,8}$/;
        return mobileRegex.test(digits);
    }
    
    /**
     * Setup form progress indicators
     */
    setupProgressIndicators() {
        const forms = document.querySelectorAll('form[data-form="booking"], form[data-form="contact"]');
        
        forms.forEach(form => {
            const requiredFields = form.querySelectorAll('input[required], textarea[required]');
            const progressBar = this.createProgressBar();
            
            // Insert progress bar at the top of the form
            form.insertBefore(progressBar, form.firstChild);
            
            // Update progress on input
            requiredFields.forEach(field => {
                field.addEventListener('input', () => {
                    this.updateFormProgress(form, requiredFields, progressBar);
                });
            });
        });
    }
    
    /**
     * Create progress bar element
     */
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.style.cssText = `
            width: 100%;
            height: 4px;
            background: var(--gray-200);
            border-radius: 2px;
            margin-bottom: 20px;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--primary-blue), var(--primary-orange));
            transition: width 0.3s ease;
            border-radius: 2px;
        `;
        
        progressContainer.appendChild(progressBar);
        return progressContainer;
    }
    
    /**
     * Update form progress
     */
    updateFormProgress(form, requiredFields, progressContainer) {
        let filledFields = 0;
        
        requiredFields.forEach(field => {
            if (field.value.trim() !== '') {
                filledFields++;
            }
        });
        
        const progress = (filledFields / requiredFields.length) * 100;
        const progressBar = progressContainer.querySelector('.form-progress-bar');
        progressBar.style.width = `${progress}%`;
    }
}

// ========================================
// ENHANCED CARD ANIMATIONS
// ========================================

class EnhancedCards {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupServiceCardAnimations();
        this.setupTestimonialAnimations();
        this.setupCertificateAnimations();
    }
    
    /**
     * Setup service card animations
     */
    setupServiceCardAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            // Stagger initial animation
            card.style.animationDelay = `${index * 100}ms`;
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateServiceBadge(card);
            });
        });
    }
    
    /**
     * Animate service badge on hover
     */
    animateServiceBadge(card) {
        const badge = card.querySelector('.service-badge');
        const icon = card.querySelector('.badge-icon');
        
        if (badge && icon) {
            // Create sparkle effect
            this.createSparkles(badge);
        }
    }
    
    /**
     * Create sparkle effects
     */
    createSparkles(element) {
        const sparkleCount = 3;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-orange);
                border-radius: 50%;
                pointer-events: none;
                animation: sparkle-animation 0.6s ease-out forwards;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                z-index: 10;
            `;
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 600);
        }
    }
    
    /**
     * Setup testimonial animations
     */
    setupTestimonialAnimations() {
        const testimonialCards = document.querySelectorAll('.video-testimonial-card');
        
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Animate rating stars
                const rating = card.querySelector('.rating');
                if (rating) {
                    rating.style.animation = 'rating-glow 0.5s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const rating = card.querySelector('.rating');
                if (rating) {
                    rating.style.animation = '';
                }
            });
        });
    }
    
    /**
     * Setup certificate animations
     */
    setupCertificateAnimations() {
        const certificates = document.querySelectorAll('.certificate-item');
        
        certificates.forEach(cert => {
            cert.addEventListener('click', () => {
                this.openCertificateLightbox(cert);
            });
        });
    }
    
    /**
     * Open certificate in lightbox
     */
    openCertificateLightbox(certElement) {
        const img = certElement.querySelector('img');
        if (!img) return;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'certificate-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.cssText = `
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 10001;
        `;
        
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        });
        
        // Close handlers
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (lightbox.parentNode) {
                    lightbox.parentNode.removeChild(lightbox);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
}

// ========================================
// ENHANCED SOCIAL MEDIA INTERACTIONS
// ========================================

class EnhancedSocialMedia {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSocialAnimations();
        this.setupClickTracking();
    }
    
    /**
     * Setup social media animations
     */
    setupSocialAnimations() {
        const socialIcons = document.querySelectorAll('.social-icon');
        
        socialIcons.forEach((icon, index) => {
            // Stagger initial appearance
            icon.style.animationDelay = `${index * 100}ms`;
            
            // Enhanced hover effects
            icon.addEventListener('mouseenter', () => {
                this.createSocialSparkle(icon);
            });
        });
    }
    
    /**
     * Create sparkle effect for social icons
     */
    createSocialSparkle(icon) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 8px;
            height: 8px;
            background: var(--primary-orange);
            border-radius: 50%;
            animation: social-sparkle 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 600);
    }
    
    /**
     * Setup click tracking for analytics
     */
    setupClickTracking() {
        const socialIcons = document.querySelectorAll('.social-icon');
        
        socialIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(icon.href);
                
                // Track with Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_media_click', {
                        event_category: 'Social Media',
                        event_label: platform,
                        transport_type: 'beacon'
                    });
                }
                
                console.log(`Social media clicked: ${platform}`);
            });
        });
    }
    
    /**
     * Get social platform from URL
     */
    getSocialPlatform(url) {
        if (url.includes('facebook')) return 'Facebook';
        if (url.includes('instagram')) return 'Instagram';
        if (url.includes('tiktok')) return 'TikTok';
        if (url.includes('youtube')) return 'YouTube';
        if (url.includes('whatsapp') || url.includes('wsap.to')) return 'WhatsApp';
        return 'Unknown';
    }
}

// ========================================
// KEYFRAME ANIMATIONS (CSS-in-JS)
// ========================================

class AnimationKeyframes {
    constructor() {
        this.init();
    }
    
    init() {
        this.injectKeyframes();
    }
    
    injectKeyframes() {
        const style = document.createElement('style');
        style.id = 'phase1-keyframes';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes sparkle-animation {
                0% {
                    opacity: 0;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.2) rotate(180deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(360deg);
                }
            }
            
            @keyframes social-sparkle {
                0% {
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.5);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-20px);
                }
            }
            
            @keyframes rating-glow {
                0%, 100% {
                    text-shadow: none;
                }
                50% {
                    text-shadow: 0 0 10px var(--primary-orange);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// ========================================
// INITIALIZATION
// ========================================

class Phase1Animations {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize all Phase 1 animation components
            this.enhancedButtons = new EnhancedButtons();
            this.enhancedForms = new EnhancedForms();
            this.enhancedCards = new EnhancedCards();
            this.enhancedSocialMedia = new EnhancedSocialMedia();
            this.animationKeyframes = new AnimationKeyframes();
            
            console.log('Phase 1 Animations initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Phase 1 animations:', error);
        }
    }
}

// ========================================
// AUTO-INITIALIZE
// ========================================

// Initialize Phase 1 animations
window.phase1Animations = new Phase1Animations();

// Export for external use
window.Phase1Animations = {
    EnhancedButtons,
    EnhancedForms,
    EnhancedCards,
    EnhancedSocialMedia
};
