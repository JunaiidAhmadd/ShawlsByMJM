// Cart functionality using localStorage
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.setupEventListeners();
    }

    // Initialize event listeners
    setupEventListeners() {
        // Add to cart button
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-name');
                const productPrice = parseFloat(button.getAttribute('data-price'));
                const productImage = button.getAttribute('data-image');
                const quantity = this.getQuantityFromPage() || 1;
                
                this.addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                });
                
                // Show confirmation
                this.showNotification('Product added to cart!');
            });
        });

        // Remove from cart button
        const removeButtons = document.querySelectorAll('.cart__close');
        removeButtons.forEach(button => {
            button.addEventListener('click', event => {
                const row = event.target.closest('tr');
                const productId = row.getAttribute('data-id');
                this.removeFromCart(productId);
                row.remove();
                this.updateCartTotals();
            });
        });

        // Quantity changes
        const qtyButtons = document.querySelectorAll('.pro-qty-2 .qtybtn');
        qtyButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateCartFromUI();
                    this.updateCartTotals();
                }, 100);
            });
        });

        // Update cart button
        const updateCartBtn = document.querySelector('.update__btn');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', event => {
                event.preventDefault();
                this.updateCartFromUI();
                this.showNotification('Cart updated!');
            });
        }

        // Continue shopping button
        const continueShoppingBtn = document.querySelector('.continue__btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', event => {
                event.preventDefault();
                window.location.href = '/shop';
            });
        }

        // Proceed to checkout button
        const checkoutBtn = document.querySelector('.cart__total .primary-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', event => {
                event.preventDefault();
                if (this.cart.length === 0) {
                    this.showNotification('Your cart is empty!');
                } else {
                    window.location.href = '/checkout';
                }
            });
        }
    }

    // Add product to cart
    addToCart(product) {
        const existingProductIndex = this.cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex > -1) {
            // Update quantity if product already exists
            this.cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Add new product to cart
            this.cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.header__nav__option span, .offcanvas__nav__option span');
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });

        // Update cart total
        const cartTotalElements = document.querySelectorAll('.header__nav__option .price, .offcanvas__nav__option .price');
        const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        cartTotalElements.forEach(element => {
            element.textContent = '$' + totalPrice.toFixed(2);
        });
    }

    // Get quantity from product page
    getQuantityFromPage() {
        const quantityInput = document.querySelector('.pro-qty input');
        return quantityInput ? parseInt(quantityInput.value) : 1;
    }

    // Update cart from UI (shopping cart page)
    updateCartFromUI() {
        const rows = document.querySelectorAll('.shopping__cart__table tbody tr');
        const updatedCart = [];
        
        rows.forEach(row => {
            const productId = row.getAttribute('data-id');
            const quantityInput = row.querySelector('.pro-qty-2 input');
            const quantity = parseInt(quantityInput.value);
            
            const existingProduct = this.cart.find(item => item.id === productId);
            if (existingProduct && quantity > 0) {
                existingProduct.quantity = quantity;
                updatedCart.push(existingProduct);
            }
        });
        
        this.cart = updatedCart;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart totals on shopping cart page
    updateCartTotals() {
        const subtotalElement = document.querySelector('.cart__total ul li:first-child span');
        const totalElement = document.querySelector('.cart__total ul li:last-child span');
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (subtotalElement) subtotalElement.textContent = '$ ' + subtotal.toFixed(2);
        if (totalElement) totalElement.textContent = '$ ' + subtotal.toFixed(2);
    }

    // Display notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-content">
                <i class="fa fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add notification styles
        const style = document.createElement('style');
        style.innerHTML = `
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background-color: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                animation: fadeInOut 3s ease-in-out;
            }
            .cart-notification-content {
                display: flex;
                align-items: center;
            }
            .cart-notification i {
                color: #e53637;
                margin-right: 10px;
                font-size: 18px;
            }
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Render cart items on shopping cart page
    renderCartItems() {
        const cartTableBody = document.querySelector('.shopping__cart__table tbody');
        
        if (cartTableBody) {
            if (this.cart.length === 0) {
                cartTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-5">
                            <div class="cart-empty">
                                <h4 class="mb-4">Your cart is empty</h4>
                                <a href="/shop" class="primary-btn">Continue Shopping</a>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                cartTableBody.innerHTML = '';
                
                this.cart.forEach(item => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-id', item.id);
                    
                    row.innerHTML = `
                        <td class="product__cart__item">
                            <div class="product__cart__item__pic">
                                <img src="${item.image}" alt="${item.name}" style="width: 90px; height: 90px; object-fit: cover;">
                            </div>
                            <div class="product__cart__item__text">
                                <h6>${item.name}</h6>
                                <h5>$${item.price.toFixed(2)}</h5>
                            </div>
                        </td>
                        <td class="quantity__item">
                            <div class="quantity">
                                <div class="pro-qty-2">
                                    <span class="fa fa-angle-left dec qtybtn"></span>
                                    <input type="text" value="${item.quantity}">
                                    <span class="fa fa-angle-right inc qtybtn"></span>
                                </div>
                            </div>
                        </td>
                        <td class="cart__price">$ ${(item.price * item.quantity).toFixed(2)}</td>
                        <td class="cart__close"><i class="fa fa-close"></i></td>
                    `;
                    
                    cartTableBody.appendChild(row);
                });
                
                // Re-initialize event listeners for the new elements
                this.setupEventListeners();
            }
            
            this.updateCartTotals();
        }
    }

    // Initialize checkout page with cart data
    initCheckoutPage() {
        const orderItemsContainer = document.querySelector('.checkout__order__products');
        const subtotalElement = document.querySelector('.checkout__order__subtotal span');
        const totalElement = document.querySelector('.checkout__order__total span');
        
        if (orderItemsContainer) {
            // Add hidden input to store cart data
            const cartDataInput = document.createElement('input');
            cartDataInput.type = 'hidden';
            cartDataInput.name = 'orderItems';
            cartDataInput.value = JSON.stringify(this.cart);
            
            const form = document.querySelector('form');
            if (form) form.appendChild(cartDataInput);
            
            // Add total price input
            const totalPriceInput = document.createElement('input');
            totalPriceInput.type = 'hidden';
            totalPriceInput.name = 'totalPrice';
            const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            totalPriceInput.value = totalPrice.toFixed(2);
            if (form) form.appendChild(totalPriceInput);
            
            // Show items in the order summary
            if (this.cart.length === 0) {
                orderItemsContainer.innerHTML = '<p>Your cart is empty</p>';
                if (subtotalElement) subtotalElement.textContent = '$0.00';
                if (totalElement) totalElement.textContent = '$0.00';
            } else {
                orderItemsContainer.innerHTML = '';
                
                // Add header
                orderItemsContainer.innerHTML = `
                    <div class="checkout__order__product__header">
                        <span>Product</span>
                        <span>Total</span>
                    </div>
                `;
                
                // Add items
                this.cart.forEach((item, index) => {
                    const itemRow = document.createElement('div');
                    itemRow.className = 'checkout__order__product';
                    itemRow.innerHTML = `
                        <span>${index + 1}. ${item.name} x ${item.quantity}</span>
                        <span>$ ${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    orderItemsContainer.appendChild(itemRow);
                });
                
                // Update totals
                const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                
                if (subtotalElement) subtotalElement.textContent = '$ ' + subtotal.toFixed(2);
                if (totalElement) totalElement.textContent = '$ ' + subtotal.toFixed(2);
            }
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cart = new ShoppingCart();
    
    // Initialize cart display on shopping cart page
    if (window.location.pathname === '/shopping-cart') {
        cart.renderCartItems();
    }
    
    // Initialize checkout page
    if (window.location.pathname === '/checkout') {
        cart.initCheckoutPage();
    }
    
    // Add data attributes to product cards
    document.querySelectorAll('.product__item').forEach(card => {
        const productId = card.getAttribute('data-id');
        const productName = card.querySelector('.product__item__text h6 a').textContent;
        const productPrice = parseFloat(card.querySelector('.product__item__text .product__price').textContent.replace('$', ''));
        const productImage = card.querySelector('.product__item__pic').getAttribute('data-setbg');
        
        const addToCartBtn = card.querySelector('.add-cart');
        if (addToCartBtn) {
            addToCartBtn.classList.add('add-to-cart');
            addToCartBtn.setAttribute('data-id', productId);
            addToCartBtn.setAttribute('data-name', productName);
            addToCartBtn.setAttribute('data-price', productPrice);
            addToCartBtn.setAttribute('data-image', productImage);
        }
    });
    
    // Add data attributes to product detail page add to cart button
    const detailAddToCartBtn = document.querySelector('.product__details__cart__option .primary-btn');
    if (detailAddToCartBtn) {
        const productId = new URLSearchParams(window.location.search).get('id') || 
                         window.location.pathname.split('/').pop();
        const productName = document.querySelector('.product__details__text h4').textContent;
        const productPrice = parseFloat(document.querySelector('.product__details__text h3').textContent.match(/\$(\d+\.\d+)/)[1]);
        const productImage = document.querySelector('.product__details__pic__item img').getAttribute('src');
        
        detailAddToCartBtn.classList.add('add-to-cart');
        detailAddToCartBtn.setAttribute('data-id', productId);
        detailAddToCartBtn.setAttribute('data-name', productName);
        detailAddToCartBtn.setAttribute('data-price', productPrice);
        detailAddToCartBtn.setAttribute('data-image', productImage);
    }
}); 