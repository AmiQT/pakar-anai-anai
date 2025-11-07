// Gallery Page JavaScript
// KME Pest Control - Gallery Filtering and Modal Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Gallery Filtering
    initializeGalleryFilter();
    
    // Initialize Modal functionality
    initializeModal();
    
    // Initialize Load More functionality
    initializeLoadMore();
});

/**
 * Initialize Gallery Filter Functionality
 */
function initializeGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    // Limit for displayed items per category
    const ITEMS_LIMIT = 5;
    let currentFilter = 'all';
    let isShowingAll = false;
    
    // Apply initial filter limit (for "all" category)
    applyFilterWithLimit('all', ITEMS_LIMIT);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            currentFilter = filterValue;
            
            // Reset showing all flag when changing filters
            isShowingAll = false;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter with limit
            applyFilterWithLimit(filterValue, ITEMS_LIMIT);
            
            // Reset load more button
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Lihat Semua';
                loadMoreBtn.disabled = false;
                loadMoreBtn.style.display = 'block';
            }
        });
    });
    
    // Function to apply filter with limit (only for 'all' category)
    function applyFilterWithLimit(filterValue, limit) {
        let count = 0;
        
        galleryItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                // Apply limit only to 'all' category, show all items for specific categories
                if ((filterValue === 'all' && (count < limit || isShowingAll)) || filterValue !== 'all') {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
                count++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update load more button visibility - only for 'all' category
        if (loadMoreBtn) {
            const totalItems = Array.from(galleryItems).filter(item => {
                const cats = item.getAttribute('data-category');
                return filterValue === 'all' || cats.includes(filterValue);
            }).length;
            
            // Only show button for 'all' category and if there are more items than the limit
            loadMoreBtn.style.display = (filterValue === 'all' && totalItems > limit && !isShowingAll) ? 'block' : 'none';
        }
        
        // Show feedback
        const shouldApplyLimit = filterValue === 'all' && !isShowingAll;
        showFilterFeedback(filterValue, galleryItems, count, shouldApplyLimit ? limit : null);
    }
    
    // Handle Load More button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
            this.disabled = true;
            
            setTimeout(() => {
                isShowingAll = true;
                applyFilterWithLimit(currentFilter, ITEMS_LIMIT);
                this.innerHTML = '<i class="fas fa-check"></i> Semua Dimuat';
                this.style.display = 'none';
            }, 500);
        });
    }
}

/**
 * Show Filter Feedback
 */
function showFilterFeedback(filterValue, galleryItems, visibleCount, limit) {
    // If visibleCount is not provided, calculate it
    const visibleItems = visibleCount || Array.from(galleryItems).filter(item => 
        item.style.display !== 'none'
    ).length;
    
    // Define filter display names for Malay names
    const filterDisplayNames = {
        'all': 'All Projects',
        'baiting': 'Baiting',
        'corrective': 'Corrective Treatment',
        'pest-protection': 'Pest Protection',
        'fogging': 'Fogging',
        'soil-treatment': 'Soil Treatment',
        'kawalan-kelawar': 'Kawalan Kelawar',
        'kawalan-hama': 'Kawalan Hama/Pepijat/Kutu',
        'trsbs': 'Pemasangan TRSBS',
        'sulfur-ular': 'Sulfur/Kawalan Ular'
    };
    
    // You can add notification here if showNotification exists
    if (typeof showNotification === 'function') {
        const filterName = filterDisplayNames[filterValue] || 
                          filterValue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (limit) {
            const totalItems = Array.from(galleryItems).filter(item => {
                const cats = item.getAttribute('data-category');
                return filterValue === 'all' || cats.includes(filterValue);
            }).length;
            
            if (totalItems > limit) {
                showNotification(`Menunjukkan ${visibleItems} dari ${totalItems} projek ${filterName}`, 'info');
            } else {
                showNotification(`Menunjukkan ${visibleItems} projek ${filterName}`, 'info');
            }
        } else {
            showNotification(`Menunjukkan semua ${visibleItems} projek ${filterName}`, 'info');
        }
    }
}

/**
 * Initialize Modal Functionality
 */
function initializeModal() {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (!modal) return;
    
    // Open modal on view button click
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId, modalBody);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Open Project Modal with Content
 */
