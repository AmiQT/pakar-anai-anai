/* ========================================
   KME Pest Control - WordPress API Integration
   Handles all WordPress REST API communications
======================================== */

'use strict';

// ========================================
// API CONFIGURATION
// ========================================

const API_CONFIG = {
    BASE_URL: 'https://pakaranaianai.com/wp-json/wp/v2/',
    TIMEOUT: 10000,
    CACHE_DURATION: 300000, // 5 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// API Cache
const API_CACHE = new Map();

// ========================================
// WORDPRESS API CLASS
// ========================================

class WordPressAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.cache = API_CACHE;
        
        // Bind methods
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.getPages = this.getPages.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.getMenus = this.getMenus.bind(this);
    }

    /**
     * Generic GET request with caching and retry logic
     */
    async get(endpoint, params = {}, useCache = true) {
        const cacheKey = this.generateCacheKey(endpoint, params);
        
        // Check cache first
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
                return cached.data;
            }
        }

        // Build URL with parameters
        const url = this.buildURL(endpoint, params);
        
        // Retry logic
        for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
            try {
                const response = await this.fetchWithTimeout(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Cache successful response
                if (useCache) {
                    this.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now()
                    });
                }
                
                return data;
                
            } catch (error) {
                console.warn(`API request attempt ${attempt} failed:`, error.message);
                
                if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
                    throw new Error(`API request failed after ${API_CONFIG.RETRY_ATTEMPTS} attempts: ${error.message}`);
                }
                
                // Wait before retry
                await this.delay(API_CONFIG.RETRY_DELAY * attempt);
            }
        }
    }

    /**
     * Generic POST request
     */
    async post(endpoint, data = {}, headers = {}) {
        const url = this.baseURL + endpoint;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        try {
            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
            
        } catch (error) {
            throw new Error(`POST request failed: ${error.message}`);
        }
    }

    /**
     * Fetch with timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
            
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Build URL with query parameters
     */
    buildURL(endpoint, params) {
        const url = new URL(this.baseURL + endpoint);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        
        return url.toString();
    }

    /**
     * Generate cache key
     */
    generateCacheKey(endpoint, params) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }

    /**
     * Delay utility for retries
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========================================
    // WORDPRESS SPECIFIC METHODS
    // ========================================

    /**
     * Get all pages
     */
    async getPages(params = {}) {
        const defaultParams = {
            per_page: 100,
            status: 'publish',
            _embed: true
        };

        return await this.get('pages', { ...defaultParams, ...params });
    }

    /**
     * Get page by slug
     */
    async getPageBySlug(slug) {
        const pages = await this.getPages({ slug });
        return pages.length > 0 ? pages[0] : null;
    }

    /**
     * Get page by ID
     */
    async getPageById(id) {
        return await this.get(`pages/${id}`, { _embed: true });
    }

    /**
     * Get all posts
     */
    async getPosts(params = {}) {
        const defaultParams = {
            per_page: 10,
            status: 'publish',
            _embed: true
        };

        return await this.get('posts', { ...defaultParams, ...params });
    }

    /**
     * Get post by slug
     */
    async getPostBySlug(slug) {
        const posts = await this.getPosts({ slug });
        return posts.length > 0 ? posts[0] : null;
    }

    /**
     * Get menus (requires custom endpoint or plugin)
     */
    async getMenus() {
        try {
            return await this.get('menus');
        } catch (error) {
            console.warn('Menu endpoint not available:', error.message);
            return [];
        }
    }

    /**
     * Get menu by location
     */
    async getMenuByLocation(location) {
        try {
            return await this.get(`menus/${location}`);
        } catch (error) {
            console.warn(`Menu location '${location}' not found:`, error.message);
            return null;
        }
    }

    /**
     * Get media/attachments
     */
    async getMedia(params = {}) {
        const defaultParams = {
            per_page: 50,
            status: 'inherit'
        };

        return await this.get('media', { ...defaultParams, ...params });
    }

    /**
     * Get categories
     */
    async getCategories(params = {}) {
        const defaultParams = {
            per_page: 100,
            hide_empty: true
        };

        return await this.get('categories', { ...defaultParams, ...params });
    }

    /**
     * Get tags
     */
    async getTags(params = {}) {
        const defaultParams = {
            per_page: 100,
            hide_empty: true
        };

        return await this.get('tags', { ...defaultParams, ...params });
    }

    /**
     * Search content
     */
    async search(query, params = {}) {
        const defaultParams = {
            search: query,
            per_page: 20,
            _embed: true
        };

        return await this.get('search', { ...defaultParams, ...params });
    }

    /**
     * Submit contact form (requires custom endpoint)
     */
    async submitContactForm(formData) {
        try {
            return await this.post('contact-form', formData);
        } catch (error) {
            console.error('Contact form submission failed:', error);
            throw error;
        }
    }

    /**
     * Submit booking form (requires custom endpoint)
     */
    async submitBookingForm(bookingData) {
        try {
            return await this.post('booking-form', bookingData);
        } catch (error) {
            console.error('Booking form submission failed:', error);
            throw error;
        }
    }

    // ========================================
    // CACHE MANAGEMENT
    // ========================================

    /**
     * Clear all cache
     */
    clearCache() {
        this.cache.clear();
        console.log('API cache cleared');
    }

    /**
     * Clear specific cache entry
     */
    clearCacheEntry(endpoint, params = {}) {
        const cacheKey = this.generateCacheKey(endpoint, params);
        this.cache.delete(cacheKey);
    }

    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// ========================================
