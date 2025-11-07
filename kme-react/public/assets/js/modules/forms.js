/* ========================================
   KME Pest Control - Forms Module
   Handles form validation and submission
======================================== */

'use strict';

// ========================================
// FORMS MODULE
// ========================================

export class Forms {
    constructor() {
        this.forms = [];
        this.init();
    }
    
    init() {
        this.setupForms();
        this.bindGlobalEvents();
    }
    
    /**
     * Setup all forms on page
     */
    setupForms() {
        const formElements = document.querySelectorAll('form[data-form-validate]');
        
        formElements.forEach(form => {
            this.setupForm(form);
        });
    }
    
    /**
     * Setup individual form
     */
    setupForm(form) {
        const formConfig = {
            element: form,
            fields: this.getFormFields(form),
            validators: this.getValidators(form),
            submitHandler: this.getSubmitHandler(form)
        };
        
        this.forms.push(formConfig);
        
        // Setup field validation
        formConfig.fields.forEach(field => {
            this.setupFieldValidation(field, formConfig);
        });
        
        // Setup form submission
        form.addEventListener('submit', (e) => {
            this.handleFormSubmit(e, formConfig);
        });
    }
    
    /**
     * Get form fields
     */
    getFormFields(form) {
        return Array.from(form.querySelectorAll('input, textarea, select')).map(field => ({
            element: field,
            name: field.name,
            type: field.type,
            required: field.hasAttribute('required'),
            validators: this.getFieldValidators(field)
        }));
    }
    
    /**
     * Get field validators
     */
    getFieldValidators(field) {
        const validators = [];
        
        // Required validation
        if (field.hasAttribute('required')) {
            validators.push('required');
        }
        
        // Email validation
        if (field.type === 'email' || field.hasAttribute('data-validate-email')) {
            validators.push('email');
        }
        
        // Phone validation
        if (field.type === 'tel' || field.hasAttribute('data-validate-phone')) {
            validators.push('phone');
        }
        
        // Min/Max length validation
        if (field.hasAttribute('minlength')) {
            validators.push(`minlength:${field.getAttribute('minlength')}`);
        }
        if (field.hasAttribute('maxlength')) {
            validators.push(`maxlength:${field.getAttribute('maxlength')}`);
        }
        
        // Custom validation pattern
        if (field.hasAttribute('pattern')) {
            validators.push(`pattern:${field.getAttribute('pattern')}`);
        }
        
        return validators;
    }
    
    /**
     * Setup field validation
     */
    setupFieldValidation(field, formConfig) {
        const { element } = field;
        
        // Real-time validation
        element.addEventListener('blur', () => {
            this.validateField(field);
        });
        
        element.addEventListener('input', () => {
            // Clear error state on input
            this.clearFieldError(field);
        });
    }
    
    /**
     * Validate individual field
     */
    validateField(field) {
        const { element, validators } = field;
        const value = element.value.trim();
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Run validators
        for (const validator of validators) {
            const result = this.runValidator(validator, value, element);
            if (!result.valid) {
                this.showFieldError(field, result.message);
                return false;
            }
        }
        
        // Show success state
        this.showFieldSuccess(field);
        return true;
    }
    
