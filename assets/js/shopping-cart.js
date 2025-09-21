/**
 * Shopping Cart System for KME Pest Control Products
 * Handles add to cart, cart management, and WhatsApp checkout
 */

class ShoppingCart {
    constructor() {
        this.cart = [];
        this.isOpen = false;
        
        // DOM elements
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.floatingCart = document.getElementById('floatingCart');
        this.cartItems = document.getElementById('cartItems');
        this.cartCount = document.getElementById('cartCount');
        this.cartBadge = document.getElementById('cartBadge');
        this.cartClose = document.getElementById('cartClose');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        // Ensure floating cart element exists
        if (!this.floatingCart) {
            console.warn('⚠️ Floating cart element not found');
        }
        
        this.init();
        
        // Force cart button positioning immediately after initialization
        this.forceCartPosition();
    }
    
    forceCartPosition() {
        // Aggressive cart positioning to ensure it's truly floating
        if (this.floatingCart) {
            const styles = {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: '99999',
                display: 'flex',
                visibility: 'visible',
                opacity: '1',
                pointerEvents: 'auto',
                transform: 'translateZ(0)',
                width: '65px',
                height: '65px'
            };
            
            Object.assign(this.floatingCart.style, styles);
            
            // Also set via setAttribute for extra insurance
            this.floatingCart.setAttribute('style', 
                Object.entries(styles)
                    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value} !important`)
                    .join('; ')
            );
        }
    }
    
    init() {
        this.loadCartFromStorage();
        this.bindEvents();
        this.updateCartUI();
        this.initAddToCartButtons();
        
        // Re-force positioning after DOM is fully ready
        setTimeout(() => {
            this.forceCartPosition();
        }, 100);
    }
    
    bindEvents() {
        // Toggle cart visibility
        this.floatingCart?.addEventListener('click', () => this.toggleCart());
        this.cartClose?.addEventListener('click', () => this.closeCart());
        this.cartOverlay?.addEventListener('click', () => this.closeCart());
        
        // Checkout button
        this.checkoutBtn?.addEventListener('click', () => this.checkout());
        
        // Close cart with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }
    
    initAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productData = {
                    id: button.dataset.product,
                    name: button.dataset.name,
                    category: button.dataset.category,
                    quantity: 1
                };
                
                this.addToCart(productData);
                this.showAddToCartAnimation(button);
            });
        });
    }
    
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showCartNotification(`${product.name} added to cart!`, 'success');
        
        // Auto-open cart after adding item (better UX)
        setTimeout(() => {
            if (!this.isOpen) {
                this.openCart();
            }
        }, 800);
    }
    
    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveCartToStorage();
            this.updateCartUI();
            this.showCartNotification(`${removedItem.name} removed from cart!`, 'info');
        }
    }
    
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartUI();
            }
        }
    }
    
    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart count and badge
        if (this.cartCount) this.cartCount.textContent = totalItems;
        if (this.cartBadge) {
            this.cartBadge.textContent = totalItems;
            if (totalItems > 0) {
                this.cartBadge.classList.add('visible');
            } else {
                this.cartBadge.classList.remove('visible');
            }
        }
        
        // Force floating cart button to always be visible with aggressive positioning
        if (this.floatingCart) {
            this.floatingCart.style.display = 'flex';
            this.floatingCart.style.visibility = 'visible';
            this.floatingCart.style.opacity = '1';
            this.floatingCart.style.pointerEvents = 'auto';
            this.floatingCart.style.position = 'fixed';
            this.floatingCart.style.zIndex = '99999';
            this.floatingCart.style.bottom = '30px';
            this.floatingCart.style.right = '30px';
            this.floatingCart.style.transform = 'translateZ(0)';
        }
        
        // Render cart items
        this.renderCartItems();
        
        // Update checkout button state
        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = totalItems === 0;
            this.checkoutBtn.style.opacity = totalItems === 0 ? '0.5' : '1';
        }
    }
    
    renderCartItems() {
        if (!this.cartItems) return;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <span>Add some products to get started!</span>
                </div>
            `;
            return;
        }
        
        this.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-category">${item.category}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn qty-decrease" data-product-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn qty-increase" data-product-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Bind cart item events
        this.bindCartItemEvents();
    }
    
