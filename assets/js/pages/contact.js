/* ========================================
   KME Pest Control - Contact Page JavaScript
   Handles contact form, FAQ, and map interactions
======================================== */

'use strict';

// ========================================
// CONTACT PAGE FUNCTIONALITY
// ========================================

class ContactPage {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.mapContainer = document.querySelector('.map-container');
        
        this.init();
    }
    
    init() {
        this.setupContactForm();
        this.setupFAQ();
        this.setupAnimations();
        this.setupMapInteractions();
    }
    
    /**
     * Setup contact form handling
     */
    setupContactForm() {
        if (!this.contactForm) return;
        
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e);
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmission(e) {
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghantar...';
        submitBtn.disabled = true;
        
        try {
            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Form validation failed');
            }
            
            // Collect form data
            const formData = this.collectFormData(form);
            
            // Show loading overlay
            if (window.showLoading) {
                window.showLoading();
            }
            
            // Simulate form submission (replace with actual API call)
            await this.submitContactForm(formData);
            
            // Success handling
            this.showSuccessMessage();
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error.message);
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide loading overlay
            if (window.hideLoading) {
                window.hideLoading();
            }
        }
    }
    
    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field check
        if (field.required && !value) {
            this.showFieldError(field, 'Medan ini diperlukan');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Format email tidak sah');
                return false;
            }
        }
        
        // Phone validation (Malaysian format)
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                this.showFieldError(field, 'Format nombor telefon tidak sah');
                return false;
            }
        }
        
        // Message length validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                this.showFieldError(field, 'Mesej terlalu pendek (minimum 10 aksara)');
                return false;
            }
            if (value.length > 1000) {
                this.showFieldError(field, 'Mesej terlalu panjang (maksimum 1000 aksara)');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Collect form data
     */
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp
        data.submitted_at = new Date().toISOString();
        data.user_agent = navigator.userAgent;
        data.page_url = window.location.href;
        
        return data;
    }
    
    /**
     * Submit contact form (mock implementation)
     */
    async submitContactForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Submission failed. Please try again.'));
                }
            }, 2000);
        });
    }
    
    /**
     * Show success message
     */
    showSuccessMessage() {
        if (window.showNotification) {
            window.showNotification('Terima kasih! Mesej anda telah berjaya dihantar. Kami akan menghubungi anda dalam masa 24 jam.', 'success');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * Show error message
     */
    showErrorMessage(message) {
        if (window.showNotification) {
            window.showNotification(`Maaf, terdapat ralat: ${message}. Sila cuba lagi atau hubungi kami secara terus.`, 'error');
        }
    }
    
    /**
     * Setup FAQ accordion
     */
    setupFAQ() {
        // Use modern selector for FAQ items in new design
        const faqItems = document.querySelectorAll('.faq-item-modern');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question-modern');
            const answer = item.querySelector('.faq-answer-modern');
            const toggleIcon = item.querySelector('.faq-toggle i');
            
            if (question && answer && toggleIcon) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherToggleIcon = otherItem.querySelector('.faq-toggle i');
                            if (otherToggleIcon) {
                                otherToggleIcon.classList.remove('fa-minus');
                                otherToggleIcon.classList.add('fa-plus');
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isOpen) {
                        item.classList.remove('active');
                        toggleIcon.classList.remove('fa-minus');
                        toggleIcon.classList.add('fa-plus');
                    } else {
                        item.classList.add('active');
                        toggleIcon.classList.remove('fa-plus');
                        toggleIcon.classList.add('fa-minus');
                    }
                });
            }
        });
        
        // Keep compatibility with old design if it exists
        const oldFaqItems = document.querySelectorAll('.faq-item:not(.faq-item-modern)');
        if (oldFaqItems.length > 0) {
            oldFaqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const icon = question?.querySelector('i');
                
                if (question && answer && icon) {
                    question.addEventListener('click', () => {
                        const isOpen = item.classList.contains('active');
                        
                        // Close all other FAQ items
                        oldFaqItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                                const otherAnswer = otherItem.querySelector('.faq-answer');
                                const otherIcon = otherItem.querySelector('.faq-question i');
                                if (otherAnswer) otherAnswer.style.maxHeight = '0';
                                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                            }
                        });
                        
                        // Toggle current item
                        if (isOpen) {
                            item.classList.remove('active');
                            answer.style.maxHeight = '0';
                            icon.style.transform = 'rotate(0deg)';
                        } else {
                            item.classList.add('active');
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                            icon.style.transform = 'rotate(180deg)';
                        }
                    });
                }
            });
        }
    }
    
    /**
     * Setup page animations
     */
    setupAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(el => {
                el.classList.add('animate-ready');
                observer.observe(el);
            });
        }
    }
    
    /**
     * Setup map interactions
     */
    setupMapInteractions() {
        if (!this.mapContainer) return;
        
        const mapButtons = this.mapContainer.querySelectorAll('.map-btn');
        
        mapButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Track map button clicks
                const buttonType = btn.classList.contains('waze') ? 'Waze' : 'Google Maps';
                console.log(`Map button clicked: ${buttonType}`);
                
                // Add click animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// ========================================
// CONTACT METHODS INTERACTIONS
// ========================================

class ContactMethods {
    constructor() {
        this.methodCards = document.querySelectorAll('.contact-method');
        this.init();
    }
    
    init() {
        this.setupMethodInteractions();
        this.setupWhatsAppTracking();
    }
    
    setupMethodInteractions() {
        this.methodCards.forEach(card => {
            const link = card.querySelector('.contact-link');
            
            if (link) {
                link.addEventListener('click', (e) => {
                    // Track contact method usage
                    const method = this.getContactMethod(link);
                    console.log(`Contact method used: ${method}`);
                    
                    // Add click animation
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                    }, 200);
                });
            }
        });
    }
    
    setupWhatsAppTracking() {
        const whatsappLinks = document.querySelectorAll('a[href*="wsap.to"], a[href*="whatsapp"], .whatsapp');
        
        whatsappLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('WhatsApp link clicked');
                
                // Show helpful message
                if (window.showNotification) {
                    window.showNotification('Membuka WhatsApp... Sila tunggu sebentar.', 'info');
                }
            });
        });
    }
    
    getContactMethod(link) {
        if (link.href.includes('tel:')) return 'Phone';
        if (link.href.includes('mailto:')) return 'Email';
        if (link.href.includes('whatsapp') || link.href.includes('wsap')) return 'WhatsApp';
        return 'Other';
    }
}

// ========================================
// SOCIAL MEDIA TRACKING
// ========================================

class SocialMediaTracking {
    constructor() {
        this.socialLinks = document.querySelectorAll('.social-link, .social-links a');
        this.init();
    }
    
    init() {
        this.setupSocialTracking();
    }
    
    setupSocialTracking() {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(link);
                console.log(`Social media link clicked: ${platform}`);
                
                // Add click animation
                link.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    getSocialPlatform(link) {
        if (link.href.includes('facebook')) return 'Facebook';
        if (link.href.includes('instagram')) return 'Instagram';
        if (link.href.includes('tiktok')) return 'TikTok';
        if (link.href.includes('youtube')) return 'YouTube';
        return 'Unknown';
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
    window.contactMethods = new ContactMethods();
    window.socialMediaTracking = new SocialMediaTracking();
});

// CSS styles have been moved to the dedicated contact.css file
// This comment is kept for future reference