    /**
     * Run individual validator
     */
    runValidator(validator, value, element) {
        const [validatorName, validatorParam] = validator.split(':');
        
        switch (validatorName) {
            case 'required':
                return {
                    valid: value.length > 0,
                    message: 'This field is required'
                };
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    valid: value === '' || emailRegex.test(value),
                    message: 'Please enter a valid email address'
                };
                
            case 'phone':
                const phoneRegex = /^(\+?6?01[0-9]{1}[0-9]{7,8})$/;
                const cleanPhone = value.replace(/\D/g, '');
                return {
                    valid: value === '' || phoneRegex.test(cleanPhone) || /^01[0-9]{1}[0-9]{7,8}$/.test(cleanPhone),
                    message: 'Please enter a valid Malaysian phone number'
                };
                
            case 'minlength':
                const minLength = parseInt(validatorParam);
                return {
                    valid: value.length >= minLength,
                    message: `Minimum ${minLength} characters required`
                };
                
            case 'maxlength':
                const maxLength = parseInt(validatorParam);
                return {
                    valid: value.length <= maxLength,
                    message: `Maximum ${maxLength} characters allowed`
                };
                
            case 'pattern':
                const pattern = new RegExp(validatorParam);
                return {
                    valid: value === '' || pattern.test(value),
                    message: 'Please enter a valid format'
                };
                
            default:
                return { valid: true, message: '' };
        }
    }
    
    /**
     * Show field error
     */
    showFieldError(field, message) {
        const { element } = field;
        
        element.classList.add('error');
        element.classList.remove('success');
        
        // Remove existing error message
        this.removeErrorMessage(element);
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        element.parentNode.appendChild(errorElement);
    }
    
    /**
     * Show field success
     */
    showFieldSuccess(field) {
        const { element } = field;
        
        element.classList.add('success');
        element.classList.remove('error');
        
        // Remove error message
        this.removeErrorMessage(element);
    }
    
    /**
     * Clear field error
     */
    clearFieldError(field) {
        const { element } = field;
        
        element.classList.remove('error', 'success');
        this.removeErrorMessage(element);
    }
    
    /**
     * Remove error message
     */
    removeErrorMessage(element) {
        const errorElement = element.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Validate entire form
     */
    validateForm(formConfig) {
        let isValid = true;
        
        formConfig.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmit(event, formConfig) {
        event.preventDefault();
        
        const { element: form } = formConfig;
        
        // Validate form
        if (!this.validateForm(formConfig)) {
            this.showFormError(form, 'Please correct the errors above');
            return;
        }
        
        // Show loading state
        this.showFormLoading(form);
        
        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Submit form
            const result = await this.submitForm(form, data);
            
            if (result.success) {
                this.showFormSuccess(form, result.message || 'Form submitted successfully!');
                this.resetForm(form);
            } else {
                this.showFormError(form, result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(form, 'Something went wrong. Please try again.');
        } finally {
            this.hideFormLoading(form);
        }
    }
    
    /**
     * Submit form data
     */
    async submitForm(form, data) {
        const action = form.getAttribute('action') || '/contact';
        const method = form.getAttribute('method') || 'POST';
        
        // For demo purposes, simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success
                resolve({
                    success: true,
                    message: 'Thank you! Your message has been sent successfully.'
                });
            }, 2000);
        });
        
        // Real implementation would make actual API call:
        /*
        const response = await fetch(action, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
        */
    }
    
    /**
     * Show form loading state
     */
    showFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            const originalText = submitButton.textContent;
            submitButton.setAttribute('data-original-text', originalText);
            submitButton.textContent = 'Sending...';
        }
    }
    
    /**
     * Hide form loading state
     */
    hideFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            
            const originalText = submitButton.getAttribute('data-original-text');
            if (originalText) {
                submitButton.textContent = originalText;
            }
        }
    }
    
    /**
     * Show form success message
     */
    showFormSuccess(form, message) {
        this.removeFormMessage(form);
        
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message form-success';
        messageElement.textContent = message;
        
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeFormMessage(form);
        }, 5000);
    }
    
    /**
     * Show form error message
     */
    showFormError(form, message) {
        this.removeFormMessage(form);
        
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message form-error';
        messageElement.textContent = message;
        
        form.insertBefore(messageElement, form.firstChild);
    }
    
    /**
     * Remove form message
     */
    removeFormMessage(form) {
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    /**
     * Reset form
     */
    resetForm(form) {
        form.reset();
        
        // Clear all field states
        const formConfig = this.forms.find(f => f.element === form);
        if (formConfig) {
            formConfig.fields.forEach(field => {
                this.clearFieldError(field);
            });
        }
    }
    
    /**
     * Get form validators
     */
    getValidators(form) {
        // Can be extended for custom form-level validators
        return [];
    }
    
    /**
     * Get submit handler
     */
    getSubmitHandler(form) {
        // Can be extended for custom submit handlers
        return null;
    }
    
    /**
     * Bind global events
     */
    bindGlobalEvents() {
        // Can be extended for global form events
    }
    
    /**
     * Destroy forms module
     */
    destroy() {
        this.forms.forEach(formConfig => {
            const { element: form } = formConfig;
            
            // Remove event listeners
            form.removeEventListener('submit', this.handleFormSubmit);
            
            // Clear form states
            this.resetForm(form);
        });
        
        this.forms = [];
    }
}

// Auto-initialize if not imported as module
if (typeof window !== 'undefined' && !window.formsModule) {
    window.formsModule = new Forms();
}
