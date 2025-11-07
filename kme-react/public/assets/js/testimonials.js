// Testimonials Page JavaScript
// KME Pest Control - Customer Testimonials Functionality

document.addEventListener('DOMContentLoaded', function() {

    // Video Testimonial Play Buttons
    initializeVideoTestimonials();

    // Smooth scrolling for testimonial navigation
    initializeSmoothScrolling();

    // Testimonials Carousel Functionality
    initializeTestimonialsCarousel();

    // Review Highlights Carousel
    initializeReviewHighlightsCarousel();
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

/**
 * Initialize Testimonials Carousel
 */
function initializeTestimonialsCarousel() {
    const carouselContainer = document.querySelector('.testimonials-carousel-container');
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!carouselContainer || !carousel) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentIndex = 0;

    // Check if mobile - disable carousel for mobile
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Calculate items per view based on screen size
    function getItemsPerView() {
        if (isMobile()) return totalCards; // Mobile: show all cards
        if (window.innerWidth < 1024) return 2; // Tablet: 2 cards
        return 3; // Desktop: 3 cards
    }

    // Calculate total slides
    function getTotalSlides() {
        const itemsPerView = getItemsPerView();
        return Math.ceil(totalCards / itemsPerView);
    }

    // Update carousel position
    function updateCarousel() {
        const itemsPerView = getItemsPerView();

        // If mobile, show all cards without transform
        if (isMobile()) {
            carousel.style.transform = 'translateX(0)';
            return;
        }

        const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth;
        const gap = 20; // gap between cards
        const totalWidth = cardWidth + gap;

        carousel.style.transform = `translateX(-${currentIndex * totalWidth * itemsPerView}px)`;

        // Update dots (only if not mobile)
        if (!isMobile()) {
            updateDots();
        }

        // Update button states (only if buttons exist and not mobile)
        if (prevBtn && !isMobile()) prevBtn.disabled = currentIndex === 0;
        if (nextBtn && !isMobile()) nextBtn.disabled = currentIndex >= getTotalSlides() - 1;
    }

    // Update dot indicators
    function updateDots() {
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    // Create dots (only for non-mobile)
    function createDots() {
        if (dotsContainer && !isMobile()) {
            dotsContainer.innerHTML = '';
            const totalSlides = getTotalSlides();

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        } else if (dotsContainer && isMobile()) {
            // Hide dots on mobile
            dotsContainer.style.display = 'none';
        }
    }

    // Event listeners (only for buttons if they exist)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < getTotalSlides() - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Keyboard navigation
    carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentIndex < getTotalSlides() - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentIndex < getTotalSlides() - 1) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
        }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
        // Reset to first slide when resizing
        currentIndex = 0;
        updateCarousel();
        createDots();

        // Add small delay to ensure DOM has updated
        setTimeout(() => {
            updateCarousel();
        }, 100);
    });

    // Initialize
    createDots();
    updateCarousel();

    // Handle initial mobile state
    if (isMobile()) {
        carousel.style.display = 'block';
        carousel.style.flexDirection = 'column';
    }
}

/**
 * Initialize Review Highlights Carousel
 */
function initializeReviewHighlightsCarousel() {
    const highlightsGrid = document.querySelector('.highlights-grid');

    if (!highlightsGrid) return;

    const highlights = highlightsGrid.querySelectorAll('.highlight-item');
    const totalHighlights = highlights.length;

    if (totalHighlights <= 4) return; // Don't carousel if 4 or fewer items

    let currentIndex = 0;
    const itemsPerView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 4);

    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'review-highlights-carousel-container';

    const carousel = document.createElement('div');
    carousel.className = 'review-highlights-carousel';

    // Move highlights to carousel
    highlights.forEach((highlight, index) => {
        highlight.style.flex = `0 0 calc(${100 / itemsPerView}% - 15px)`;
        carousel.appendChild(highlight);
    });

    carouselContainer.appendChild(carousel);
    highlightsGrid.parentNode.insertBefore(carouselContainer, highlightsGrid);
    highlightsGrid.remove();

    // Add navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous highlights');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next highlights');

    carouselContainer.appendChild(prevBtn);
    carouselContainer.appendChild(nextBtn);

    // Add dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    const totalSlides = Math.ceil(totalHighlights / itemsPerView);
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateHighlightsCarousel();
        });
        dotsContainer.appendChild(dot);
    }

    carouselContainer.appendChild(dotsContainer);

    // Update carousel position
    function updateHighlightsCarousel() {
        const itemWidth = carousel.querySelector('.highlight-item').offsetWidth;
        const gap = 20;
        const totalWidth = itemWidth + gap;

        carousel.style.transform = `translateX(-${currentIndex * totalWidth * itemsPerView}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - 1;
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateHighlightsCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateHighlightsCarousel();
        }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
        const newItemsPerView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 4);
        if (newItemsPerView !== itemsPerView) {
            location.reload(); // Simple solution for resize
        }
    });

    // Initialize
    updateHighlightsCarousel();
}

// Note: Using showNotification function from main.js to avoid conflicts