function openProjectModal(projectId, modalBody) {
    // Project data (in real implementation, this would come from API)
    const projectData = {
        'soil-1': {
            title: 'Soil Treatment - Residential Project',
            location: 'Kuantan, Pahang',
            description: 'Comprehensive soil treatment for a residential property in Kuantan. This project involved pre-construction termite protection for a new banglo construction.',
            details: [
                'Property Type: Residential Banglo',
                'Treatment Area: 2,500 sq ft',
                'Duration: 2 days',
                'Warranty: 7 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'soil-2': {
            title: 'Commercial Soil Treatment',
            location: 'Temerloh, Pahang',
            description: 'Large-scale soil treatment for a 5-story office complex in Temerloh. Professional grade treatment with extended warranty.',
            details: [
                'Property Type: Commercial Office Complex',
                'Treatment Area: 15,000 sq ft',
                'Duration: 5 days',
                'Warranty: 10 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'bat-1': {
            title: 'School Bat Prevention',
            location: 'Pekan, Pahang',
            description: 'Bat exclusion system installation for a secondary school in Pekan. Humane and effective solution.',
            details: [
                'Property Type: Educational Institution',
                'Coverage Area: Multiple buildings',
                'Duration: 3 days',
                'Warranty: 5 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'bat-2': {
            title: 'Residential Bat Prevention',
            location: 'Kota Bharu, Kelantan',
            description: 'Bat prevention solution for a terrace house in Kota Bharu. Complete exclusion system installation.',
            details: [
                'Property Type: Terrace House',
                'Treatment Area: Roof and attic spaces',
                'Duration: 1 day',
                'Warranty: 3 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'corrective-1': {
            title: 'Emergency Treatment',
            location: 'Bentong, Pahang',
            description: 'Emergency response for active termite infestation. Fast and effective corrective treatment.',
            details: [
                'Property Type: Residential House',
                'Treatment Type: Emergency Response',
                'Duration: 1 day',
                'Warranty: 5 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'corrective-2': {
            title: 'Warehouse Treatment',
            location: 'Kuala Terengganu',
            description: 'Corrective treatment for a large warehouse facility in Kuala Terengganu.',
            details: [
                'Property Type: Industrial Warehouse',
                'Treatment Area: 50,000 sq ft',
                'Duration: 7 days',
                'Warranty: 7 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'before-after-1': {
            title: 'Before & After Structural Repair',
            location: 'Raub, Pahang',
            description: 'Complete structural repair and restoration after termite damage. Amazing transformation results.',
            details: [
                'Property Type: Heritage Building',
                'Repair Type: Structural Restoration',
                'Duration: 14 days',
                'Warranty: 10 years'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'equipment-1': {
            title: 'Professional Equipment in Action',
            location: 'Various Locations',
            description: 'Our state-of-the-art injection equipment for soil treatment applications.',
            details: [
                'Equipment: High-pressure injection system',
                'Chemical: Premium termiticide',
                'Coverage: Deep soil penetration',
                'Standard: International quality'
            ],
            images: ['../assets/images/image-placeholder.svg']
        },
        'team-1': {
            title: 'Professional Team at Work',
            location: 'Various Locations',
            description: 'Our certified and experienced team providing professional pest control services.',
            details: [
                'Team Size: 14 trained professionals',
                'Certification: Licensed pest control specialists',
                'Experience: 15+ years combined',
                'Coverage: Pahang & Terengganu'
            ],
            images: ['../assets/images/image-placeholder.svg']
        }
    };
    
    const project = projectData[projectId];
    if (!project) {
        modalBody.innerHTML = '<p>Project details not available.</p>';
        return;
    }
    
    modalBody.innerHTML = `
        <div class="modal-project-content">
            <div class="modal-project-header">
                <h2>${project.title}</h2>
                <p class="modal-location"><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
            </div>
            <div class="modal-project-image">
                <img src="${project.images[0]}" alt="${project.title}" />
            </div>
            <div class="modal-project-details">
                <h3>Project Description</h3>
                <p>${project.description}</p>
                
                <h3>Project Details</h3>
                <ul>
                    ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

/**
 * Initialize Load More Functionality
 * Note: This is now handled within the initializeGalleryFilter function
 */
function initializeLoadMore() {
    // The load more functionality is now handled in the gallery filter function
    // This function is kept for backward compatibility
}

// Add CSS for modal content
const modalStyles = `
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: white;
    margin: 2% auto;
    padding: 0;
    border-radius: 15px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #666;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1001;
}

.modal-close:hover {
    color: #333;
}

.modal-project-content {
    padding: 30px;
}

.modal-project-header h2 {
    color: #1e293b;
    margin-bottom: 10px;
    font-size: 1.8rem;
}

.modal-location {
    color: #64748b;
    margin-bottom: 20px;
    font-size: 1rem;
}

.modal-project-image {
    margin: 20px 0;
    text-align: center;
}

.modal-project-image img {
    max-width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
}

.modal-project-details h3 {
    color: #1e293b;
    margin: 25px 0 15px;
    font-size: 1.3rem;
}

.modal-project-details p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 20px;
}

.modal-project-details ul {
    list-style: none;
    padding: 0;
}

.modal-project-details li {
    color: #64748b;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
}

.modal-project-details li:before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
    margin-right: 10px;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .modal-content {
        margin: 5% auto;
        width: 95%;
    }
    
    .modal-project-content {
        padding: 20px;
    }
    
    .modal-project-header h2 {
        font-size: 1.5rem;
    }
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);
