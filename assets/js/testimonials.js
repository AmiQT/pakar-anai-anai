// Testimonials Page JavaScript
// KME Pest Control - Customer Testimonials Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Video Testimonial Play Buttons
    initializeVideoTestimonials();
    
    // Smooth scrolling for testimonial navigation
    initializeSmoothScrolling();
});

// Review form functionality removed - page is now purely informational

/**
 * Initialize Video Testimonial Interactions
 */
function initializeVideoTestimonials() {
    const videoThumbnails = document.querySelectorAll('.video-testimonial .video-placeholder');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoTitle = this.parentElement.querySelector('.video-info h3').textContent;
            
            // For now, show a placeholder message
            // In production, this would open a modal with actual video
            if (typeof showNotification === 'function') {
                showNotification(`Video: "${videoTitle}" - Coming Soon!`, 'info');
            } else {
                alert(`Video: "${videoTitle}" - Coming Soon!`);
            }
        });
        
        // Add hover effect
        thumbnail.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        thumbnail.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize Smooth Scrolling
 */
function initializeSmoothScrolling() {
    // General smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Note: Using showNotification function from main.js to avoid conflicts
