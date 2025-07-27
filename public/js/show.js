// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get product data from global object
    const productData = window.productData;
    
    // Initialize page features
    initializeDeleteModal();
    initializeDateDisplay();
    addInteractiveEffects();
    initializeAnimations();
    
    /**
     * Initialize delete modal functionality
     */
    function initializeDeleteModal() {
        const deleteBtn = document.querySelector('.btn-delete');
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        const deleteForm = document.getElementById('deleteForm');
        const productNameSpan = document.getElementById('productNameToDelete');
        
        if (deleteBtn && deleteForm && productNameSpan) {
            deleteBtn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                // Update modal content
                productNameSpan.textContent = this.getAttribute('data-product-name');
                deleteForm.action = `/products/${productId}?_method=DELETE`;
                
                // Show modal
                deleteModal.show();
            });
            
            // Handle form submission with loading state
            deleteForm.addEventListener('submit', function() {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                
                // Add loading state
                submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>Deleting...';
                submitBtn.disabled = true;
                
                // Reset after timeout (in case of errors)
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 5000);
            });
        }
    }
    
    /**
     * Initialize date display with relative time
     */
    function initializeDateDisplay() {
        const dateElement = document.getElementById('dateAdded');
        if (dateElement) {
            // For now, we'll show "Today" but this could be enhanced to show actual creation date
            const today = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }
    
    /**
     * Add interactive effects to various elements
     */
    function addInteractiveEffects() {
        // Add hover effects to detail rows
        const detailRows = document.querySelectorAll('.detail-row');
        detailRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
        
        // Add click-to-copy functionality for product ID
        const productIdElement = document.querySelector('.product-id');
        if (productIdElement) {
            productIdElement.style.cursor = 'pointer';
            productIdElement.title = 'Click to copy Product ID';
            
            productIdElement.addEventListener('click', function() {
                const textToCopy = this.textContent;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showCopyFeedback(this);
                    }).catch(() => {
                        fallbackCopyText(textToCopy, this);
                    });
                } else {
                    fallbackCopyText(textToCopy, this);
                }
            });
        }
        
        // Add dynamic price animation
        animatePrice();
        
        // Add button loading states
        addButtonLoadingStates();
    }
    
    /**
     * Show copy feedback when product ID is copied
     */
    function showCopyFeedback(element) {
        const original = element.textContent;
        element.textContent = 'Copied!';
        element.style.background = '#28a745';
        element.style.color = 'white';
        
        setTimeout(() => {
            element.textContent = original;
            element.style.background = '#f8f9fa';
            element.style.color = '#495057';
        }, 1500);
    }
    
    /**
     * Fallback copy method for older browsers
     */
    function fallbackCopyText(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(element);
        } catch (err) {
            console.error('Copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Animate the price display
     */
    function animatePrice() {
        const priceAmount = document.querySelector('.price-amount');
        if (priceAmount && productData) {
            const targetPrice = productData.price;
            let currentPrice = 0;
            const duration = 1500; // 1.5 seconds
            const increment = targetPrice / (duration / 16); // 60 FPS
            
            const animateToPrice = () => {
                if (currentPrice < targetPrice) {
                    currentPrice += increment;
                    if (currentPrice > targetPrice) currentPrice = targetPrice;
                    priceAmount.textContent = currentPrice.toFixed(2);
                    requestAnimationFrame(animateToPrice);
                }
            };
            
            // Start animation after a short delay
            setTimeout(animateToPrice, 500);
        }
    }
    
    /**
     * Add loading states to action buttons
     */
    function addButtonLoadingStates() {
        const actionButtons = document.querySelectorAll('.btn-edit, .btn-back');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Don't add loading state to links that navigate away
                if (this.tagName === 'A') return;
                
                const original = this.innerHTML;
                this.innerHTML = '<span class="loading-spinner me-2"></span>Loading...';
                this.disabled = true;
                
                // Reset after timeout
                setTimeout(() => {
                    this.innerHTML = original;
                    this.disabled = false;
                }, 3000);
            });
        });
    }
    
    /**
     * Initialize entrance animations
     */
    function initializeAnimations() {
        // Animate quality badges
        const badges = document.querySelectorAll('.badge-item');
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                badge.style.transition = 'all 0.6s ease';
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
        
        // Animate detail rows
        const detailRows = document.querySelectorAll('.detail-row');
        detailRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.6s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
        
        // Animate action buttons
        const actionButtons = document.querySelectorAll('.action-buttons .btn');
        actionButtons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.6s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 800 + (index * 100));
        });
    }
    
    /**
     * Add scroll-triggered animations for info cards
     */
    function initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s ease';
            observer.observe(card);
        });
    }
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // ESC key closes modal
        if (e.key === 'Escape') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            if (modal) modal.hide();
        }
    });
    
    // Add dynamic category icon effects
    const categoryIcons = document.querySelectorAll('.product-hero-icon, .product-large-icon');
    categoryIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});