/*
 * KME Pest Control - Testimonial Carousel
 * Modern, responsive testimonial carousel with smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initTestimonialCarousel();
});

function initTestimonialCarousel() {
    // Get carousel elements
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.querySelector('.carousel-navigation .carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-navigation .carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-navigation .carousel-dots');
    
    // If any element is missing, exit
    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) {
        console.warn('Testimonial carousel elements not found');
        return;
    }
    
    // Get all testimonial cards
    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    
    // Initialize index and variables
    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Responsive settings
    function getItemsPerView() {
        if (window.innerWidth < 768) {
            return 1; // Mobile: 1 card
        } else if (window.innerWidth < 1024) {
            return 2; // Tablet: 2 cards
        } else {
            return 3; // Desktop: 3 cards
        }
    }
    
    // Calculate total slides
    function getTotalSlides() {
        return Math.ceil(totalCards / getItemsPerView());
    }
    
    // Create dot indicators
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = getTotalSlides();
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = i === currentIndex ? 'carousel-dot active' : 'carousel-dot';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => {
                if (isAnimating) return;
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dot indicators
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === getTotalSlides() - 1;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = index;
        
        const itemWidth = cards[0].offsetWidth;
        const gapSize = 20; // Same as gap in CSS
        const itemsPerView = getItemsPerView();
        const offset = (itemWidth + gapSize) * currentIndex * itemsPerView;
        
        // Apply transform with smooth animation
        carousel.style.transition = 'transform 0.5s ease';
        carousel.style.transform = `translateX(-${offset}px)`;
        
        // Update UI indicators
        updateDots();
        updateButtons();
        
        // Remove any special styling from previous active slides
        cards.forEach(card => card.classList.remove('active-slide'));
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
        
        // Reset autoplay timer if enabled
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex < getTotalSlides() - 1) {
            goToSlide(currentIndex + 1);
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }
    
    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex < getTotalSlides() - 1) {
                nextSlide();
            } else {
                goToSlide(0); // Loop back to first slide
            }
        }, 8000); // 8 seconds interval - dipanjangkan untuk user boleh baca testimonial
    }
    
    // Handle window resize
    function handleResize() {
        // Get current items per view before resize
        const prevItemsPerView = getItemsPerView();
        
        // Small delay to ensure DOM has updated
        setTimeout(() => {
            // Get new items per view after resize
            const newItemsPerView = getItemsPerView();
            
            // If items per view changed, recreate dots and reposition
            if (prevItemsPerView !== newItemsPerView) {
                createDots();
                
                // Adjust current index to maintain position
                currentIndex = Math.min(currentIndex, getTotalSlides() - 1);
                
                // Update without animation
                const itemWidth = cards[0].offsetWidth;
                const gapSize = 20;
                const offset = (itemWidth + gapSize) * currentIndex * newItemsPerView;
                
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(-${offset}px)`;
                
                // Force reflow
                carousel.offsetHeight;
                
                // Re-enable transitions
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease';
                }, 50);
                
                updateButtons();
            }
        }, 100);
    }
    
    // Setup touch events for mobile
    function setupTouchEvents() {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (isAnimating) return;
            
            touchEndX = e.touches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            // Visual feedback during swiping
            if (Math.abs(diff) > 5) {
                const resistance = 3; // Higher number = more resistance
                const currentOffset = (currentIndex * getItemsPerView() * (cards[0].offsetWidth + 20));
                const dragOffset = diff / resistance;
                
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(-${currentOffset + dragOffset}px)`;
            }
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            if (isAnimating) return;
            
            const diff = touchStartX - touchEndX;
            const threshold = 50; // Minimum distance to trigger swipe
            
            // Restore transition
            carousel.style.transition = 'transform 0.5s ease';
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < getTotalSlides() - 1) {
                    nextSlide();
                } else if (diff < 0 && currentIndex > 0) {
                    prevSlide();
                } else {
                    // Snap back if at the end
                    const itemWidth = cards[0].offsetWidth;
                    const gapSize = 20;
                    const offset = (itemWidth + gapSize) * currentIndex * getItemsPerView();
                    carousel.style.transform = `translateX(-${offset}px)`;
                }
            } else {
                // Snap back if swipe not far enough
                const itemWidth = cards[0].offsetWidth;
                const gapSize = 20;
                const offset = (itemWidth + gapSize) * currentIndex * getItemsPerView();
                carousel.style.transform = `translateX(-${offset}px)`;
            }
        });
    }
    
    // Initialize carousel
    function initializeCarousel() {
        createDots();
        updateButtons();
        
        // Add event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Add side navigation buttons for desktop
        const sideNavPrevBtn = document.querySelector('.side-nav-btn.prev');
        const sideNavNextBtn = document.querySelector('.side-nav-btn.next');
        
        if (sideNavPrevBtn) {
            sideNavPrevBtn.addEventListener('click', prevSlide);
        }
        
        if (sideNavNextBtn) {
            sideNavNextBtn.addEventListener('click', nextSlide);
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Setup touch events
        setupTouchEvents();
        
        // Make first card featured by default
        if (cards[0]) {
            cards[0].classList.add('featured');
        }
        
        // Set up resize handler
        window.addEventListener('resize', handleResize);
        
        // Start autoplay
        startAutoplay();
        
        // Pause autoplay on hover
        const carouselContainer = carousel.parentElement;
        carouselContainer.addEventListener('mouseenter', () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoplay();
        });
        
        // Add ARIA attributes for accessibility
        carousel.setAttribute('aria-roledescription', 'carousel');
        carousel.setAttribute('aria-label', 'Customer Testimonials');
        
        cards.forEach((card, i) => {
            card.setAttribute('role', 'group');
            card.setAttribute('aria-roledescription', 'slide');
            card.setAttribute('aria-label', `${i + 1} of ${totalCards}`);
        });
    }
    
    // Start the carousel
    initializeCarousel();
}
