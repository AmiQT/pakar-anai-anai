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
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other FAQ items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherAnswer.style.maxHeight = '0';
                        otherIcon.style.transform = 'rotate(0deg)';
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
        });
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

// Add custom CSS for contact page
const contactPageStyles = `
    /* Contact form styles */
    .contact-form {
        max-width: 100%;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--dark-gray);
    }
    
    .required {
        color: #dc3545;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #E9ECEF;
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition-fast);
        background: var(--white);
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .field-error::before {
        content: "⚠️";
        font-size: 0.8rem;
    }
    
    .checkbox-group {
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .submit-btn {
        background: var(--primary-blue);
        color: var(--white);
        padding: 15px 30px;
        border: none;
        border-radius: var(--border-radius-large);
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-medium);
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        justify-content: center;
    }
    
    .submit-btn:hover:not(:disabled) {
        background: var(--secondary-blue);
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    /* FAQ styles */
    .faq-item {
        background: var(--white);
        border-radius: var(--border-radius-large);
        margin-bottom: 20px;
        overflow: hidden;
        box-shadow: var(--shadow-light);
        transition: var(--transition-medium);
    }
    
    .faq-item:hover {
        box-shadow: var(--shadow-medium);
    }
    
    .faq-question {
        padding: 25px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--white);
        transition: var(--transition-fast);
    }
    
    .faq-question:hover {
        background: var(--light-gray);
    }
    
    .faq-question h3 {
        font-size: 1.2rem;
        color: var(--dark-gray);
        font-weight: 600;
        margin: 0;
        flex: 1;
    }
    
    .faq-question i {
        color: var(--primary-blue);
        transition: transform 0.3s ease;
        font-size: 1.2rem;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: var(--light-gray);
    }
    
    .faq-answer p,
    .faq-answer ul {
        padding: 0 25px 25px;
        margin: 0;
        color: var(--medium-gray);
        line-height: 1.6;
    }
    
    .faq-answer ul {
        padding-left: 45px;
        padding-top: 10px;
    }
    
    .faq-answer li {
        margin-bottom: 8px;
    }
    
    /* Contact methods animations */
    .contact-method.animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .contact-method.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Map styles */
    .map-placeholder {
        background: var(--light-gray);
        border-radius: var(--border-radius-large);
        padding: 60px 40px;
        text-align: center;
        border: 2px dashed var(--medium-gray);
        transition: var(--transition-medium);
    }
    
    .map-placeholder:hover {
        border-color: var(--primary-blue);
        background: rgba(74, 144, 226, 0.05);
    }
    
    .map-content i {
        font-size: 3rem;
        color: var(--primary-blue);
        margin-bottom: 20px;
    }
    
    .map-content h3 {
        font-size: 1.5rem;
        color: var(--dark-gray);
        margin-bottom: 15px;
    }
    
    .map-content p {
        color: var(--medium-gray);
        margin-bottom: 30px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .map-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .map-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--primary-blue);
        color: var(--white);
        padding: 12px 20px;
        border-radius: var(--border-radius);
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition-fast);
    }
    
    .map-btn:hover {
        background: var(--secondary-blue);
        transform: translateY(-2px);
    }
    
    .map-btn.waze {
        background: #00B4FF;
    }
    
    .map-btn.waze:hover {
        background: #0099CC;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 767px) {
        .form-row {
            grid-template-columns: 1fr;
            gap: 0;
        }
        
        .contact-content {
            grid-template-columns: 1fr;
        }
        
        .map-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .map-btn {
            width: 200px;
            justify-content: center;
        }
    }
`;

// Add styles to document
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactPageStyles;
document.head.appendChild(contactStyleSheet);