// CONTENT LOADER CLASS
// ========================================

class ContentLoader {
    constructor(api) {
        this.api = api;
        this.loadedContent = new Map();
    }

    /**
     * Load homepage content
     */
    async loadHomepageContent() {
        try {
            const homepage = await this.api.getPageBySlug('homepage') || 
                            await this.api.getPageBySlug('home') ||
                            await this.api.getPageById(1);

            if (homepage) {
                this.updatePageContent(homepage);
                this.loadedContent.set('homepage', homepage);
            }

            return homepage;
        } catch (error) {
            console.error('Failed to load homepage content:', error);
            return null;
        }
    }

    /**
     * Load page content by slug
     */
    async loadPageContent(slug) {
        try {
            const page = await this.api.getPageBySlug(slug);
            
            if (page) {
                this.updatePageContent(page);
                this.loadedContent.set(slug, page);
            }

            return page;
        } catch (error) {
            console.error(`Failed to load page '${slug}':`, error);
            return null;
        }
    }

    /**
     * Update page content in DOM
     */
    updatePageContent(page) {
        // Update title
        document.title = `${page.title.rendered} - KME Pest Control`;
        
        // Update meta description if available
        if (page.excerpt && page.excerpt.rendered) {
            this.updateMetaDescription(page.excerpt.rendered.replace(/<[^>]*>/g, ''));
        }

        // Update main content if container exists
        const contentContainer = document.getElementById('dynamic-content');
        if (contentContainer && page.content && page.content.rendered) {
            contentContainer.innerHTML = page.content.rendered;
        }
    }

    /**
     * Update meta description
     */
    updateMetaDescription(description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description.substring(0, 160);
    }

    /**
     * Load and display recent posts/testimonials
     */
    async loadRecentPosts(container, limit = 3) {
        try {
            const posts = await this.api.getPosts({ per_page: limit });
            
            if (posts && posts.length > 0) {
                this.renderPosts(container, posts);
            }

            return posts;
        } catch (error) {
            console.error('Failed to load recent posts:', error);
            return [];
        }
    }

    /**
     * Render posts in container
     */
    renderPosts(container, posts) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        if (!container) return;

        const postsHTML = posts.map(post => `
            <div class="post-card">
                <h3>${post.title.rendered}</h3>
                <div class="post-excerpt">
                    ${post.excerpt.rendered}
                </div>
                <div class="post-meta">
                    <span class="post-date">${new Date(post.date).toLocaleDateString('ms-MY')}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = postsHTML;
    }

    /**
     * Get loaded content
     */
    getLoadedContent(key) {
        return this.loadedContent.get(key);
    }
}

// ========================================
// INITIALIZATION & EXPORT
// ========================================

// Create global API instance
window.wpAPI = new WordPressAPI();
window.contentLoader = new ContentLoader(window.wpAPI);

// Auto-load homepage content if on homepage
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}

async function initializeAPI() {
    try {
        // Load homepage content if we're on the homepage
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            await window.contentLoader.loadHomepageContent();
        }

        // Load recent posts for reviews section
        const reviewsContainer = document.getElementById('reviews-container');
        if (reviewsContainer) {
            await window.contentLoader.loadRecentPosts(reviewsContainer, 3);
        }

        console.log('WordPress API initialized successfully');
    } catch (error) {
        console.error('Failed to initialize WordPress API:', error);
    }
}

// Export for external use
window.KME_API = {
    api: window.wpAPI,
    contentLoader: window.contentLoader,
    config: API_CONFIG,
    cache: API_CACHE
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clear cache if it gets too large
    if (API_CACHE.size > 50) {
        API_CACHE.clear();
    }
});