    bindCartItemEvents() {
        // Quantity controls
        const qtyDecrease = this.cartItems.querySelectorAll('.qty-decrease');
        const qtyIncrease = this.cartItems.querySelectorAll('.qty-increase');
        const removeItems = this.cartItems.querySelectorAll('.remove-item');
        
        qtyDecrease.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        qtyIncrease.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        removeItems.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }
    
    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }
    
    openCart() {
        this.isOpen = true;
        document.body.classList.add('cart-open');
        this.cartSidebar?.classList.add('active');
        this.cartOverlay?.classList.add('active');
    }
    
    closeCart() {
        this.isOpen = false;
        document.body.classList.remove('cart-open');
        this.cartSidebar?.classList.remove('active');
        this.cartOverlay?.classList.remove('active');
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showCartNotification('Your cart is empty!', 'warning');
            return;
        }
        
        // Generate WhatsApp message
        let message = "Assalamualaikum KME Pest Control\n\n";
        message += "Saya berminat untuk order produk seperti berikut:\n\n";
        message += "=== ORDER DETAILS ===\n\n";
        
        this.cart.forEach((item, index) => {
            message += `${index + 1}. Produk: ${item.name}\n`;
            message += `   Kategori: ${item.category}\n`;
            message += `   Kuantiti: ${item.quantity} unit\n`;
            message += "   ____________________\n\n";
        });
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        message += `JUMLAH KESELURUHAN: ${totalItems} unit\n\n`;
        message += "=== MAKLUMAT DIPERLUKAN ===\n\n";
        message += "Boleh saya dapatkan maklumat berikut:\n\n";
        message += "1. Harga untuk setiap produk\n";
        message += "2. Ketersediaan stok\n";
        message += "3. Kos penghantaran\n";
        message += "4. Kaedah pembayaran\n";
        message += "5. Masa penghantaran\n\n";
        message += "Terima kasih atas perkhidmatan tuan/puan.";
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        
        // Desktop: open WhatsApp Web directly (skips the "Continue to Chat" landing)
        // Mobile: open wa.me deep link
        const WHATSAPP_PHONE = '601129623741'; // 011-2962 3741
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            const mobileURL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
            window.open(mobileURL, '_blank');
        } else {
            // Try to open the desktop app first via custom protocol, then fall back to WhatsApp Web
            const appURL = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;
            const webURL = `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;

            // Navigate current tab to app (Edge/Chrome will prompt to open external app)
            // If protocol isn't handled, fallback opens WhatsApp Web in a new tab
            let fallbackTimer = setTimeout(() => {
                window.open(webURL, '_blank');
            }, 900);

            try {
                window.location.href = appURL;
            } catch (e) {
                clearTimeout(fallbackTimer);
                window.open(webURL, '_blank');
            }
        }
        
        // Show success message
        this.showCartNotification('Redirecting to WhatsApp...', 'success');
        
        // Optional: Clear cart after checkout
        // this.clearCart();
    }
    
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();
        this.showCartNotification('Cart cleared!', 'info');
    }
    
    saveCartToStorage() {
        try {
            localStorage.setItem('kme_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    }
    
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('kme_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
            this.cart = [];
        }
    }
    
    showAddToCartAnimation(button) {
        const cartIcon = document.getElementById('floatingCart') || document.getElementById('cartBadge');
        const productImg = button.closest('.product-card')?.querySelector('img');
        
        // Fallback to simple pulse if we cannot find required elements
        if (!cartIcon || !productImg) {
            button.classList.add('added-to-cart');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                button.classList.remove('added-to-cart');
                button.innerHTML = originalHTML;
            }, 1200);
            return;
        }
        
        // Clone product image and animate to cart icon position (fly-to-cart)
        const rectStart = productImg.getBoundingClientRect();
        const rectEnd = cartIcon.getBoundingClientRect();
        const clone = productImg.cloneNode(true);
        
        Object.assign(clone.style, {
            position: 'fixed',
            left: rectStart.left + 'px',
            top: rectStart.top + 'px',
            width: rectStart.width + 'px',
            height: rectStart.height + 'px',
            borderRadius: '8px',
            zIndex: 9999,
            transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 600ms',
            pointerEvents: 'none',
            willChange: 'transform, opacity'
        });
        
        document.body.appendChild(clone);
        
        // Trigger the transform on the next frame
        requestAnimationFrame(() => {
            const dx = rectEnd.left - rectStart.left;
            const dy = rectEnd.top - rectStart.top;
            const scale = Math.max(0.2, 40 / rectStart.width);
            clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
            clone.style.opacity = '0.6';
        });
        
        // Clean up and pop the badge
        setTimeout(() => {
            if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
            cartIcon.classList.add('badge-pop');
            setTimeout(() => cartIcon.classList.remove('badge-pop'), 300);
        }, 650);
    }
    
    showCartNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Public API
    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getCartItems() {
        return [...this.cart];
    }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
    
    // Make cart globally accessible for debugging
    if (typeof window !== 'undefined') {
        window.cart = window.shoppingCart;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}
